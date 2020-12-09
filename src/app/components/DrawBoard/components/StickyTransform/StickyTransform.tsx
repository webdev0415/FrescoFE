import React, { useCallback, useEffect, useRef } from 'react';
import { Group, Rect, Text, Transformer } from 'react-konva';
import Konva from 'konva';
import {
  ObjectInterface,
  StickyProperty,
  TransformShapeProps,
} from '../../../DrawBoard/types';

function StickyTransform(props: TransformShapeProps): JSX.Element {
  const { data, onSelect } = props;

  return (
    <>
      <Group
        id={data.id}
        onClick={onSelect}
        onTap={onSelect}
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
