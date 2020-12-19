import React, { memo } from 'react';
import { Rect } from 'react-konva';
import { TransformShapeProps } from '../../types';

function RectTransform(props: TransformShapeProps): JSX.Element {
  const { data } = props;

  return (
    <Rect
      key={data.id}
      id={data.id}
      x={data.x}
      y={data.y}
      width={data.rect?.width as number}
      height={data.rect?.height as number}
      cornerRadius={data.rect?.cornerRadius as number}
      rotation={data.rotation}
      {...data.shapeConfig}
      opacity={1}
    />
  );
}

export default memo(RectTransform);
