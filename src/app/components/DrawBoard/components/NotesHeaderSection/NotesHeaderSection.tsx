import React, { memo } from 'react';
import { Circle, Group, Rect, Text } from 'react-konva';

interface NotesHeaderSectionProps {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fill: string;
  textFill: string;
}

const NotesHeaderSection = (props: NotesHeaderSectionProps) => {
  return (
    <Group x={props.x} y={props.y} height={props.height} width={props.width}>
      <Rect
        x={0}
        y={0}
        height={props.height}
        width={props.width}
        fill={props.fill}
      />

      <Text
        height={props.height}
        width={props.width}
        x={0}
        y={0}
        text={'Sticky notes area'}
        fontSize={16}
        align="center"
        verticalAlign="middle"
        fill={props.textFill}
      />
    </Group>
  );
};

export default memo(NotesHeaderSection);
