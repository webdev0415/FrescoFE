import React, { useCallback, useEffect, useRef } from 'react';
import { Group, Rect, Text, Transformer } from 'react-konva';
import Konva from 'konva';
import { TransformShapeProps } from '../../../../components/DrawCanvas/types';

function StickyTransform(props: TransformShapeProps): JSX.Element {
  const { data, shapeConfig, onSelect, onChange } = props;
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
      trRef.current?.nodes([shapeRef.current as Konva.Group]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [data.isEditing]);

  return (
    <React.Fragment>
      <Group
        draggable
        onTransformEnd={onTransformEnd}
        onDragEnd={onDragEnd}
        ref={shapeRef}
        onClick={onSelect}
        onTap={onSelect}
      >
        <Rect
          id={data.id + ':Rect'}
          x={0}
          y={0}
          height={data.height as number}
          width={data.width as number}
          cornerRadius={30}
          fill="#9646f5"
          {...shapeConfig}
        />
        <Text
          id={data.id + ':Text'}
          x={0}
          y={0}
          height={data.height as number}
          width={data.width as number}
          padding={20}
          fill="#ffffff"
          fillEnabled={true}
          {...data.textData}
        />
      </Group>
      {data.isEditing && (
        <Transformer ref={trRef} boundBoxFunc={boundBoxFunc} />
      )}
    </React.Fragment>
  );
}

export default StickyTransform;
