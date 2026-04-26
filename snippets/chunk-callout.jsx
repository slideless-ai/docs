const TONES = {
  lime:   { bg: "#29ff8d", ink: "#070710" },
  violet: { bg: "#8d54ff", ink: "#ffffff" },
  azure:  { bg: "#4d8bff", ink: "#ffffff" },
  amber:  { bg: "#fbbf24", ink: "#070710" },
};

export const ChunkCallout = ({ tone = "lime", title, body, children }) => {
  const palette = TONES[tone] ?? TONES.lime;

  const wrap = {
    background: palette.bg,
    color: palette.ink,
    border: "2px solid #0a0a0a",
    borderRadius: 0,
    padding: "18px 20px",
    boxShadow: "4px 4px 0 #000",
    margin: "20px 0",
  };

  const heading = {
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontWeight: 800,
    fontSize: "13px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: body || children ? "8px" : 0,
  };

  const text = {
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
    fontWeight: 400,
    fontSize: "15px",
    lineHeight: 1.55,
    margin: 0,
  };

  return (
    <div style={wrap}>
      {title ? <div style={heading}>[ {title} ]</div> : null}
      {body ? <p style={text}>{body}</p> : null}
      {children ? <div style={text}>{children}</div> : null}
    </div>
  );
};
