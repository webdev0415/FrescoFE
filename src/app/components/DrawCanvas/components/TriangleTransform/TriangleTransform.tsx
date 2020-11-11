import React, { useCallback, useEffect, useRef } from 'react';
import { Ellipse, Rect, Shape, Transformer } from 'react-konva';
import Konva from 'konva';
import { TransformShapeProps } from '../../../../components/DrawCanvas/types';

function TriangleTransform(props: TransformShapeProps): JSX.Element {
  const { data, onSelect, onChange } = props;
  const shapeRef = useRef<Konva.Ellipse>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const boundBoxFunc = useCallback((oldBox, newBox) => {
    if (newBox.width < 5 || newBox.height < 5) {
      return oldBox;
    }
    return newBox;
  }, []);

  const onTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = shapeRef.current as Konva.Ellipse;
      const scaleX = node?.scaleX();
      const scaleY = node?.scaleY();
      node?.scaleX(1);
      node?.scaleY(1);
      onChange({
        ...data,
        x: node?.x(),
        y: node?.y(),
        rotation: Math.round(node?.attrs.rotation as number),
        triangle: {
          width: Math.max(5, node?.width() * scaleX),
          height: Math.max(node?.height() * scaleY),
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
      trRef.current?.nodes([shapeRef.current as Konva.Ellipse]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [data.isSelected]);

  return (
    <React.Fragment>
      <Shape
        id={data.id}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        x={data.x}
        y={data.y}
        width={data.triangle?.width}
        height={data.triangle?.height}
        draggable
        onTransformEnd={onTransformEnd}
        onDragEnd={onDragEnd}
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
      />
      {data.isSelected && (
        <Transformer ref={trRef} boundBoxFunc={boundBoxFunc} />
      )}
    </React.Fragment>
  );
}

export default TriangleTransform;
