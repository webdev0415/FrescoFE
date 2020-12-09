import React, { PureComponent } from 'react';
import { Circle, Group, Image, Rect, Text } from 'react-konva';
import { v4 } from 'uuid';
import {
  NotesInterface,
  ObjectInterface,
  TransformShapeProps,
} from '../../types';

import addNotesImage from 'assets/icons/add-notes.svg';
import addNotesPlusImage from 'assets/icons/toolbar-plus-violet.svg';

interface State {
  data?: ObjectInterface;
  notes: NotesInterface[];
  hovered: boolean;
  hoveredNotesItem: string;
  addNotesIcon: HTMLImageElement;
  addNotesPlusIcon: HTMLImageElement;
}

interface Props extends TransformShapeProps {
  onChange(data: ObjectInterface);
}

class StickyTransform extends PureComponent<Props, State> {
  state: State = {
    data: undefined,
    hovered: false,
    hoveredNotesItem: '',
    notes: [],
    addNotesIcon: document.createElement('img'),
    addNotesPlusIcon: document.createElement('img'),
  };

  componentDidMount() {
    const data: ObjectInterface = this.props.data;
    let notes: NotesInterface[] = [];
    if (this.props.data.notes) {
      notes = this.props.data.notes;
    }
    const addNotesIcon: HTMLImageElement = document.createElement('img');
    addNotesIcon.src = addNotesImage;
    addNotesIcon.addEventListener('load', e => {
      this.setState({ addNotesIcon });
    });
    const addNotesPlusIcon: HTMLImageElement = document.createElement('img');
    addNotesPlusIcon.src = addNotesPlusImage;
    addNotesPlusIcon.addEventListener('load', e => {
      this.setState({ addNotesPlusIcon });
    });
    this.setState({ data, notes });
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any,
  ) {
    this.setState({
      data: this.props.data,
    });
  }

  reshapeNotes(notes: NotesInterface[]): NotesInterface[] {
    let oldNotes: NotesInterface[] = [];
    const spacing = 10;
    if (notes.length) {
      if (notes.length <= 2) {
        let x = spacing;
        let y = spacing;
        oldNotes = notes.map(item => {
          const height: number =
            (this.state.data?.rect?.height as number) - spacing * 2;
          const width: number =
            ((this.state.data?.rect?.width as number) - spacing * 3) / 2;
          const newItem = {
            ...item,
            x: x,
            y: y,
            width: width,
            height: height,
            fontSize: 14,
            circle: {
              ...item.circle,
              radius: 7,
              x: 12,
              y: 12,
            },
          };
          x = y === spacing ? x + width + spacing : x;
          return newItem;
        });
      } else {
        let x = spacing;
        let y = spacing;
        oldNotes = notes.map(item => {
          const height: number =
            ((this.state.data?.rect?.height as number) - spacing * 3) / 2;
          const width: number =
            ((this.state.data?.rect?.width as number) - spacing * 5) / 4;
          const newItem = {
            ...item,
            x: x,
            y: y,
            width: width,
            height: height,
            fontSize: 8,
            circle: {
              ...item.circle,
              radius: 3,
              x: 7,
              y: 7,
            },
          };
          x = y === spacing ? x : x + width + spacing;
          y = y === spacing ? y + height + spacing : spacing;
          return newItem;
        });
      }
    }
    return oldNotes;
  }

  updateState(data: ObjectInterface): void {
    this.setState({ data, notes: data.notes as NotesInterface[] }, () => {
      this.props.onChange(data);
    });
  }

  handleAddNotes = () => {
    let oldNotes: NotesInterface[] = [];
    if (this.state.notes.length) {
      this.state.notes.forEach(note => {
        oldNotes.push(note);
      });
    }
    oldNotes.push({
      id: v4(),
      userId: v4(),
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
        fill: '#000000',
      },
    });
    const data = this.state.data as ObjectInterface;
    data.notes = this.reshapeNotes(oldNotes);
    this.updateState(data);
  };

  handleRemoveNotes = (id: string) => {
    let oldNotes: NotesInterface[] = [...this.state.notes];
    const data = this.state.data as ObjectInterface;
    data.notes = this.reshapeNotes(oldNotes.filter(item => item.id !== id));
    this.updateState(data);
  };

  onEditNotes = (data: NotesInterface) => {
    const p = document.createElement('p');
    p.autofocus = true;
    p.innerText = data.text;
    const canvasEditor = document.querySelector<HTMLDivElement>(
      '.konvajs-content',
    ) as HTMLDivElement;
    p.contentEditable = 'true';
    Object.assign(p.style, {
      position: 'absolute',
      left: (this.state.data?.x as number) + data.x + 'px',
      top: (this.state.data?.y as number) + data.y + 'px',
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
        this.updateState({
          ...(this.state.data as ObjectInterface),
          notes: this.state.notes.map(item => {
            if (item.id === data.id) {
              return {
                ...item,
                text: value,
              };
            } else {
              return item;
            }
          }),
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

  onMouseEnterNotes = (id: string) => {
    this.setState({ hoveredNotesItem: id });
  };
  onMouseLeaveNotes = (id: string) => {
    this.setState({ hoveredNotesItem: '' });
  };

  onMouseEnterNotesArea = e => {
    this.setState({ hovered: true });
  };
  onMouseLeaveNotesArea = e => {
    this.setState({ hovered: false });
  };

  render(): JSX.Element {
    return (
      <>
        {!!this.state.data && (
          <Group
            id={this.state.data.id}
            x={this.state.data.x}
            y={this.state.data.y}
            height={this.state.data.rect?.height}
            width={this.state.data.rect?.width}
            onMouseEnter={this.onMouseEnterNotesArea}
            onMouseLeave={this.onMouseLeaveNotesArea}
          >
            <Group
              x={0}
              y={0}
              height={this.state.data.rect?.height}
              width={this.state.data.rect?.width}
            >
              <Rect
                x={0}
                y={0}
                height={this.state.data.rect?.height}
                width={this.state.data.rect?.width}
                fill={this.state.hovered ? '#F5EDFE' : undefined}
                opacity={0.8}
              />
              {this.state.hovered && !this.state.notes.length && (
                <Image
                  image={this.state.addNotesIcon}
                  x={(this.state.data.rect?.width as number) / 2 - 58 / 2}
                  y={(this.state.data.rect?.height as number) / 2 - 36 / 2}
                  onClick={this.handleAddNotes}
                  onMouseEnter={() => {
                    document.body.style.cursor = 'pointer';
                  }}
                  onMouseLeave={() => {
                    document.body.style.cursor = 'auto';
                  }}
                />
              )}
            </Group>
            {this.state.notes.map(item => (
              <Group
                key={item.id}
                id={item.id}
                x={item.x}
                y={item.y}
                height={item.height}
                width={item.width}
                onMouseEnter={() => {
                  this.onMouseEnterNotes(item.id);
                }}
                onMouseLeave={() => {
                  this.onMouseEnterNotes('');
                }}
              >
                <Rect
                  x={0}
                  y={0}
                  height={item.height}
                  width={item.width}
                  fill="#FEF8BA"
                  opacity={0.8}
                  cornerRadius={4}
                  stroke={
                    item.id === this.state.hoveredNotesItem
                      ? '#000000'
                      : undefined
                  }
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
                    this.onEditNotes(item);
                  }}
                  onDblTap={() => {
                    this.onEditNotes(item);
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
            {this.state.hovered &&
              !!this.state.notes.length &&
              this.state.notes.length < 8 && (
                <Image
                  image={this.state.addNotesPlusIcon}
                  x={(this.state.data.rect?.width as number) - 24}
                  y={(this.state.data.rect?.height as number) - 24}
                  onClick={this.handleAddNotes}
                  onMouseEnter={() => {
                    document.body.style.cursor = 'pointer';
                  }}
                  onMouseLeave={() => {
                    document.body.style.cursor = 'auto';
                  }}
                />
              )}
          </Group>
        )}
      </>
    );
  }
}

export default StickyTransform;
