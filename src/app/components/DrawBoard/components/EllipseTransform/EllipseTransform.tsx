import React, { useRef } from 'react';
import { Ellipse } from 'react-konva';
import Konva from 'konva';
import { TransformShapeProps } from '../../types';

function EllipseTransform(props: TransformShapeProps): JSX.Element {
  const { data } = props;
  const shapeRef = useRef<Konva.Ellipse>(null);

  return (
    <React.Fragment>
      <Ellipse
        ref={shapeRef}
        x={data.x}
        y={data.y}
        radiusX={data.ellipse?.radiusX as number}
        radiusY={data.ellipse?.radiusY as number}
        draggable={false}
        rotation={data.rotation}
        {...data.shapeConfig}
      />
    </React.Fragment>
  );
}

export default EllipseTransform;
