import React from 'react';
import { Star } from 'react-konva';
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
        rotation={data.rotation}
        {...data.shapeConfig}
        opacity={1}
      />
    </React.Fragment>
  );
}

export default StarTransform;
