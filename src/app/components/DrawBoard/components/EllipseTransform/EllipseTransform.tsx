import React from 'react';
import { Ellipse } from 'react-konva';
import { TransformShapeProps } from '../../types';

function EllipseTransform(props: TransformShapeProps): JSX.Element {
  const { data, onSelect } = props;

  return (
    <React.Fragment>
      <Ellipse
        onClick={onSelect}
        onTap={onSelect}
        x={data.x}
        y={data.y}
        radiusX={data.ellipse?.radiusX as number}
        radiusY={data.ellipse?.radiusY as number}
        rotation={data.rotation}
        {...data.shapeConfig}
        opacity={data.isLocked ? 0.5 : 0.8}
      />
    </React.Fragment>
  );
}

export default EllipseTransform;
