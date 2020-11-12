import React, { Component, memo } from 'react';
import { Ellipse, Layer, Rect, Shape, Stage, Star } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';
import { ObjectInterface, Props, State, TextProperties } from './types';
import socketIOClient from 'socket.io-client';
import _ from 'lodash';
import {
  defaultObjectState,
  defaultTextProperties,
  fontNames,
} from './constants';
import { Modal, Select } from 'antd';
import {
  EllipseTransform,
  RectTransform,
  StarTransform,
  StickyTransform,
  TextTransform,
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
import { CanvasApiService } from '../../../services/APIService';

enum BoardSocketEventEnum {
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
    this.socket = socketIOClient(url.href);
    this.canvasWebSockets();
  }

  componentDidMount() {
    document.addEventListener('keydown', event => {
      if (event.key === 'Delete') {
        this.setState({
          objects: this.state.objects.filter(
            shapeObject => !shapeObject.isSelected,
          ),
        });
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
    saveCanvas.addEventListener('click', e => {
      this.saveCanvas();
    });
    this.getCanvasObject();
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any,
  ) {
    if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
      this.handleChangeCursor();
      console.log(this.props.zoomLevel);
    }
  }

  canvasWebSockets(): void {
    this.socket.on(BoardSocketEventEnum.CONNECT, () => {
      console.log('Socket ' + BoardSocketEventEnum.CONNECT);
      this.socket.emit(BoardSocketEventEnum.JOIN_BOARD, {
        boardId: this.props.match?.params.id,
      });
    });
    this.socket.on(BoardSocketEventEnum.CREATE, data => {
      console.log('Socket ' + BoardSocketEventEnum.CREATE, data);
    });
    this.socket.on(BoardSocketEventEnum.JOIN_BOARD, data => {
      console.log('Socket ' + BoardSocketEventEnum.JOIN_BOARD, data);
    });
    this.socket.on(BoardSocketEventEnum.LEAVE_BOARD, data => {
      console.log('Socket ' + BoardSocketEventEnum.LEAVE_BOARD, data);
    });
    this.socket.on(BoardSocketEventEnum.MOVE, data => {
      console.log('Socket ' + BoardSocketEventEnum.MOVE, data);
    });
    this.socket.on(BoardSocketEventEnum.UPDATE, data => {
      console.log('Socket ' + BoardSocketEventEnum.UPDATE, data);
    });
    this.socket.on(BoardSocketEventEnum.LOCK, data => {
      console.log('Socket ' + BoardSocketEventEnum.LOCK, data);
    });
    this.socket.on(BoardSocketEventEnum.UNLOCK, data => {
      console.log('Socket ' + BoardSocketEventEnum.UNLOCK, data);
    });
    this.socket.on(BoardSocketEventEnum.DELETE, data => {
      console.log('Socket ' + BoardSocketEventEnum.DELETE, data);
    });
    this.socket.on(BoardSocketEventEnum.CREATE, data => {
      console.log('Socket ' + BoardSocketEventEnum.CREATE, data);
    });
    this.socket.on(BoardSocketEventEnum.DISCONNECT, () => {
      console.log('Socket ' + BoardSocketEventEnum.DISCONNECT);
      this.socket.emit(BoardSocketEventEnum.LEAVE_BOARD, {
        boardId: this.props.match?.params.id,
      });
    });
  }

  emitSocketEvent(
    eventType: BoardSocketEventEnum,
    data: ObjectInterface,
  ): void {
    const socketData = {
      boardId: this.props.match?.params.id as string,
      data: JSON.stringify(data),
    };
    console.log(this.socket.emit(eventType, socketData));
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
    redoHistory.addEventListener('click', e => {
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

  saveCanvas(): void {
    const data = JSON.stringify(
      this.state.objects.map(item => ({
        ...item,
        isEditing: false,
        isSelected: false,
        isFocused: false,
      })),
    );
    CanvasApiService.updateById(this.props.match?.params.id as string, {
      ...this.state.canvas,
      data: data,
    }).subscribe(
      response => {
        console.log(response);
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
        console.log(canvasData);
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
      const data: ObjectInterface = {
        ...this.state.points,
        ...defaultObjectState,
        id: uuidv4(),
        rotation: 0,
        x: Math.round(position.x),
        y: Math.round(position.y),
        type: this.props.drawingTool,
      };
      if (
        this.props.drawingTool === 'Sticky' ||
        this.props.drawingTool === 'Text'
      ) {
        Object.assign(data, {
          isSelected: true,
          isEditing: true,
        });
        _.set(data, 'textData', {
          ...defaultTextProperties,
          padding: 0,
        });

        if (this.props.drawingTool === 'Sticky') {
          _.set(data, 'sticky', {
            width: 200,
            height: 200,
            cornerRadius: 30,
          });
        }
        this.addCanvasShape(data, true);
      } else {
        if (this.props.drawingTool === 'RectRounded') {
          _.set(data, 'rect', {
            cornerRadius: 20,
            height: 0,
            width: 0,
          });
        } else if (this.props.drawingTool === 'Rect') {
          _.set(data, 'rect', {
            cornerRadius: 0,
            height: 0,
            width: 0,
          });
        } else if (this.props.drawingTool === 'Star') {
          _.set(data, 'star', {
            innerRadius: 0,
            outerRadius: 0,
            numPoints: 5,
          });
        } else if (this.props.drawingTool === 'Triangle') {
          _.set(data, 'triangle', {
            innerRadius: 0,
            outerRadius: 0,
            numPoints: 5,
          });
        } else if (this.props.drawingTool === 'Ellipse') {
          _.set(data, 'ellipse', {
            radiusX: 0,
            radiusY: 0,
          });
        }
        this.isDrawing = true;
        this.setState({
          points: _.cloneDeep(data),
        });
      }
    }
  };

  handleMouseMove = e => {
    if (this.isDrawing && this.props.drawingTool) {
      const position = e.target.getStage().getPointerPosition();
      const width = Math.abs(position.x - this.state.points.x);
      const height = Math.abs(position.y - this.state.points.y);

      const data: ObjectInterface = {
        ...this.state.points,
      };

      const dimensions = {
        height,
        width,
      };

      if (this.props.drawingTool === 'RectRounded') {
        _.set(data, 'rect', {
          cornerRadius: 20,
          ...dimensions,
        });
      } else if (this.props.drawingTool === 'Rect') {
        _.set(data, 'rect', {
          cornerRadius: 0,
          ...dimensions,
        });
      } else if (this.props.drawingTool === 'Star') {
        _.set(data, 'star', {
          innerRadius: width / 2,
          outerRadius: width,
          numPoints: 5,
        });
      } else if (this.props.drawingTool === 'Triangle') {
        _.set(data, 'triangle', {
          ...dimensions,
        });
      } else if (this.props.drawingTool === 'Ellipse') {
        _.set(data, 'ellipse', {
          radiusX: Math.abs(width),
          radiusY: Math.abs(height),
        });
      }

      this.setState({
        points: _.cloneDeep(data),
      });
    }
  };

  addCanvasShape = (data: ObjectInterface, saveHistory: boolean = false) => {
    if (saveHistory) {
      this.updateHistory(JSON.parse(JSON.stringify(data)));
    }
    this.emitSocketEvent(BoardSocketEventEnum.CREATE, {
      ...data,
      isEditing: false,
      isSelected: false,
      isFocused: false,
    });
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
        this.saveCanvas();
      },
    );
  };

  handleMouseUp = e => {
    if (this.isDrawing) {
      this.isDrawing = false;
      const position = e.target.getStage().getPointerPosition();
      const width = Math.abs(position.x - this.state.points.x);
      const height = Math.abs(position.y - this.state.points.y);

      const data: ObjectInterface = {
        ...this.state.points,
      };
      const dimensions = {
        height,
        width,
      };
      if (this.props.drawingTool === 'RectRounded') {
        _.set(data, 'rect', {
          cornerRadius: 20,
          ...dimensions,
        });
      } else if (this.props.drawingTool === 'Rect') {
        _.set(data, 'rect', {
          cornerRadius: 0,
          ...dimensions,
        });
      } else if (this.props.drawingTool === 'Star') {
        _.set(data, 'star', {
          innerRadius: width / 2,
          outerRadius: width,
          numPoints: 5,
        });
      } else if (this.props.drawingTool === 'Triangle') {
        _.set(data, 'triangle', {
          ...dimensions,
        });
      } else if (this.props.drawingTool === 'Ellipse') {
        _.set(data, 'ellipse', {
          radiusX: Math.abs(width),
          radiusY: Math.abs(height),
        });
      }

      this.addCanvasShape(data, true);

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

  updateHistory(data: ObjectInterface) {
    this.setState({
      prevHistory: [
        ...this.state.prevHistory,
        { ...data, isEditing: false, isSelected: false, isFocused: false },
      ],
      nextHistory: [],
    });
  }

  updateShape(data: ObjectInterface, saveHistory: boolean = false) {
    if (saveHistory) {
      const historyItem = this.state.objects.find(item => item.id === data.id);
      if (historyItem) {
        const history = JSON.parse(JSON.stringify(historyItem));
        this.updateHistory({
          ...history,
        });
      }
    }

    const item = this.state.objects.find(item => item.id === data.id);
    this.emitSocketEvent(BoardSocketEventEnum.MOVE, {
      ...item,
      ...data,
      isSelected: false,
      isEditing: false,
      isFocused: false,
    });
    const objects = this.state.objects
      .filter(item => item.id !== data.id)
      .map(shapeObject => ({
        ...shapeObject,
        isSelected: false,
        isEditing: false,
        isFocused: false,
      }));

    this.setState(
      {
        objects: [...objects, { ...item, ...data }],
      },
      () => {
        this.saveCanvas();
      },
    );
  }

  updateObjectText(id: string, data: TextProperties): void {
    const object = this.state.objects.find(item => item.id === id);
    if (object) {
      this.updateShape(
        {
          ...object,
          isEditing: false,
          textData: {
            ...data,
          },
        },
        true,
      );
    }
  }
  render() {
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
                    ...shapeObject.textData,
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
                {shapeObject.textData?.text}
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
                  defaultValue={shapeObject.textData?.fontFamily}
                  style={{ width: 120, paddingLeft: '10px' }}
                  suffixIcon={<ChevronDownIcon />}
                  onChange={value => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.textData,
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
                      ...shapeObject.textData,
                      fontSize: Math.max(
                        10,
                        (shapeObject.textData?.fontSize as number) - 1,
                      ),
                    });
                  }}
                />
              </div>
              <div className="canvas-text-toolbar-item">
                {shapeObject.textData?.fontSize}
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <PlusSquareIcon
                  onClick={() => {
                    this.updateObjectText(shapeObject.id, {
                      ...shapeObject.textData,
                      fontSize: Math.min(
                        30,
                        (shapeObject.textData?.fontSize as number) + 1,
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
                      ...shapeObject.textData,
                      fontStyle:
                        shapeObject.textData?.fontStyle === 'bold'
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
                      ...shapeObject.textData,
                      textDecoration:
                        shapeObject.textData?.textDecoration === 'underline'
                          ? ''
                          : 'underline',
                    });
                  }}
                />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <TextColorIcon />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <MarkerIcon />
              </div>
              <div className="canvas-text-toolbar-item">
                <VerticalLineIcon />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <BorderStyleIcon />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <FillColorIcon />
              </div>
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
                    onChange={data => {
                      this.updateShape(data, true);
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
                      onChange={data => {
                        this.updateShape(data, true);
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
                      onChange={data => {
                        this.updateShape(data, true);
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
                    onChange={data => {
                      this.updateShape(data, true);
                    }}
                    onSelect={() => {
                      this.handleSelect(shapeObject);
                    }}
                  />
                );
              } else if (shapeObject.type === 'Sticky') {
                return (
                  <StickyTransform
                    key={shapeObject.id}
                    data={shapeObject}
                    onChange={data => {
                      this.updateShape(data, true);
                    }}
                    onSelect={() => {
                      this.handleSelect(shapeObject);
                    }}
                  />
                );
              } else if (shapeObject.type === 'Text') {
                return (
                  <TextTransform
                    key={shapeObject.id}
                    data={shapeObject}
                    onChange={data => {
                      this.updateShape(data, true);
                    }}
                    onSelect={() => {
                      this.handleSelect(shapeObject);
                    }}
                  />
                );
              }
            })}

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

            {this.props.drawingTool === 'Sticky' && (
              <>
                <Rect
                  x={this.state.points.x}
                  y={this.state.points.y}
                  width={this.state.points.sticky?.width}
                  height={this.state.points.sticky?.height}
                  cornerRadius={
                    this.state.points.sticky?.cornerRadius as number
                  }
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
