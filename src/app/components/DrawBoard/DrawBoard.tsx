import React, { Component, PureComponent } from 'react';
import { Layer, Stage } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';
import { ObjectInterface, ObjectSocketInterface, Props, State } from './types';
import socketIOClient from 'socket.io-client';
import _ from 'lodash';
import { defaultObjectState } from './constants';

import {
  EllipseTransform,
  LineTransform,
  RectTransform,
  StarTransform,
  StickyTransform,
  TextTransform,
  TriangleTransform,
} from './components';

import {
  BoardApiService,
  ImageUploadingService,
} from '../../../services/APIService';
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

class DrawBoard extends Component<any, any> {
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
      imageId: '',
    },
    selectedStickyData: null,
  };
  stageRef: Konva.Stage | null = null;
  textAreaRef = React.createRef<HTMLTextAreaElement>();

  isItemFocused: boolean = false;
  isItemMoving: boolean = false;
  isDrawing: boolean = false;

  componentDidMount() {
    document.addEventListener('keydown', event => {
      if (event.ctrlKey && event.key.toLowerCase() === 'y') {
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

  canvasWebSockets(): void {
    this.props.socketIoClient.on(
      BoardSocketEventEnum.CREATE,
      (event: string) => {
        this.createObject(JSON.parse(event));
      },
    );
    this.props.socketIoClient.on(
      BoardSocketEventEnum.JOIN_BOARD,
      (data: string) => {
        // console.log('Socket ' + BoardSocketEventEnum.JOIN_BOARD, data);
      },
    );
    this.props.socketIoClient.on(
      BoardSocketEventEnum.LEAVE_BOARD,
      (data: string) => {
        // console.log('Socket ' + BoardSocketEventEnum.LEAVE_BOARD, data);
      },
    );
    this.props.socketIoClient.on(
      BoardSocketEventEnum.UPDATE,
      (event: string) => {
        this.updateObject(JSON.parse(event));
      },
    );
    this.props.socketIoClient.on(BoardSocketEventEnum.MOVE, (event: string) => {
      console.log(BoardSocketEventEnum.MOVE, event);
      this.moveObject(JSON.parse(event));
    });
    this.props.socketIoClient.on(BoardSocketEventEnum.LOCK, (event: string) => {
      console.log('Socket ' + BoardSocketEventEnum.LOCK, event);
      this.lockObject(JSON.parse(event));
    });
    this.props.socketIoClient.on(
      BoardSocketEventEnum.UNLOCK,
      (event: string) => {
        console.log('Socket ' + BoardSocketEventEnum.UNLOCK, event);
      },
    );
    // this.socket.on(BoardSocketEventEnum.DELETE, (event: string) => {
    //   console.log('Socket ' + BoardSocketEventEnum.DELETE, event);
    //   this.deleteObject(JSON.parse(event), { saveHistory: true });
    // });
    this.props.socketIoClient.on(
      BoardSocketEventEnum.CREATE,
      (event: string) => {
        console.log('Socket ' + BoardSocketEventEnum.CREATE, event);
      },
    );
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
    this.props.socketIoClient.emit(eventType, socketData);
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

  uploadImage(): void {
    ImageUploadingService.imageUploadFromDataUrl(
      this.stageRef?.toDataURL({ pixelRatio: 1 }) as string,
      'board',
    ).subscribe(image => {
      this.setState(
        {
          canvas: {
            ...this.state.canvas,
            imageId: image.id,
          },
        },
        () => {
          this.saveBoard();
        },
      );
    });
  }

  updateImage(): void {
    ImageUploadingService.imageUpdateFromDataUrl(
      this.stageRef?.toDataURL({ pixelRatio: 1 }) as string,
      'board',
      this.state.canvas.imageId,
    ).subscribe(image => {
      this.setState({
        canvas: {
          ...this.state.canvas,
          imageId: image.id,
        },
      });
    });
  }

  saveImage(): void {
    if (!!this.state.canvas.imageId) {
      this.updateImage();
    } else {
      this.uploadImage();
    }
  }

  save(): void {
    this.saveImage();
    if (!!this.state.canvas.imageId) {
      this.saveBoard();
    }
  }

  getJsonData(): string {
    return JSON.stringify(
      this.state.objects.map(item => ({
        ...item,
        isEditing: false,
        isSelected: false,
        isFocused: false,
        isLocked: true,
      })),
    );
  }

  saveBoard(): void {
    const data = this.getJsonData();
    const canvas = {
      ...this.state.canvas,
      name: this.props.title || this.state.canvas.name,
    };
    if (!canvas.imageId) {
      delete canvas.imageId;
    }
    BoardApiService.updateById(this.props.match?.params.id as string, {
      ...canvas,
      data: data,
    }).subscribe(
      response => {
        // console.log(response);
      },
      error => {
        console.error(error);
      },
    );
  }

  getData(): void {
    this.getBoardObject();
  }

  getBoardObject(): void {
    const canvasTitle = document.getElementById(
      'canvas-title',
    ) as HTMLSpanElement;
    const canvasTitleInput = document.getElementById(
      'canvas-title-input',
    ) as HTMLInputElement;
    BoardApiService.getById(this.props.match?.params.id as string).subscribe(
      boardData => {
        canvasTitle.innerText = boardData.name;
        if (canvasTitleInput) {
          canvasTitleInput.value = boardData.name;
        }
        const canvasObjects = !!boardData.data
          ? JSON.parse(boardData.data)
          : [];
        this.setState(
          {
            objects: canvasObjects,
            canvas: {
              orgId: boardData.orgId,
              name: boardData.name,
              categoryId: boardData.categoryId as string,
              imageId: boardData.imageId as string,
            },
          },
          () => {
            this.save();
          },
        );
      },

      error => {
        console.error(error);
      },
    );
  }

  handleSelect = (data: ObjectInterface) => {
    this.updateShape({
      ...data,
      isSelected: false,
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
    console.log('addCanvasShape', data, options);
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
    if (data.type !== 'Sticky') {
      return;
    }
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
        isLocked: true,
      });
    }
    const objects = this.state.objects
      .filter(item => item.id !== data.id)
      .map(shapeObject => ({
        ...shapeObject,
        isSelected: false,
        isEditing: false,
        isFocused: false,
        isLocked: true,
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

  handleChanging = (data: ObjectInterface) => {
    // this.emitSocketEvent(BoardSocketEventEnum.MOVE, data);
  };

  handleChangeStart = (data: ObjectInterface) => {
    console.log(data, 'handleChangeStart');
    this.emitSocketEvent(BoardSocketEventEnum.LOCK, {
      ...data,
      isSelected: false,
      isLocked: true,
      isEditing: false,
      isFocused: false,
    });
  };

  render() {
    return (
      <div className={this.props.className}>
        <Stage
          width={window.innerWidth * this.props.zoomLevel}
          height={(window.innerHeight - 80) * this.props.zoomLevel}
          className="canvas-body-content"
          ref={ref => (this.stageRef = ref)}
          // onMouseDown={this.handleMouseDown}
          // onMousemove={this.handleMouseMove}
          // onMouseup={this.handleMouseUp}
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
                  <RectTransform key={shapeObject.id} data={shapeObject} />
                );
              } else if (shapeObject.type === 'Ellipse') {
                return (
                  <>
                    <EllipseTransform key={shapeObject.id} data={shapeObject} />
                  </>
                );
              } else if (shapeObject.type === 'Star') {
                return (
                  <>
                    <StarTransform key={shapeObject.id} data={shapeObject} />
                  </>
                );
              } else if (shapeObject.type === 'Triangle') {
                return (
                  <TriangleTransform key={shapeObject.id} data={shapeObject} />
                );
              } else if (shapeObject.type === 'Text') {
                return (
                  <TextTransform key={shapeObject.id} data={shapeObject} />
                );
              } else if (shapeObject.type === 'Sticky') {
                return (
                  <StickyTransform
                    key={shapeObject.id}
                    data={shapeObject}
                    zoomLevel={this.props.zoomLevel}
                    onChange={data => {
                      this.updateShape(data, {
                        emitEvent: true,
                        saveHistory: true,
                      });
                    }}
                  />
                );
              } else if (shapeObject.type === 'Line') {
                return (
                  <LineTransform key={shapeObject.id} data={shapeObject} />
                );
              } else {
                return <></>;
              }
            })}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default DrawBoard;
