interface TagProps {
  label: string;
}

function Tag(props: TagProps) {
  return (
    <>
      <p>{props.label}</p>
    </>
  );
}

export default Tag;
