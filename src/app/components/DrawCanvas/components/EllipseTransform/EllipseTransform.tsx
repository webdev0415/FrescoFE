import React, { useCallback, useEffect, useRef } from 'react';
import { Ellipse, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import { TransformShapeProps } from '../../../../components/DrawCanvas/types';
interface EllipseTransformProps extends TransformShapeProps {
  radiusX: number;
  radiusY: number;
}
function EllipseTransform(props: EllipseTransformProps): JSX.Element {
  const { data, shapeConfig, onSelect, onChange, radiusX, radiusY } = props;
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
      trRef.current?.nodes([shapeRef.current as Konva.Ellipse]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [data.isEditing]);

  return (
    <React.Fragment>
      <Ellipse
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        radiusX={radiusX}
        radiusY={radiusY}
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

export default EllipseTransform;
