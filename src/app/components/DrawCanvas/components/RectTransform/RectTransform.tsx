import React, { useCallback, useEffect, useRef } from 'react';
import { Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import { TransformShapeProps } from '../../../../components/DrawCanvas/types';

function RectTransform(props: TransformShapeProps): JSX.Element {
  const { data, shapeConfig, onSelect, onChange } = props;
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const boundBoxFunc = useCallback((oldBox, newBox) => {
    if (newBox.width < 5 || newBox.height < 5) {
      return oldBox;
    }
    return newBox;
  }, []);

  const onTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = shapeRef.current as Konva.Rect;
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
      trRef.current?.nodes([shapeRef.current as Konva.Rect]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [data.isEditing]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeConfig}
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

export default RectTransform;
