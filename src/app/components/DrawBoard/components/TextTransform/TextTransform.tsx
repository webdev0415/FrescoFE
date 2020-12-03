import React, { useCallback, useEffect, useRef } from 'react';
import { Text, Transformer } from 'react-konva';
import Konva from 'konva';
import { StickyProperty, TransformShapeProps } from '../../types';

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
        draggable={false}
        rotation={data.rotation}
        opacity={0.8}
      />
    </React.Fragment>
  );
}

export default TextTransform;
