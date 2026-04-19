export const AccentChip = ({ label }) => {
  const wrap = {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontWeight: 700,
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "inherit",
  };
  const bracket = { color: "#29ff8d", fontWeight: 800 };

  return (
    <span style={wrap}>
      <span style={bracket}>[</span>
      {label}
      <span style={bracket}>]</span>
    </span>
  );
};
