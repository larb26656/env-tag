interface TagProps {
  label: string;
  backgroundColor?: string;
  foregroundColor?: string;
  borderRadius?: number;
}

function Tag({
  label,
  backgroundColor = "#000000",
  foregroundColor = "#FFFFFF",
  borderRadius = 15,
}: TagProps) {
  const tagStyle: React.CSSProperties = {
    backgroundColor: backgroundColor,
    color: foregroundColor,
    borderRadius: `${borderRadius}px`,
    padding: "8px 12px",
    fontSize: "14px",
    display: "inline-block",
  };

  return <div style={tagStyle}>{label}</div>;
}

export default Tag;
