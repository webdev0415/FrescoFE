import React from 'react';
import { Line } from 'react-konva';
import { TransformShapeProps } from '../../types';

function LineTransform(props: TransformShapeProps): JSX.Element {
  const { data } = props;

  return (
    <React.Fragment>
      <Line
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
        strokeWidth={data.id === props.selected ? 5 : 2}
        lineCap="round"
        lineJoin="round"
        id={data.id}
        draggable={false}
        rotation={data.rotation}
        onMouseEnter={() => props.onMouseEnter(data.id)}
        onMouseLeave={() => props.onMouseEnter(data.id)}
      />
    </React.Fragment>
  );
}

export default LineTransform;
