import React, { memo } from 'react';
import { Line, Rect } from 'react-konva';
import { TransformShapeProps } from '../../types';

function LineTransform(props: TransformShapeProps): JSX.Element {
  const { data } = props;

  return (
    <Line
      key={data.id}
      x={data.x}
      y={data.y}
      points={(() => {
        const points: number[] = [];
        data.line?.forEach(point => {
          points.push(point.x);
          points.push(point.y);
        });
        return points;
      })()}
      stroke="#000000"
      strokeWidth={2}
      lineCap="round"
      lineJoin="round"
      id={data.id}
      rotation={data.rotation}
      opacity={1}
    />
  );
}

export default memo(LineTransform);
