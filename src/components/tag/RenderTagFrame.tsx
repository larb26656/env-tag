import { Position } from "@/services/setting.service";
import { css } from "@emotion/react";

interface FrameProps {
  isHaveParent?: boolean;
  position: Position;
  children: React.ReactNode;
}

function buildCssPosition(position: Position) {
  switch (position) {
    case Position.LT:
      return {
        left: 0,
        top: 0,
      };
    case Position.RT:
      return {
        right: 0,
        top: 0,
      };
    case Position.LB:
      return {
        left: 0,
        bottom: 0,
      };
    case Position.RB:
      return {
        right: 0,
        bottom: 0,
      };
  }
}

export default function RenderTagFrame({
  isHaveParent = false,
  position,
  children,
}: FrameProps) {
  const cssPosition = buildCssPosition(position);

  const frameStyle = css({
    position: isHaveParent ? "absolute" : "fixed",
    ...cssPosition,
    zIndex: 9999,
  });

  return <div css={frameStyle}>{children}</div>;
}
