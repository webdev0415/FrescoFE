import React, { PureComponent } from 'react';
import { Circle, Group, Image, Rect, Text } from 'react-konva';
import { v4 } from 'uuid';
import { Observable } from 'rxjs';
import {
  BoardSocketEventEnum,
  NotesInterface,
  ObjectInterface,
  TransformShapeProps,
} from '../../types';

import addNotesImage from 'assets/icons/add-notes.svg';
import addNotesPlusImage from 'assets/icons/toolbar-plus-violet.svg';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface State {
  id: string;
  data?: ObjectInterface;
  notes: NotesInterface[];
  hovered: boolean;
  editing: boolean;
  selected: string;
  hoveredNotesItem: string;
  addNotesIcon: HTMLImageElement;
  addNotesPlusIcon: HTMLImageElement;
}

interface Props extends TransformShapeProps {
  zoomLevel: number;
  socketIoClient: SocketIOClient.Socket;

  onChange(data: ObjectInterface);
}

interface SocketData {
  id: string;
  data: NotesInterface;
}

class StickyTransform extends PureComponent<Props, State> {
  state: State = {
    id: v4(),
    data: undefined,
    hovered: false,
    editing: false,
    selected: '',
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

    window.addEventListener('keydown', this.onKeyEvent);
    document.addEventListener('click', this.onClickEvent);
    this.setState({ data, notes });
    this.canvasWebSockets();
  }

  RxFromSocketEvent(eventName: BoardSocketEventEnum): Observable<any> {
    return new Observable(observer => {
      this.props.socketIoClient.on(eventName, (data: string) => {
        observer.next(data);
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyEvent);
    document.removeEventListener('click', this.onClickEvent);
    this.props.socketIoClient.emit(
      BoardSocketEventEnum.LEAVE_BOARD,
      this.props.data.id,
    );
  }

  canvasWebSockets(): void {
    this.props.socketIoClient.emit(
      BoardSocketEventEnum.JOIN_BOARD,
      this.props.data.id,
    );

    this.props.socketIoClient.on(
      BoardSocketEventEnum.JOIN_BOARD,
      (data: string) => {
        console.log('Socket ' + BoardSocketEventEnum.JOIN_BOARD, data);
      },
    );
    this.props.socketIoClient.on(
      BoardSocketEventEnum.LEAVE_BOARD,
      (data: string) => {
        console.log('Socket ' + BoardSocketEventEnum.LEAVE_BOARD, data);
      },
    );

    const notes_create$ = this.RxFromSocketEvent(BoardSocketEventEnum.CREATE);
    const notes_update$ = this.RxFromSocketEvent(BoardSocketEventEnum.UPDATE);
    const notes_delete$ = this.RxFromSocketEvent(BoardSocketEventEnum.DELETE);

    notes_create$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(event => {
        const data = JSON.parse(event) as SocketData;
        console.log('Socket ' + BoardSocketEventEnum.CREATE, data);
        if (data.id !== this.state.id) {
          this.onAddNotes(data.data);
        }
      });
    notes_update$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(event => {
        const data = JSON.parse(event) as SocketData;
        console.log('Socket ' + BoardSocketEventEnum.UPDATE, data);
        if (data.id !== this.state.id) {
          this.onUpdateNotes(data.data);
        }
      });
    notes_delete$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(event => {
        const data = JSON.parse(event) as SocketData;
        console.log('Socket ' + BoardSocketEventEnum.DELETE, data);
        this.onDeleteItem(data.data.id);
      });
  }

  emitSocketEvent(eventType: BoardSocketEventEnum, data: NotesInterface): void {
    const socketData = {
      boardId: this.props.data.id,
      data: JSON.stringify({
        id: this.state.id,
        data: data,
      }),
    };
    setTimeout(() => {
      this.props.socketIoClient.emit(eventType, socketData);
    }, 100);
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

  onClickEvent = (event: MouseEvent) => {
    this.setState({ selected: this.state.hoveredNotesItem });
  };

  onKeyEvent = (event: KeyboardEvent) => {
    if (
      !!this.state.selected &&
      !this.state.editing &&
      (event.key === 'Delete' || event.key === 'Backspace')
    ) {
      event.preventDefault();
      this.handleRemoveNotes(this.state.selected);
    }
  };

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

  onAddNotes(data: NotesInterface): NotesInterface {
    let notes: NotesInterface[] = [];
    if (this.state.notes.length) {
      this.state.notes.forEach(note => {
        notes.push(note);
      });
    }
    notes.push(data);
    notes = notes.filter((item, index, arr) => {
      const indexItem = arr.findIndex(i => i.id === item.id);
      return indexItem === index;
    });

    const objects = this.state.data as ObjectInterface;
    objects.notes = this.reshapeNotes(notes);
    this.updateState(objects);
    return data;
  }

  handleAddNotes = () => {
    const note = this.onAddNotes({
      id: v4(),
      userId: v4(),
      x: 150,
      y: 10,
      width: 130,
      height: 130,
      fontSize: 14,
      text: 'Sticky notes',
      circle: {
        radius: 7,
        x: 12,
        y: 12,
        fill: '#000000',
      },
    });
    this.emitSocketEvent(BoardSocketEventEnum.CREATE, note);
  };

  onDeleteItem(id: string): NotesInterface {
    let oldNotes: NotesInterface[] = [...this.state.notes];
    let note = oldNotes.find(i => i.id === id);
    const data = this.state.data as ObjectInterface;
    data.notes = this.reshapeNotes(oldNotes.filter(item => item.id !== id));
    this.updateState(data);
    return note as NotesInterface;
  }

  handleRemoveNotes = (id: string) => {
    let note = this.onDeleteItem(id);
    this.emitSocketEvent(BoardSocketEventEnum.DELETE, note as NotesInterface);
  };

  onUpdateNotes(data: NotesInterface): void {
    this.updateState({
      ...(this.state.data as ObjectInterface),
      notes: this.reshapeNotes(
        this.state.notes.map(item => {
          if (item.id === data.id) {
            return {
              ...item,
              ...data,
            };
          } else {
            return item;
          }
        }),
      ),
    });
  }

  onEditNotes = (data: NotesInterface) => {
    if (this.state.editing) {
      return;
    }
    this.setState({ editing: true });
    const p = document.createElement('div');
    p.className = 'notes-editable';
    p.innerText = data.text || 'Sticky Notes';
    const canvasEditor = document.querySelector<HTMLDivElement>(
      '.konvajs-content',
    ) as HTMLDivElement;
    p.contentEditable = 'true';
    Object.assign(p.style, {
      left:
        ((this.state.data?.x as number) + data.x) * this.props.zoomLevel + 'px',
      top:
        ((this.state.data?.y as number) + data.y) * this.props.zoomLevel + 'px',
      width: data.width * this.props.zoomLevel + 'px',
      height: data.height * this.props.zoomLevel + 'px',
      fontSize: data.fontSize + 'px',
    });

    canvasEditor.appendChild(p);
    p.focus();

    const changeValue = value => {
      this.setState({ editing: false });
      if (value !== data.text) {
        this.emitSocketEvent(BoardSocketEventEnum.UPDATE, {
          ...data,
          text: value,
        });
        this.onUpdateNotes({
          ...data,
          text: value,
        });
      }
    };

    const onClickDocument = event => {
      event.stopPropagation();
      if (!(event.target as HTMLElement).contains(p)) {
        changeValue(p.innerText.trim());
        canvasEditor.removeChild(p);
        document.removeEventListener('click', onClickDocument);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', onClickDocument);
    }, 100);
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
                    item.id === this.state.hoveredNotesItem ||
                    item.id === this.state.selected
                      ? '#000000'
                      : undefined
                  }
                />

                <Text
                  height={item.height}
                  width={item.width}
                  x={0}
                  y={0}
                  text={item.text || 'Sticky notes'}
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
