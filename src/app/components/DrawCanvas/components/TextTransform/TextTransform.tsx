import React, { useCallback, useEffect, useRef } from 'react';
import { Text, Transformer } from 'react-konva';
import Konva from 'konva';
import { TransformShapeProps } from '../../../../components/DrawCanvas/types';

function TextTransform(props: TransformShapeProps): JSX.Element {
  const { data, shapeConfig, onSelect, onChange } = props;
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
        x: node?.x(),
        y: node?.y(),
        // set minimal value
        width: Math.max(5, node?.width() * scaleX),
        height: Math.max(node?.height() * scaleY),
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
    if (data.isEditing) {
      // we need to attach transformer manually
      trRef.current?.nodes([shapeRef.current as Konva.Text]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [data.isEditing]);

  return (
    <React.Fragment>
      <Text
        id={shapeConfig.id}
        fill="#000000"
        fillEnabled={true}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...data.textData}
        draggable
        onTransformEnd={onTransformEnd}
        onDragEnd={onDragEnd}
      />
      {data.isEditing && (
        <Transformer ref={trRef} boundBoxFunc={boundBoxFunc} />
      )}
    </React.Fragment>
  );
}

export default TextTransform;
