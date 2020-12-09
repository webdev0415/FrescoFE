import React from 'react';
import { Shape } from 'react-konva';
import { TransformShapeProps } from '../../types';

function TriangleTransform(props: TransformShapeProps): JSX.Element {
  const { data, onSelect } = props;

  return (
    <React.Fragment>
      <Shape
        id={data.id}
        onClick={onSelect}
        onTap={onSelect}
        x={data.x}
        y={data.y}
        width={data.triangle?.width}
        height={data.triangle?.height}
        sceneFunc={(context, shape) => {
          context.beginPath();

          context.moveTo((data.triangle?.width as number) / 2, 0);
          context.lineTo(0, data.triangle?.height as number);
          context.lineTo(
            data.triangle?.width as number,
            data.triangle?.height as number,
          );
          context.closePath();
          // (!) Konva specific method, it is very important
          context.fillStrokeShape(shape);
        }}
        {...data.shapeConfig}
        rotation={data.rotation}
        opacity={1}
      />
    </React.Fragment>
  );
}

export default TriangleTransform;
