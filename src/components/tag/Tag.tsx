interface TagProps {
  label: string;
  backgroundColor: string;
  foregroundColor: string;
  borderRadius?: number;
  margin: number;
}

function Tag({
  label,
  backgroundColor,
  foregroundColor,
  borderRadius = 15,
  margin,
}: TagProps) {
  const tagStyle: React.CSSProperties = {
    backgroundColor: backgroundColor,
    color: foregroundColor,
    borderRadius: `${borderRadius}px`,
    padding: "8px 12px",
    fontSize: "14px",
    display: "inline-block",
    margin: `${margin}px`,
  };

  return <div style={tagStyle}>{label}</div>;
}

export default Tag;
