import React, { memo } from 'react';
import { Rect, Star } from 'react-konva';
import { TransformShapeProps } from '../../types';

function StarTransform(props: TransformShapeProps): JSX.Element {
  const { data } = props;

  return (
    <Star
      key={data.id}
      numPoints={5}
      x={data.x}
      y={data.y}
      innerRadius={data.star?.innerRadius as number}
      outerRadius={data.star?.outerRadius as number}
      rotation={data.rotation}
      {...data.shapeConfig}
      opacity={1}
    />
  );
}

export default memo(StarTransform);
