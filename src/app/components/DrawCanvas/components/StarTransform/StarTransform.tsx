import React, { useCallback, useEffect, useRef } from 'react';
import { Rect, Star, Transformer } from 'react-konva';
import Konva from 'konva';
import { TransformShapeProps } from '../../../../components/DrawCanvas/types';

function StarTransform(props: TransformShapeProps): JSX.Element {
  const { data, shapeConfig, onSelect, onChange } = props;
  const shapeRef = useRef<Konva.Star>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const boundBoxFunc = useCallback((oldBox, newBox) => {
    if (newBox.width < 5 || newBox.height < 5) {
      return oldBox;
    }
    return newBox;
  }, []);

  const onTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = shapeRef.current as Konva.Star;
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
    (e: Konva.KonvaEventObject<Event>) => {
      onChange({
        ...data,
        x: e.target.x(),
        y: e.target.y(),
        isDragging: false,
        isEditing: false,
      });
    },
    [data, onChange],
  );

  const onDragStart = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      onChange({
        ...data,
        x: e.target.x(),
        y: e.target.y(),
        isDragging: true,
        isEditing: false,
      });
    },
    [data, onChange],
  );

  useEffect(() => {
    if (data.isEditing) {
      // we need to attach transformer manually
      trRef.current?.nodes([shapeRef.current as Konva.Star]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [data.isEditing]);

  return (
    <React.Fragment>
      <Star
        onClick={onSelect}
        onTap={onSelect}
        numPoints={5}
        ref={shapeRef}
        innerRadius={(data.width as number) / 2}
        outerRadius={data.width as number}
        draggable
        onTransformEnd={onTransformEnd}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        {...shapeConfig}
      />
      {data.isEditing && (
        <Transformer
          ref={trRef}
          boundBoxFunc={boundBoxFunc}
          onTransformEnd={() => {}}
        />
      )}
    </React.Fragment>
  );
}

export default StarTransform;
