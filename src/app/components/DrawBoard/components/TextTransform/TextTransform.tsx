import React from 'react';
import { Text } from 'react-konva';
import { TransformShapeProps } from '../../types';

function TextTransform(props: TransformShapeProps): JSX.Element {
  const { data } = props;

  return (
    <React.Fragment>
      <Text
        id={data.id}
        fill="#000000"
        x={data.x}
        y={data.y}
        fillEnabled={true}
        {...data.textData}
        text={data.sticky?.text ? data.sticky?.text : 'Sticky notes area'}
        rotation={data.rotation}
        opacity={0.8}
      />
    </React.Fragment>
  );
}

export default TextTransform;
