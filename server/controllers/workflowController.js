import Workflow from "../models/Workflow.js";
import Groq from "groq-sdk";

// ── Save ──────────────────────────────────────────────────────────────────────
export const saveWorkflow = async (req, res) => {
  try {
    const { nodes, edges } = req.body;
    const existing = await Workflow.findOne({ user: req.user.id });
    if (existing) {
      existing.nodes = nodes;
      existing.edges = edges;
      await existing.save();
    } else {
      await Workflow.create({ user: req.user.id, nodes, edges });
    }
    res.json({ message: "Workflow saved" });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ── Load ──────────────────────────────────────────────────────────────────────
export const loadWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findOne({ user: req.user.id });
    if (!workflow) return res.json({ nodes: [], edges: [] });
    res.json({ nodes: workflow.nodes, edges: workflow.edges });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Execute ───────────────────────────────────────────────────────────────────
export const executeWorkflow = async (req, res) => {
  try {
    const { nodes, edges } = req.body;
    if (!nodes?.length) return res.status(400).json({ message: "No nodes to execute" });

    const adjMap = {};
    edges.forEach(e => {
      if (!adjMap[e.source]) adjMap[e.source] = [];
      adjMap[e.source].push(e.target);
    });

    const hasIncoming = new Set(edges.map(e => e.target));
    const startNodes = nodes.filter(n => !hasIncoming.has(n.id));

    const queue = [...startNodes.map(n => n.id)];
    const visited = new Set();
    const executionOrder = [];
    while (queue.length) {
      const curr = queue.shift();
      if (visited.has(curr)) continue;
      visited.add(curr);
      executionOrder.push(curr);
      (adjMap[curr] || []).forEach(next => queue.push(next));
    }

    const results = {};
    for (const nodeId of executionOrder) {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) continue;
      const type = node.data?.nodeType;
      const config = node.data?.config || {};
      const prevOutputs = edges
        .filter(e => e.target === nodeId)
        .map(e => results[e.source])
        .filter(Boolean)
        .join("\n");

      results[nodeId] = await executeNode(type, config, prevOutputs);
      console.log(`✅ [${type}] → ${nodeId}:`, results[nodeId]);
    }

    res.json({ success: true, executionOrder, results });
  } catch (err) {
    console.error("Execution error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ── Node Executors ────────────────────────────────────────────────────────────
async function executeNode(type, config, prevOutput) {
  // groq initialized inside so .env is loaded by now
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  switch (type) {
    case "webhook":
      return `[Webhook Trigger] Workflow started. Input: ${prevOutput || "none"}`;

    case "schedule":
      return `[Schedule Trigger] Cron: ${config.cron || "not set"}. Triggered at ${new Date().toISOString()}`;

    case "ai-text": {
      const prompt = config.prompt || "Say hello";
      const temperature = parseFloat(config.temperature) || 0.7;
      const max_tokens = parseInt(config.maxTokens) || 500;
      const fullPrompt = prevOutput ? `Context:\n${prevOutput}\n\nTask: ${prompt}` : prompt;
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: fullPrompt }],
        temperature,
        max_tokens,
      });
      return completion.choices[0].message.content;
    }

    case "ai-analyze": {
      const mode = config.mode || "sentiment";
      const text = prevOutput || "No input provided";
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: `Perform ${mode} analysis on this text. Return concise result:\n\n${text}` }],
        max_tokens: 300,
      });
      return completion.choices[0].message.content;
    }

    case "ai-chat": {
      const system = config.system || "You are a helpful assistant";
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: system },
          { role: "user", content: prevOutput || "Hello" },
        ],
        max_tokens: 500,
      });
      return completion.choices[0].message.content;
    }

    case "ai-extract": {
      const schema = config.schema || '{"result":""}';
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: `Extract data from the following text and return ONLY a JSON object matching this schema: ${schema}\n\nText:\n${prevOutput || "No input"}` }],
        max_tokens: 400,
      });
      return completion.choices[0].message.content;
    }

    case "http": {
      const url = config.url;
      const method = (config.method || "GET").toUpperCase();
      if (!url) return "[HTTP] No URL configured";
      const response = await fetch(url, { method });
      const text = await response.text();
      return `[HTTP ${method} ${url}] Status: ${response.status}\n${text.slice(0, 500)}`;
    }

    case "transform": {
      const code = config.code || "return input";
      try {
        const fn = new Function("input", code);
        const result = fn(prevOutput);
        return typeof result === "object" ? JSON.stringify(result, null, 2) : String(result);
      } catch (e) {
        return `[Transform Error] ${e.message}`;
      }
    }

    case "email":
      return `[Email Simulated] To: ${config.to || "?"} | Subject: ${config.subject || "?"}\nBody:\n${prevOutput}`;

    default:
      return `[Unknown node type: ${type}]`;
  }
}