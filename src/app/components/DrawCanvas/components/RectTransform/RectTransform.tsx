import React, { useCallback, useEffect, useRef } from 'react';
import { Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import {
  ObjectSnappingEdges,
  TransformShapeProps,
} from '../../../../components/DrawCanvas/types';

function RectTransform(props: TransformShapeProps): JSX.Element {
  const {
    data,
    onSelect,
    onChange,
    onChanging,
    onChangeStart,
    onContextMenu,
  } = props;
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
        rotation: Math.round(node?.attrs.rotation as number),
        rect: {
          width: Math.max(5, node?.width() * scaleX),
          height: Math.max(node?.height() * scaleY),
          cornerRadius: data.rect?.cornerRadius as number,
        },
      });
    },
    [data, onChange],
  );

  const onTransform = useCallback((e: Konva.KonvaEventObject<Event>) => {
    const node = shapeRef.current as Konva.Rect;
    const scaleX = node?.scaleX();
    const scaleY = node?.scaleY();
    node?.scaleX(1);
    node?.scaleY(1);
    // onChanging({
    //   ...data,
    //   x: node?.x(),
    //   y: node?.y(),
    //   rotation: Math.round(node?.attrs.rotation as number),
    //   rect: {
    //     width: Math.max(5, node?.width() * scaleX),
    //     height: Math.max(node?.height() * scaleY),
    //     cornerRadius: data.rect?.cornerRadius as number,
    //   },
    // });
  }, []);

  const onDragMove = e => {
    const node = shapeRef.current as Konva.Rect;
    var box = node.getClientRect(node?.attrs);
    var absPos = node.absolutePosition();
    const edges: ObjectSnappingEdges = {
      vertical: [
        {
          guide: Math.round(box.x),
          offset: Math.round(absPos.x - box.x),
          snap: 'start',
        },
        {
          guide: Math.round(box.x + box.width / 2),
          offset: Math.round(absPos.x - box.x - box.width / 2),
          snap: 'center',
        },
        {
          guide: Math.round(box.x + box.width),
          offset: Math.round(absPos.x - box.x - box.width),
          snap: 'end',
        },
      ],
      horizontal: [
        {
          guide: Math.round(box.y),
          offset: Math.round(absPos.y - box.y),
          snap: 'start',
        },
        {
          guide: Math.round(box.y + box.height / 2),
          offset: Math.round(absPos.y - box.y - box.height / 2),
          snap: 'center',
        },
        {
          guide: Math.round(box.y + box.height),
          offset: Math.round(absPos.y - box.y - box.height),
          snap: 'end',
        },
      ],
    };
    onChanging(e.target, edges);
  };

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
      trRef.current?.nodes([shapeRef.current as Konva.Rect]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [data.isSelected]);

  return (
    <React.Fragment>
      <Rect
        id={data.id}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        x={data.x}
        y={data.y}
        width={data.rect?.width as number}
        height={data.rect?.height as number}
        cornerRadius={data.rect?.cornerRadius as number}
        draggable={!data.isLocked && data.isEditable}
        onTransformStart={() => onChangeStart(data)}
        // onTransform={onTransform}
        onTransformEnd={onTransformEnd}
        onDragStart={() => onChangeStart(data)}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        rotation={data.rotation}
        {...data.shapeConfig}
        opacity={
          data.isLocked
            ? Math.max(0.1, (data.shapeConfig?.opacity as number) - 0.2)
            : (data.shapeConfig?.opacity as number)
        }
        onContextMenu={onContextMenu}
        name="object"
      />
      {data.isSelected && (
        <Transformer ref={trRef} boundBoxFunc={boundBoxFunc} />
      )}
    </React.Fragment>
  );
}

export default RectTransform;
