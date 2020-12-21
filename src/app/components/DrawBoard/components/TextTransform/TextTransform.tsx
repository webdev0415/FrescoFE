import React, { memo } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { TransformShapeProps } from '../../types';

function TextTransform(props: TransformShapeProps): JSX.Element {
  const { data } = props;

  return (
    <Group
      key={data.id}
      id={data.id}
      x={data.x}
      y={data.y}
      height={data.rect?.height as number}
      width={data.rect?.width as number}
      rotation={data.rotation}
    >
      <Rect
        id={data.id + ':Rect'}
        x={0}
        y={0}
        height={data.rect?.height as number}
        width={data.rect?.width as number}
        fill={data.sticky?.backgroundColor}
        opacity={0.8}
        stroke={data.sticky?.stroke}
      />

      <Text
        key={data.id}
        {...data.sticky}
        stroke={undefined}
        fill={data.sticky?.fontColor}
        height={data.rect?.height as number}
        width={data.rect?.width as number}
        id={data.id + ':Text'}
        x={0}
        y={0}
        text={data.sticky?.text ? data.sticky?.text : 'Sticky notes area'}
        fillEnabled={true}
      />
    </Group>
  );
}

export default memo(TextTransform);
