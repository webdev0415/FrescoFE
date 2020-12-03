import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { TransformShapeProps } from '../../types';

function StickyTransform(props: TransformShapeProps): JSX.Element {
  const { data } = props;

  return (
    <>
      <Group
        id={data.id}
        draggable={false}
        x={data.x}
        y={data.y}
        height={data.rect?.height as number}
        width={data.rect?.width as number}
        rotation={data.rotation}
        onMouseEnter={() => props.onMouseEnter(data.id)}
        onMouseLeave={() => props.onMouseEnter(data.id)}
      >
        <Rect
          id={data.id + ':Rect'}
          x={0}
          y={0}
          height={data.rect?.height as number}
          width={data.rect?.width as number}
          fill={data.sticky?.backgroundColor}
          opacity={0.8}
          stroke={data.id === props.selected ? '#000000' : data.sticky?.stroke}
        />

        <Text
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
    </>
  );
}

export default StickyTransform;
