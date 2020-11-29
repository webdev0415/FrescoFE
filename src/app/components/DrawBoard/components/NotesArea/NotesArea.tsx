import React, { memo, useEffect, useReducer, useState } from 'react';
import { Circle, Group, Rect, Text, Image } from 'react-konva';
import addNotesImage from 'assets/icons/add-notes.svg';
import addNotesPlusImage from 'assets/icons/toolbar-plus-violet.svg';
import {
  BoardNotesAreaPropsInterface,
  BoardObjectInterface,
} from '../../types';
import { reducer, ReducerActionsInterface } from './reducer';

type Reducer = (
  prevState: BoardObjectInterface[],
  action: ReducerActionsInterface,
) => BoardObjectInterface[];

const NotesArea = (props: BoardNotesAreaPropsInterface) => {
  const [hovered, setHovered] = useState(false);
  const [notes, notesDispatch] = useReducer<Reducer>(reducer, props.data);
  const [addNotesIcon, setAddNotesIcon] = useState<any>(null);
  const [addNotesPlusIcon, setAddNotesPlusIcon] = useState<any>(null);
  const onMouseEnter = e => {
    setHovered(true);
  };
  const onMouseLeave = e => {
    setHovered(false);
  };

  useEffect(() => {
    const img = new window.Image();
    img.src = addNotesImage;
    img.addEventListener('load', e => {
      setAddNotesIcon(img);
    });
  }, []);

  useEffect(() => {
    const img = new window.Image();
    img.src = addNotesPlusImage;
    img.addEventListener('load', e => {
      setAddNotesPlusIcon(img);
    });
  }, []);

  const onClickAdd = () => {
    notesDispatch({ type: 'add', props });
  };

  const onEditNotes = (data: BoardObjectInterface) => {
    const p = document.createElement('p');
    p.autofocus = true;
    p.innerText = data.text;
    const canvasEditor = document.querySelector<HTMLDivElement>(
      '.konvajs-content',
    ) as HTMLDivElement;
    p.contentEditable = 'true';
    Object.assign(p.style, {
      position: 'absolute',
      left: props.x + data.x + 'px',
      top: props.y + data.y + 'px',
      width: data.width + 'px',
      height: data.height + 'px',
      fontSize: data.fontSize + 'px',
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      marginBottom: 0,
      backgroundColor: '#FEF8BA',
    });

    const changeValue = value => {
      if (value !== data.text) {
        notesDispatch({
          type: 'update',
          props,
          data: {
            ...data,
            text: value,
          },
        });
      }
    };

    const onClickDocument = event => {
      if (!(event.target as HTMLElement).contains(p)) {
        changeValue(p.innerText);
        canvasEditor.removeChild(p);
        document.removeEventListener('click', onClickDocument);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', onClickDocument);
    }, 100);

    p.focus();
    canvasEditor.appendChild(p);
  };
  return (
    <Group
      id={props.id}
      x={props.x}
      y={props.y}
      height={props.height}
      width={props.width}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Group x={0} y={0} height={props.height} width={props.width}>
        <Rect
          x={0}
          y={0}
          height={props.height}
          width={props.width}
          fill={hovered ? '#F5EDFE' : undefined}
          opacity={0.8}
        />
        {hovered && !notes.length && (
          <Image
            image={addNotesIcon}
            x={props.width / 2 - 58 / 2}
            y={props.height / 2 - 36 / 2}
            onClick={onClickAdd}
            onMouseEnter={() => {
              document.body.style.cursor = 'pointer';
            }}
            onMouseLeave={() => {
              document.body.style.cursor = 'auto';
            }}
          />
        )}
      </Group>
      {notes.map(item => (
        <Group
          key={item.id}
          id={item.id}
          x={item.x}
          y={item.y}
          height={item.height}
          width={item.width}
        >
          <Rect
            x={0}
            y={0}
            height={item.height}
            width={item.width}
            fill="#FEF8BA"
            opacity={0.8}
            cornerRadius={4}
          />

          <Text
            height={item.height}
            width={item.width}
            x={0}
            y={0}
            text={item.text}
            fontSize={item.fontSize}
            align="center"
            verticalAlign="middle"
            onDblClick={() => {
              onEditNotes(item);
            }}
            onDblTap={() => {
              onEditNotes(item);
            }}
          />
          <Circle
            radius={item.circle.radius}
            x={item.circle.x}
            y={item.circle.y}
            fill={item.circle.fill}
          />
        </Group>
      ))}
      {hovered && !!notes.length && notes.length < 8 && (
        <Image
          image={addNotesPlusIcon}
          x={props.width - 24}
          y={props.height - 24}
          onClick={onClickAdd}
          onMouseEnter={() => {
            document.body.style.cursor = 'pointer';
          }}
          onMouseLeave={() => {
            document.body.style.cursor = 'auto';
          }}
        />
      )}
    </Group>
  );
};

export default memo(NotesArea);
