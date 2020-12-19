import React, { memo } from 'react';
import { Ellipse, Rect } from 'react-konva';
import { TransformShapeProps } from '../../types';

function EllipseTransform(props: TransformShapeProps): JSX.Element {
  const { data } = props;

  return (
    <Ellipse
      key={data.id}
      x={data.x}
      y={data.y}
      radiusX={data.ellipse?.radiusX as number}
      radiusY={data.ellipse?.radiusY as number}
      rotation={data.rotation}
      {...data.shapeConfig}
      opacity={data.isLocked ? 0.5 : 0.8}
    />
  );
}

export default memo(EllipseTransform);
