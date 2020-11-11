import React, { useCallback, useEffect, useRef } from 'react';
import { Rect, Text, Transformer } from 'react-konva';
import Konva from 'konva';
import {
  TextProperties,
  TransformShapeProps,
} from '../../../../components/DrawCanvas/types';

function TextTransform(props: TransformShapeProps): JSX.Element {
  const { data, onSelect, onChange } = props;
  const shapeRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const boundBoxFunc = useCallback((oldBox, newBox) => {
    if (newBox.width < 5 || newBox.height < 5) {
      return oldBox;
    }
    return newBox;
  }, []);

  const onTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = shapeRef.current as Konva.Text;
      const scaleX = node?.scaleX();
      const scaleY = node?.scaleY();
      node?.scaleX(1);
      node?.scaleY(1);
      onChange({
        ...data,
        x: Math.round(node?.x()),
        y: Math.round(node?.y()),
        rotation: Math.round(node.attrs.rotation),
        textData: {
          ...(data.textData as TextProperties),
          width: Math.round(Math.max(5, node?.width() * scaleX)),
          height: Math.round(Math.max(node?.height() * scaleY)),
        },
      });
    },
    [data, onChange],
  );

  const onDragEnd = useCallback(
    e => {
      onChange({
        ...data,
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    [data, onChange],
  );

  useEffect(() => {
    if (data.isSelected) {
      // we need to attach transformer manually
      trRef.current?.nodes([shapeRef.current as Konva.Text]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [data.isSelected]);

  return (
    <React.Fragment>
      <Text
        id={data.id}
        fill="#000000"
        x={data.x}
        y={data.y}
        fillEnabled={true}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...data.textData}
        draggable
        onTransformEnd={onTransformEnd}
        onDragEnd={onDragEnd}
        rotation={data.rotation}
      />
      {data.isSelected && (
        <Transformer ref={trRef} boundBoxFunc={boundBoxFunc} />
      )}
    </React.Fragment>
  );
}

export default TextTransform;
