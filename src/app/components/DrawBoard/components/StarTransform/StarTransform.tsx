import React from 'react';
import { Rect, Star } from 'react-konva';
import { TransformShapeProps } from '../../types';

function StarTransform(props: TransformShapeProps): JSX.Element {
  const { data } = props;

  return (
    <React.Fragment>
      <Star
        numPoints={5}
        x={data.x}
        y={data.y}
        innerRadius={data.star?.innerRadius as number}
        outerRadius={data.star?.outerRadius as number}
        draggable={false}
        rotation={data.rotation}
        {...data.shapeConfig}
        onMouseEnter={() => props.onMouseEnter(data.id)}
        onMouseLeave={() => props.onMouseLeave(data.id)}
        stroke={data.id === props.selected ? '#000000' : undefined}
      />
    </React.Fragment>
  );
}

export default StarTransform;
