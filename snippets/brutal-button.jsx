export const BrutalButton = ({ href, label, variant = "primary" }) => {
  const isPrimary = variant === "primary";

  // Constant size / shadow / border — hover only changes the background color.
  // That means neighbors never shift when the cursor enters or leaves.
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "10px 20px",
    fontFamily: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
    fontWeight: 800,
    fontSize: "13px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    textDecoration: "none",
    border: "2px solid #0a0a0a",
    borderRadius: 0,
    boxShadow: "4px 4px 0 #000",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition:
      "background 0.12s cubic-bezier(0.16, 1, 0.3, 1), transform 0.08s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.08s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const primary = { background: "#29ff8d", color: "#070710" };
  const secondary = { background: "#ffffff", color: "#0a0a0a" };

  const bracketOnLight = { color: "#29ff8d", fontWeight: 800, fontSize: "14px", lineHeight: 1 };
  const bracketOnLime  = { color: "#070710", fontWeight: 800, fontSize: "14px", lineHeight: 1 };
  const bracketStyle = isPrimary ? bracketOnLime : bracketOnLight;

  const onEnter = (e) => {
    e.currentTarget.style.background = isPrimary ? "#4df8a0" : "#f3f0e0";
  };
  const onLeave = (e) => {
    e.currentTarget.style.background = isPrimary ? "#29ff8d" : "#ffffff";
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "4px 4px 0 #000";
  };
  const onDown = (e) => {
    e.currentTarget.style.transform = "translate(3px, 3px)";
    e.currentTarget.style.boxShadow = "0 0 0 #000";
  };
  const onUp = (e) => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "4px 4px 0 #000";
  };

  return (
    <a
      href={href}
      style={{ ...base, ...(isPrimary ? primary : secondary) }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
      onMouseUp={onUp}
    >
      <span style={bracketStyle}>[</span>
      <span>{label}</span>
      <span style={bracketStyle}>]</span>
    </a>
  );
};
