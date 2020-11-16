import React, { useCallback, useEffect, useRef } from 'react';
import { Rect, Star, Transformer } from 'react-konva';
import Konva from 'konva';
import { StarProperties, TransformShapeProps } from '../../types';

function StarTransform(props: TransformShapeProps): JSX.Element {
  const { data, onSelect, onChange } = props;
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
      const width = Math.round(Math.max(5, node?.width() * scaleX));
      const height = Math.round(Math.max(node?.height() * scaleY));
      const radius = Math.min(width, height);
      onChange({
        ...data,
        x: node?.x(),
        y: node?.y(),
        rotation: Math.round(node?.attrs.rotation as number),
        star: {
          ...data.star,
          numPoints: 5,
          outerRadius: radius / 2,
          innerRadius: Math.round(radius / 4),
        },
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
        isEditing: false,
      });
    },
    [data, onChange],
  );

  useEffect(() => {
    if (data.isSelected) {
      // we need to attach transformer manually
      trRef.current?.nodes([shapeRef.current as Konva.Star]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [data.isSelected]);

  return (
    <React.Fragment>
      <Star
        onClick={onSelect}
        onTap={onSelect}
        numPoints={5}
        ref={shapeRef}
        x={data.x}
        y={data.y}
        innerRadius={data.star?.innerRadius as number}
        outerRadius={data.star?.outerRadius as number}
        draggable
        onTransformEnd={onTransformEnd}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        rotation={data.rotation}
        {...data.shapeConfig}
      />
      {data.isSelected && (
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
