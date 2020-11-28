import React, { memo, useEffect, useState } from 'react';
import { Circle, Group, Rect, Text, Image } from 'react-konva';
import { v4 } from 'uuid';
import addNotesImage from 'assets/icons/add-notes.svg';
import addNotesPlusImage from 'assets/icons/toolbar-plus-violet.svg';

interface NotesAreaInterface {
  x: number;
  y: number;
}

const NotesArea = (props: NotesAreaInterface) => {
  const [hovered, setHovered] = useState(true);
  const [state, setState] = useState<any[]>([]);
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
    if (state.length) {
      let oldState = [...state];
      if (oldState.length === 1) {
        oldState.push({
          id: v4(),
          x: 150,
          y: 10,
          width: 130,
          height: 130,
          fontSize: 14,
          text: 'Sticky notes area',
          circle: {
            radius: 7,
            x: 12,
            y: 12,
          },
        });
      } else {
        let x = 10;
        let y = 10;
        oldState = oldState.map(item => {
          const newItem = {
            ...item,
            x: x,
            y: y,
            width: 60,
            height: 60,
            fontSize: 8,
            circle: {
              radius: 3,
              x: 7,
              y: 7,
            },
          };
          x = y === 10 ? x : x + 70;
          y = y === 10 ? y + 70 : 10;
          return newItem;
        });
        oldState.push({
          id: v4(),
          x: x,
          y: y,
          width: 60,
          height: 60,
          fontSize: 8,
          text: 'Sticky notes area',
          circle: {
            radius: 3,
            x: 7,
            y: 7,
          },
        });
      }
      setState(oldState);
    } else {
      setState([
        ...state,
        {
          id: v4(),
          x: 10,
          y: 10,
          width: 130,
          height: 130,
          fontSize: 14,
          text: 'Sticky notes area',
          circle: {
            radius: 7,
            x: 12,
            y: 12,
          },
        },
      ]);
    }
  };

  const onEditNotes = (data: any) => {
    console.log(data);
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

    const onClickDocument = event => {
      if (!(event.target as HTMLElement).contains(p)) {
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
      id="3423432423"
      x={props.x}
      y={props.y}
      height={150}
      width={290}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Group id="3423432423" x={0} y={0} height={150} width={290}>
        <Rect
          id={'Recsddsft'}
          x={0}
          y={0}
          height={150}
          width={290}
          fill={hovered ? '#F5EDFE' : undefined}
          opacity={0.8}
        />
        {hovered && !state.length && (
          <Image
            image={addNotesIcon}
            x={290 / 2 - 58 / 2}
            y={150 / 2 - 36 / 2}
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
      {state.map(item => (
        <Group
          id={item.id}
          x={item.x}
          y={item.y}
          height={item.height}
          width={item.width}
        >
          <Rect
            id={item.id + ':Rect'}
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
            id={item.id + ':Text'}
            x={0}
            y={0}
            text={'Sticky notes area'}
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
            id={item.id + ':Circle'}
            radius={item.circle.radius}
            x={item.circle.x}
            y={item.circle.y}
            fill="#000000"
          />
        </Group>
      ))}
      {hovered && !!state.length && state.length < 8 && (
        <Image
          image={addNotesPlusIcon}
          x={290 - 24}
          y={150 - 24}
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
