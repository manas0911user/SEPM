import { Handle, Position } from "reactflow";
type DeployNodeProps = {
  data: {
    label: string;
  };
};


export default function DelayNode({ data }: DeployNodeProps) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #1c1c0f, #2a2a10)",
      border: "1px solid #f59e0b",
      borderRadius: "12px",
      padding: "12px 16px",
      minWidth: "160px",
      color: "#e2e8f0",
      fontFamily: "monospace",
      fontSize: "13px",
      boxShadow: "0 0 12px #f59e0b33",
    }}>
      <Handle type="target" position={Position.Left} style={{ background: "#f59e0b" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "18px" }}>⏳</span>
        <div>
          <div style={{ fontWeight: 700, color: "#fcd34d" }}>Delay</div>
          <div style={{ fontSize: "11px", color: "#64748b" }}>{data.label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: "#f59e0b" }} />
    </div>
  );
}