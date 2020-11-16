import React, { Component, memo } from 'react';
import {
  Ellipse,
  Group,
  Layer,
  Rect,
  Shape,
  Stage,
  Star,
  Text,
} from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';
import {
  ObjectInterface,
  ObjectSocketInterface,
  Props,
  State,
  StickyProperty,
} from './types';
import socketIOClient from 'socket.io-client';
import _ from 'lodash';
import { defaultObjectState, fontNames } from './constants';
import { Modal, Select } from 'antd';
import {
  EllipseTransform,
  RectTransform,
  StarTransform,
  StickyTransform,
  TriangleTransform,
} from './components';
import {
  BorderStyleIcon,
  ChevronDownIcon,
  FillColorIcon,
  MarkerIcon,
  MinusSquareIcon,
  MoreIcon,
  PlusSquareIcon,
  TextAlignmentIcon,
  TextBoldIcon,
  TextColorIcon,
  TextUnderLineIcon,
  VerticalLineIcon,
} from '../CanvasIcons';
import {
  BoardApiService,
  CanvasApiService,
  ImageUploadingService,
} from '../../../services/APIService';
import { ImageUploadResponseInterface } from '../../../services/APIService/interfaces';
import { onMouseDown, onMouseMove, onMouseUp } from './utility';

export enum BoardSocketEventEnum {
  CREATE = 'create',
  MOVE = 'move',
  UPDATE = 'update',
  DELETE = 'delete',
  LOCK = 'lock',
  UNLOCK = 'unlock',
  JOIN_BOARD = 'joinBoard',
  LEAVE_BOARD = 'leaveBoard',
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
}

class DrawCanvas extends Component<Props, State> {
  socket: SocketIOClient.Socket;
  state: State = {
    id: uuidv4(),
    objects: [],
    points: {
      ...defaultObjectState,
    },
    prevHistory: [],
    nextHistory: [],
    canvas: {
      name: '',
      orgId: '',
      categoryId: '',
    },
  };
  stageRef: Konva.Stage | null = null;

  isItemFocused: boolean = false;
  isItemMoving: boolean = false;
  isDrawing: boolean = false;

  constructor(props) {
    super(props);
    const url = new URL(process.env.REACT_APP_BASE_URL as string);
    url.pathname = 'board';
    this.socket = socketIOClient(url.href, {
      transports: ['websocket'],
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', event => {
      if (event.key === 'Delete') {
        const currentObject = this.state.objects.find(
          shapeObject => shapeObject.isSelected,
        );
        if (currentObject) {
          this.deleteObject(
            { id: this.state.id, data: currentObject },
            {
              emitEvent: true,
              saveHistory: true,
              saveCanvas: true,
            },
          );
        }
      } else if (event.ctrlKey && event.key.toLowerCase() === 'y') {
        const redoHistory = document.getElementById(
          'redo-history',
        ) as HTMLDivElement;
        redoHistory.click();
      }
      if (event.ctrlKey && event.key.toLowerCase() === 'z') {
        const undoHistory = document.getElementById(
          'undo-history',
        ) as HTMLDivElement;
        undoHistory.click();
      }
    });

    this.redoHistory();
    this.undoHistory();

    const saveCanvas = document.getElementById('save-canvas') as HTMLDivElement;
    saveCanvas.addEventListener('click', () => {
      this.save();
    });
    this.getData();
    this.canvasWebSockets();
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any,
  ) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
      this.handleChangeCursor();
    }
  }

  canvasWebSockets(): void {
    this.socket.on(BoardSocketEventEnum.CONNECT, () => {
      console.log('Socket ' + BoardSocketEventEnum.CONNECT);
      this.socket.emit(
        BoardSocketEventEnum.JOIN_BOARD,
        this.props.match?.params.id,
      );
    });
    this.socket.on(BoardSocketEventEnum.CREATE, (event: string) => {
      this.createObject(JSON.parse(event));
    });
    this.socket.on(BoardSocketEventEnum.JOIN_BOARD, (data: string) => {
      console.log('Socket ' + BoardSocketEventEnum.JOIN_BOARD, data);
    });
    this.socket.on(BoardSocketEventEnum.LEAVE_BOARD, (data: string) => {
      console.log('Socket ' + BoardSocketEventEnum.LEAVE_BOARD, data);
    });
    this.socket.on(BoardSocketEventEnum.UPDATE, (event: string) => {
      this.updateObject(JSON.parse(event));
    });
    this.socket.on(BoardSocketEventEnum.MOVE, (event: string) => {
      console.log(BoardSocketEventEnum.MOVE, event);
      this.moveObject(JSON.parse(event));
    });
    this.socket.on(BoardSocketEventEnum.LOCK, (event: string) => {
      console.log('Socket ' + BoardSocketEventEnum.LOCK, event);
      this.lockObject(JSON.parse(event));
    });
    this.socket.on(BoardSocketEventEnum.UNLOCK, (event: string) => {
      console.log('Socket ' + BoardSocketEventEnum.UNLOCK, event);
    });
    this.socket.on(BoardSocketEventEnum.DELETE, (event: string) => {
      console.log('Socket ' + BoardSocketEventEnum.DELETE, event);
      this.deleteObject(JSON.parse(event), { saveHistory: true });
    });
    this.socket.on(BoardSocketEventEnum.CREATE, (event: string) => {
      console.log('Socket ' + BoardSocketEventEnum.CREATE, event);
    });
    this.socket.on(BoardSocketEventEnum.DISCONNECT, () => {
      console.log('Socket ' + BoardSocketEventEnum.DISCONNECT);
      this.socket.emit(
        BoardSocketEventEnum.LEAVE_BOARD,
        this.props.match?.params.id,
      );
    });
  }

  moveObject(objectData: ObjectSocketInterface): void {
    this.setState({
      objects: this.state.objects.map(item => {
        if (item.id === objectData.data.id) {
          return {
            ...item,
            ...objectData.data,
          };
        } else {
          return item;
        }
      }),
    });
    if (objectData.id !== this.state.id) {
      this.updateShape(objectData.data, { saveHistory: true });
    }
  }

  lockObject(objectData: ObjectSocketInterface): void {
    if (objectData.id !== this.state.id) {
      this.setState({
        objects: this.state.objects.map(item => {
          if (item.id === objectData.data.id) {
            return {
              ...item,
              ...objectData.data,
            };
          } else {
            return item;
          }
        }),
      });
    }
  }

  updateObject(objectData: ObjectSocketInterface): void {
    if (objectData.id !== this.state.id) {
      this.updateShape(objectData.data, { saveHistory: true });
    }
  }

  createObject(objectData: ObjectSocketInterface): void {
    if (objectData.id !== this.state.id) {
      this.addCanvasShape(objectData.data, { saveHistory: true });
    }
  }

  deleteObject(
    objectData: ObjectSocketInterface,
    options: {
      saveHistory?: boolean;
      emitEvent?: boolean;
      saveCanvas?: boolean;
    } = {
      saveHistory: false,
      emitEvent: false,
      saveCanvas: false,
    },
  ): void {
    if (options.emitEvent) {
      this.emitSocketEvent(BoardSocketEventEnum.DELETE, objectData.data);
    }
    this.setState(
      {
        objects: this.state.objects.filter(
          shapeObject => shapeObject.id !== objectData.data.id,
        ),
      },
      () => {
        if (options.saveCanvas) {
          this.save();
        }
      },
    );
  }

  emitSocketEvent(
    eventType: BoardSocketEventEnum,
    data: ObjectInterface,
  ): void {
    const socketData = {
      boardId: this.props.match?.params.id as string,
      data: JSON.stringify({
        id: this.state.id,
        data: data,
      }),
    };
    this.socket.emit(eventType, socketData);
  }

  undoHistory(): void {
    const undoHistory = document.getElementById(
      'undo-history',
    ) as HTMLDivElement;
    undoHistory.addEventListener('click', () => {
      if (this.state.prevHistory.length) {
        const nextHistory = JSON.parse(JSON.stringify(this.state.nextHistory));
        const prevHistory = JSON.parse(JSON.stringify(this.state.prevHistory));
        const historyItem = prevHistory.pop();
        if (historyItem) {
          nextHistory.unshift(historyItem);
          this.setState({
            nextHistory,
            prevHistory,
            objects: this.state.objects.map(item => {
              if (item.id === historyItem.id) {
                return {
                  ...item,
                  ...historyItem,
                };
              } else {
                return item;
              }
            }),
          });
        }
      }
    });
  }

  redoHistory(): void {
    const redoHistory = document.getElementById(
      'redo-history',
    ) as HTMLDivElement;
    redoHistory.addEventListener('click', () => {
      if (this.state.nextHistory.length) {
        const nextHistory = JSON.parse(JSON.stringify(this.state.nextHistory));
        const prevHistory = JSON.parse(JSON.stringify(this.state.prevHistory));
        const historyItem = nextHistory.shift();
        if (historyItem) {
          prevHistory.push(historyItem);
          this.setState({
            nextHistory,
            prevHistory,
            objects: this.state.objects.map(item => {
              if (item.id === historyItem.id) {
                return {
                  ...item,
                  ...historyItem,
                };
              } else {
                return item;
              }
            }),
          });
        }
      }
    });
  }

  save(): void {
    ImageUploadingService.imageUploadFromDataUrl(
      this.stageRef?.toDataURL({ pixelRatio: 1 }) as string,
      this.props.match?.params.type as string,
    ).subscribe(
      image => {
        const data = JSON.stringify(
          this.state.objects.map(item => ({
            ...item,
            isEditing: false,
            isSelected: false,
            isFocused: false,
            isLocked: false,
          })),
        );
        if (this.props.match?.params.type === 'canvas') {
          this.saveCanvas(data, image);
        } else if (this.props.match?.params.type === 'board') {
          this.saveBoard(data, image);
        }
      },
      error => {
        console.error(error.response);
      },
    );
  }

  saveBoard(data: string, image: ImageUploadResponseInterface): void {
    BoardApiService.updateById(this.props.match?.params.id as string, {
      ...this.state.canvas,
      data: data,
    }).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error(error.response);
      },
    );
  }

  saveCanvas(data: string, image: ImageUploadResponseInterface): void {
    CanvasApiService.updateById(this.props.match?.params.id as string, {
      ...this.state.canvas,
      data: data,
      imageId: image.id,
    }).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error(error.response);
      },
    );
  }

  getData(): void {
    if (this.props.match?.params.type === 'canvas') {
      this.getCanvasObject();
    } else if (this.props.match?.params.type === 'board') {
      this.getBoardObject();
    }
  }

  getBoardObject(): void {
    const canvasTitle = document.getElementById(
      'canvas-title',
    ) as HTMLSpanElement;
    BoardApiService.getById(this.props.match?.params.id as string).subscribe(
      boardData => {
        canvasTitle.innerText = boardData.name;
        const canvasObjects = !!boardData.data
          ? JSON.parse(boardData.data)
          : [];
        this.setState({
          objects: canvasObjects,
          canvas: {
            orgId: boardData.orgId,
            name: boardData.name,
            categoryId: boardData.categoryId,
          },
        });
      },
      error => {
        console.error(error);
      },
    );
  }

  getCanvasObject(): void {
    const canvasTitle = document.getElementById(
      'canvas-title',
    ) as HTMLSpanElement;
    CanvasApiService.getById(this.props.match?.params.id as string).subscribe(
      canvasData => {
        canvasTitle.innerText = canvasData.name;
        const canvasObjects = !!canvasData.data
          ? JSON.parse(canvasData.data)
          : [];
        this.setState({
          objects: canvasObjects,
          canvas: {
            orgId: canvasData.orgId,
            name: canvasData.name,
            categoryId: canvasData.categoryId,
          },
        });
      },
      error => {
        console.error(error);
      },
    );
  }

  handleChangeCursor = () => {
    const container = this.stageRef?.getContent() as HTMLDivElement;
    if (container) {
      if (
        [
          'Rect',
          'RectRounded',
          'Triangle',
          'Circle',
          'Ellipse',
          'Star',
          'Sticky',
        ].includes(this.props.drawingTool as string)
      ) {
        container.style.cursor = 'crosshair';
      } else if (!this.props.drawingTool) {
        if (this.isItemFocused) {
          if (this.isItemMoving) {
            container.style.cursor = 'grabbing';
          } else {
            container.style.cursor = 'grab';
          }
        } else {
          container.style.cursor = 'auto';
        }
      }
    }
  };

  handleSelect = (data: ObjectInterface) => {
    this.updateShape({
      ...data,
      isSelected: true,
    });
  };

  handleMouseDown = e => {
    if (this.props.drawingTool) {
      const position = e.target.getStage().getPointerPosition();
      const data: ObjectInterface = onMouseDown(
        { ...this.state.points },
        this.props.drawingTool,
        position,
      );

      this.isDrawing = true;
      this.setState({
        points: _.cloneDeep(data),
      });
    }
  };

  handleMouseMove = e => {
    if (this.isDrawing && this.props.drawingTool) {
      const position = e.target.getStage().getPointerPosition();
      const data: ObjectInterface = onMouseMove(
        { ...this.state.points },
        this.props.drawingTool,
        position,
      );

      this.setState({
        points: _.cloneDeep(data),
      });
    }
  };

  handleMouseUp = e => {
    if (this.isDrawing) {
      this.isDrawing = false;
      const position = e.target.getStage().getPointerPosition();
      const data = onMouseUp(
        { ...this.state.points },
        this.props.drawingTool,
        position,
      );
      this.addCanvasShape(data, {
        saveHistory: true,
        emitEvent: true,
      });

      this.setState({
        points: {
          ...defaultObjectState,
        },
      });
    } else {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        this.setState({
          objects: this.state.objects.map(item => ({
            ...item,
            isSelected: false,
            isFocused: false,
            isEditing: false,
          })),
        });
      }
    }
  };

  addCanvasShape = (
    data: ObjectInterface,
    options: { saveHistory?: boolean; emitEvent?: boolean } = {
      saveHistory: false,
      emitEvent: false,
    },
  ) => {
    if (options.saveHistory) {
      this.updateHistory(JSON.parse(JSON.stringify(data)));
    }
    if (options.emitEvent) {
      this.emitSocketEvent(BoardSocketEventEnum.CREATE, {
        ...data,
        isEditing: false,
        isSelected: false,
        isFocused: false,
        isLocked: false,
      });
    }
    this.setState(
      {
        objects: [
          ...this.state.objects.map(shapeObject => ({
            ...shapeObject,
            isEditing: false,
            isSelected: false,
            isFocused: false,
          })),
          {
            ..._.cloneDeep(data),
          },
        ],
      },
      () => {
        this.save();
      },
    );
  };

  updateHistory(data: ObjectInterface) {
    this.setState({
      prevHistory: [
        ...this.state.prevHistory,
        { ...data, isEditing: false, isSelected: false, isFocused: false },
      ],
      nextHistory: [],
    });
  }

  updateShape(
    data: ObjectInterface,
    options: { saveHistory?: boolean; emitEvent?: boolean } = {
      saveHistory: false,
      emitEvent: false,
    },
  ) {
    if (options.saveHistory) {
      const historyItem = this.state.objects.find(item => item.id === data.id);
      if (historyItem) {
        const history = JSON.parse(JSON.stringify(historyItem));
        this.updateHistory({
          ...history,
        });
      }
    }

    const item = this.state.objects.find(item => item.id === data.id);
    if (options.emitEvent) {
      this.emitSocketEvent(BoardSocketEventEnum.UPDATE, {
        ...item,
        ...data,
        isSelected: false,
        isEditing: false,
        isFocused: false,
        isLocked: false,
      });
    }
    const objects = this.state.objects
      .filter(item => item.id !== data.id)
      .map(shapeObject => ({
        ...shapeObject,
        isSelected: false,
        isEditing: false,
        isFocused: false,
        isLocked: false,
      }));

    this.setState(
      {
        objects: [...objects, { ...item, ...data }],
      },
      () => {
        this.save();
      },
    );
  }

  updateObjectText(id: string, data: StickyProperty): void {
    const object = this.state.objects.find(item => item.id === id);
    if (object) {
      this.updateShape(
        {
          ...object,
          isEditing: false,
          sticky: {
            ...data,
          },
        },
        {
          saveHistory: true,
          emitEvent: true,
        },
      );
    }
  }

  handleChanging = (data: ObjectInterface) => {
    // this.emitSocketEvent(BoardSocketEventEnum.MOVE, data);
  };

  handleChangeStart = (data: ObjectInterface) => {
    console.log(data);
    this.emitSocketEvent(BoardSocketEventEnum.LOCK, {
      ...data,
      isSelected: false,
      isLocked: true,
      isEditing: false,
      isFocused: false,
    });
  };

  render() {
    console.log('props', this.props);
    return (
      <div className={this.props.className}>
        {this.state.objects
          .filter(
            shapeObject =>
              (shapeObject.type === 'Sticky' || shapeObject.type === 'Text') &&
              shapeObject.isEditing &&
              !this.isItemMoving,
          )
          .map(shapeObject => (
            <Modal
              key={shapeObject.id + ':textEditor'}
              title="Edit Text"
              visible={shapeObject.isEditing}
              onOk={e => {
                const input = document.getElementById(
                  'canvas-text-editor',
                ) as HTMLParagraphElement;
                if (input) {
                  this.updateObjectText(shapeObject.id, {
                    ...shapeObject.sticky,
                    text: input.innerText,
                  });
                }
              }}
              onCancel={e => {
                this.updateShape({
                  ...shapeObject,
                  isSelected: false,
                  isEditing: false,
                  isFocused: false,
                });
              }}
              okText="Save"
              cancelText="Cancel"
            >
              <p
                className="canvas-text-editor"
                id="canvas-text-editor"
                contentEditable="true"
              >
                {shapeObject.sticky?.text}
              </p>
            </Modal>
          ))}
        {this.state.objects
          .filter(
            shapeObject =>
              (shapeObject.type === 'Sticky' || shapeObject.type === 'Text') &&
              shapeObject.isSelected &&
              !this.isItemMoving,
          )
          .map(shapeObject => (
            <div
              key={shapeObject.id + ':toolbar'}
              className="canvas-text-toolbar"
              style={{
                left: shapeObject.x * this.props.zoomLevel,
                top: shapeObject.y * this.props.zoomLevel,
              }}
            >
              <div className="canvas-text-toolbar-item">
                <Select
                  defaultValue={shapeObject.sticky?.fontFamily}
                  style={{ width: 120, paddingLeft: '10px' }}
                  suffixIcon={<ChevronDownIcon />}
                  onChange={value => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      fontFamily: value,
                    });
                  }}
                >
                  {fontNames.map(font => (
                    <Select.Option
                      key={font}
                      value={font}
                      style={{
                        fontFamily: font,
                      }}
                    >
                      {font}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <MinusSquareIcon
                  onClick={() => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      fontSize: Math.max(
                        10,
                        (shapeObject.sticky?.fontSize as number) - 1,
                      ),
                    });
                  }}
                />
              </div>
              <div className="canvas-text-toolbar-item">
                {shapeObject.sticky?.fontSize}
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <PlusSquareIcon
                  onClick={() => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      fontSize: Math.min(
                        30,
                        (shapeObject.sticky?.fontSize as number) + 1,
                      ),
                    });
                  }}
                />
              </div>
              <div className="canvas-text-toolbar-item">
                <VerticalLineIcon />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <TextAlignmentIcon />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <TextBoldIcon
                  onClick={() => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      fontStyle:
                        shapeObject.sticky?.fontStyle === 'bold'
                          ? 'normal'
                          : 'bold',
                    });
                  }}
                />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <TextUnderLineIcon
                  onClick={() => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      textDecoration:
                        shapeObject.sticky?.textDecoration === 'underline'
                          ? ''
                          : 'underline',
                    });
                  }}
                />
              </div>
              <label className="canvas-text-toolbar-item action-button">
                <TextColorIcon
                  style={{
                    color: shapeObject.sticky?.fontColor,
                  }}
                />
                <input
                  type="color"
                  hidden={true}
                  onChange={event => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      fontColor: event.target.value,
                    });
                  }}
                  value={shapeObject.sticky?.fontColor}
                />
              </label>
              <div className="canvas-text-toolbar-item action-button">
                <MarkerIcon />
              </div>
              <div className="canvas-text-toolbar-item">
                <VerticalLineIcon />
              </div>
              <label className="canvas-text-toolbar-item action-button">
                <BorderStyleIcon
                  style={{
                    color: shapeObject.sticky?.stroke,
                  }}
                />
                <input
                  type="color"
                  hidden={true}
                  onChange={event => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      stroke: event.target.value,
                    });
                  }}
                  value={shapeObject.sticky?.stroke}
                />
              </label>
              <label className="canvas-text-toolbar-item action-button">
                <FillColorIcon
                  style={{
                    color: shapeObject.sticky?.backgroundColor,
                  }}
                />
                <input
                  type="color"
                  hidden={true}
                  onChange={event => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.sticky,
                      backgroundColor: event.target.value,
                    });
                  }}
                  value={shapeObject.sticky?.backgroundColor}
                />
              </label>
              <div className="canvas-text-toolbar-item">
                <VerticalLineIcon />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <MoreIcon />
              </div>
            </div>
          ))}

        <Stage
          width={window.innerWidth * this.props.zoomLevel}
          height={(window.innerHeight - 80) * this.props.zoomLevel}
          className="canvas-body-content"
          ref={ref => (this.stageRef = ref)}
          onMouseDown={this.handleMouseDown}
          onMousemove={this.handleMouseMove}
          onMouseup={this.handleMouseUp}
          scale={{
            x: this.props.zoomLevel,
            y: this.props.zoomLevel,
          }}
        >
          <Layer>
            {this.state.objects.map(shapeObject => {
              if (
                shapeObject.type === 'Rect' ||
                shapeObject.type === 'RectRounded'
              ) {
                return (
                  <RectTransform
                    key={shapeObject.id}
                    data={shapeObject}
                    onChangeStart={this.handleChangeStart}
                    onChanging={this.handleChanging}
                    onChange={data => {
                      this.updateShape(data, {
                        saveHistory: true,
                        emitEvent: true,
                      });
                    }}
                    onSelect={() => {
                      this.handleSelect(shapeObject);
                    }}
                  />
                );
              } else if (shapeObject.type === 'Ellipse') {
                return (
                  <>
                    <EllipseTransform
                      key={shapeObject.id}
                      data={shapeObject}
                      onChangeStart={this.handleChangeStart}
                      onChanging={this.handleChanging}
                      onChange={data => {
                        this.updateShape(data, {
                          saveHistory: true,
                          emitEvent: true,
                        });
                      }}
                      onSelect={() => {
                        this.handleSelect(shapeObject);
                      }}
                    />
                  </>
                );
              } else if (shapeObject.type === 'Star') {
                return (
                  <>
                    <StarTransform
                      key={shapeObject.id}
                      data={shapeObject}
                      onChangeStart={this.handleChangeStart}
                      onChanging={this.handleChanging}
                      onChange={data => {
                        this.updateShape(data, {
                          saveHistory: true,
                          emitEvent: true,
                        });
                      }}
                      onSelect={() => {
                        this.handleSelect(shapeObject);
                      }}
                    />
                  </>
                );
              } else if (shapeObject.type === 'Triangle') {
                return (
                  <TriangleTransform
                    key={shapeObject.id}
                    data={shapeObject}
                    onChangeStart={this.handleChangeStart}
                    onChanging={this.handleChanging}
                    onChange={data => {
                      this.updateShape(data, {
                        saveHistory: true,
                        emitEvent: true,
                      });
                    }}
                    onSelect={() => {
                      this.handleSelect(shapeObject);
                    }}
                  />
                );
              } else if (
                shapeObject.type === 'Text' ||
                shapeObject.type === 'Sticky'
              ) {
                return (
                  <StickyTransform
                    key={shapeObject.id}
                    data={shapeObject}
                    onChangeStart={this.handleChangeStart}
                    onChanging={this.handleChanging}
                    onEdit={data => {
                      this.updateShape(data);
                    }}
                    onChange={data => {
                      this.updateShape(data, {
                        saveHistory: true,
                        emitEvent: true,
                      });
                    }}
                    onSelect={() => {
                      this.handleSelect(shapeObject);
                    }}
                  />
                );
              } else {
                return <></>;
              }
            })}

            {(this.props.drawingTool === 'Text' ||
              this.props.drawingTool === 'Sticky') &&
              this.isDrawing && (
                <Group
                  x={this.state.points.x}
                  y={this.state.points.y}
                  width={this.state.points.rect?.width as number}
                  height={this.state.points.rect?.height as number}
                >
                  <Rect
                    x={0}
                    y={0}
                    width={this.state.points.rect?.width as number}
                    height={this.state.points.rect?.height as number}
                    stroke="#000000"
                    dash={[10, 10]}
                    fill={
                      this.props.drawingTool === 'Sticky'
                        ? '#f5ecfd'
                        : undefined
                    }
                  />
                  <Text
                    x={0}
                    y={0}
                    width={this.state.points.rect?.width as number}
                    height={this.state.points.rect?.height as number}
                    align="center"
                    verticalAlign="middle"
                    fill={
                      this.props.drawingTool === 'Text' ? '#bebebe' : '#000000'
                    }
                    text={
                      this.props.drawingTool === 'Text'
                        ? 'Type something'
                        : 'Sticky notes area'
                    }
                  />
                </Group>
              )}

            {this.props.drawingTool === 'Star' && this.isDrawing && (
              <Star
                numPoints={this.state.points.star?.numPoints as number}
                innerRadius={this.state.points.star?.innerRadius as number}
                outerRadius={this.state.points.star?.outerRadius as number}
                x={this.state.points.x}
                y={this.state.points.y}
                stroke="#000000"
                dash={[10, 10]}
                {...{
                  shadowBlur: 10,
                  shadowOpacity: 0.6,
                  shadowOffsetX: 10,
                  shadowOffsetY: 10,
                }}
              />
            )}
            {this.props.drawingTool === 'Triangle' && this.isDrawing && (
              <Shape
                x={this.state.points.x}
                y={this.state.points.y}
                sceneFunc={(context, shape) => {
                  context.beginPath();
                  context.moveTo(
                    (this.state.points.triangle?.width as number) / 2,
                    0,
                  );
                  context.lineTo(
                    0,
                    this.state.points.triangle?.height as number,
                  );
                  context.lineTo(
                    this.state.points.triangle?.width as number,
                    this.state.points.triangle?.height as number,
                  );
                  context.closePath();
                  // (!) Konva specific method, it is very important
                  context.fillStrokeShape(shape);
                }}
                stroke="#000000"
                dash={[10, 10]}
                {...{
                  shadowBlur: 10,
                  shadowOpacity: 0.6,
                  shadowOffsetX: 10,
                  shadowOffsetY: 10,
                }}
              />
            )}

            {this.props.drawingTool === 'Ellipse' && this.isDrawing && (
              <Ellipse
                x={this.state.points.x}
                y={this.state.points.y}
                radiusX={this.state.points.ellipse?.radiusX as number}
                radiusY={this.state.points.ellipse?.radiusY as number}
                stroke="#000000"
                dash={[10, 10]}
                {...{
                  shadowBlur: 10,
                  shadowOpacity: 0.6,
                  shadowOffsetX: 10,
                  shadowOffsetY: 10,
                }}
              />
            )}

            {(this.props.drawingTool === 'Rect' ||
              this.props.drawingTool === 'RectRounded') &&
              this.isDrawing && (
                <Rect
                  x={this.state.points.x}
                  y={this.state.points.y}
                  width={this.state.points.rect?.width as number}
                  height={this.state.points.rect?.height as number}
                  cornerRadius={this.state.points.rect?.cornerRadius as number}
                  stroke="#000000"
                  dash={[10, 10]}
                  {...{
                    shadowBlur: 10,
                    shadowOpacity: 0.6,
                    shadowOffsetX: 10,
                    shadowOffsetY: 10,
                  }}
                />
              )}

            {this.props.drawingTool === 'Text' && this.isDrawing && (
              <Rect
                x={this.state.points.x}
                y={this.state.points.y}
                width={this.state.points.sticky?.width}
                height={this.state.points.sticky?.height}
                stroke="#000000"
                dash={[10, 10]}
                {...{
                  shadowBlur: 10,
                  shadowOpacity: 0.6,
                  shadowOffsetX: 10,
                  shadowOffsetY: 10,
                }}
              />
            )}

            {this.props.drawingTool === 'Sticky' && this.isDrawing && (
              <>
                <Rect
                  x={this.state.points.x}
                  y={this.state.points.y}
                  width={this.state.points.sticky?.width}
                  height={this.state.points.sticky?.height}
                  stroke="#000000"
                  dash={[10, 10]}
                  {...{
                    shadowBlur: 10,
                    shadowOpacity: 0.6,
                    shadowOffsetX: 10,
                    shadowOffsetY: 10,
                  }}
                />
              </>
            )}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default memo(DrawCanvas);
