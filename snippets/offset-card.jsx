export const OffsetCard = ({ title, body, href, icon }) => {
  const card = {
    display: "block",
    background: "#ffffff",
    color: "#0a0a0a",
    border: "1.5px solid #0a0a0a",
    borderRadius: "6px",
    padding: "24px 22px",
    boxShadow: "4px 4px 0 #000",
    textDecoration: "none",
    transition:
      "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
    height: "100%",
  };

  const label = {
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontWeight: 800,
    fontSize: "14px",
    letterSpacing: "-0.01em",
    textTransform: "uppercase",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const iconSpan = {
    display: "inline-block",
    width: "18px",
    height: "18px",
    background: "#29ff8d",
    border: "1.5px solid #0a0a0a",
    borderRadius: 0,
  };

  const desc = {
    fontFamily:
      '"Inter", ui-sans-serif, system-ui, sans-serif',
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: 1.5,
    color: "#3f3f46",
    margin: 0,
  };

  const onEnter = (e) => {
    e.currentTarget.style.transform = "translate(-2px, -2px)";
    e.currentTarget.style.boxShadow = "6px 6px 0 #000";
  };
  const onLeave = (e) => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "4px 4px 0 #000";
  };

  const content = (
    <>
      <div style={label}>
        <span style={iconSpan} aria-hidden="true" />
        {title}
      </div>
      <p style={desc}>{body}</p>
    </>
  );

  if (href) {
    return (
      <a href={href} style={card} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        {content}
      </a>
    );
  }
  return (
    <div style={card} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {content}
    </div>
  );
};
