import React from 'react';
import { Rect } from 'react-konva';
import { TransformShapeProps } from '../../types';

function RectTransform(props: TransformShapeProps): JSX.Element {
  const { data, onSelect } = props;

  return (
    <React.Fragment>
      <Rect
        id={data.id}
        onClick={onSelect}
        onTap={onSelect}
        x={data.x}
        y={data.y}
        width={data.rect?.width as number}
        height={data.rect?.height as number}
        cornerRadius={data.rect?.cornerRadius as number}
        rotation={data.rotation}
        {...data.shapeConfig}
        opacity={1}
      />
    </React.Fragment>
  );
}

export default RectTransform;
