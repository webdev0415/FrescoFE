import React, { memo } from 'react';
import { Group, Line, Text } from 'react-konva';
interface BoardsSectionInterface {
  x: number;
  y: number;
  height: number;
  width: number;
  text: string;
}
const BoardsSection = (props: BoardsSectionInterface) => {
  return (
    <Group
      id="3423432423"
      x={props.x}
      y={props.y}
      height={props.height}
      width={props.width}
    >
      <Text
        x={0}
        y={0}
        text={props.text}
        fontSize={14}
        align="center"
        verticalAlign="middle"
        fill="#9B9B9B"
      />
      <Line
        x={0}
        y={0}
        points={[205, props.height / 2, props.width - 20, props.height / 2]}
        stroke="#9B9B9B"
      />
    </Group>
  );
};

export default memo(BoardsSection);
