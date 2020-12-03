import React from 'react';
import { Rect } from 'react-konva';
import { TransformShapeProps } from '../../types';

function RectTransform(props: TransformShapeProps): JSX.Element {
  const { data } = props;

  return (
    <React.Fragment>
      <Rect
        id={data.id}
        x={data.x}
        y={data.y}
        width={data.rect?.width as number}
        height={data.rect?.height as number}
        cornerRadius={data.rect?.cornerRadius as number}
        draggable={false}
        rotation={data.rotation}
        {...data.shapeConfig}
        onMouseEnter={() => props.onMouseEnter(data.id)}
        onMouseLeave={() => props.onMouseEnter(data.id)}
        stroke={data.id === props.selected ? '#000000' : undefined}
      />
    </React.Fragment>
  );
}

export default RectTransform;
