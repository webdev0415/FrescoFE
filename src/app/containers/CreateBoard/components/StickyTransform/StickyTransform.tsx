import React, { useCallback, useEffect, useRef } from 'react';
import { Group, Rect, Text, Transformer } from 'react-konva';
import Konva from 'konva';
import {
  StickyProperty,
  TransformShapeProps,
} from '../../../../components/DrawCanvas/types';

function StickyTransform(props: TransformShapeProps): JSX.Element {
  const { data, onSelect, onChange, draggable = true } = props;
  const shapeRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const boundBoxFunc = useCallback((oldBox, newBox) => {
    if (newBox.width < 5 || newBox.height < 5) {
      return oldBox;
    }
    return newBox;
  }, []);

  const onTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = shapeRef.current as Konva.Group;
      const scaleX = node?.scaleX();
      const scaleY = node?.scaleY();
      node?.scaleX(1);
      node?.scaleY(1);
      onChange({
        ...data,
        x: Math.round(node?.x()),
        y: Math.round(node?.y()),
        rotation: Math.round(node?.attrs.rotation as number),
        sticky: {
          ...(data.sticky as StickyProperty),
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
      trRef.current?.nodes([shapeRef.current as Konva.Group]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [data.isSelected]);

  return (
    <>
      <Group
        draggable={draggable}
        onTransformEnd={onTransformEnd}
        onDragEnd={onDragEnd}
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
        x={data.x}
        y={data.y}
        height={data.sticky?.height as number}
        width={data.sticky?.width as number}
        rotation={data.rotation}
      >
        <Rect
          id={data.id + ':Rect'}
          x={0}
          y={0}
          height={data.sticky?.height as number}
          width={data.sticky?.width as number}
          cornerRadius={30}
          {...data.shapeConfig}
        />
        <Text
          {...data.textData}
          height={data.sticky?.height as number}
          width={data.sticky?.width as number}
          id={data.id + ':Text'}
          x={0}
          y={0}
          fill="#ffffff"
          fillEnabled={true}
        />
      </Group>
      {data.isSelected && (
        <Transformer ref={trRef} boundBoxFunc={boundBoxFunc} />
      )}
    </>
  );
}

export default StickyTransform;
