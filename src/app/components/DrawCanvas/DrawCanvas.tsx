import React, { Component, memo } from 'react';
import {
  Layer,
  Stage,
  Star,
  Text,
  Rect,
  Circle,
  Ellipse,
  Shape,
  Group,
} from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';
import {
  ShapeObjectType,
  Props,
  TextProperties,
  PointsInterface,
  ObjectInterface,
  State,
} from './types';
import {
  defaultPointState,
  defaultObjectState,
  defaultTextProperties,
} from './constants';
import { Select } from 'antd';
import chevronDownIcon from '../../../assets/icons/chevron-down.svg';
import toolbarMinusIcon from '../../../assets/icons/toolbar-minus.svg';
import toolbarPlusIcon from '../../../assets/icons/toolbar-plus.svg';
import toolbarTextAlignmentIcon from '../../../assets/icons/toolbar-text-alignment.svg';
import toolbarTextBoldIcon from '../../../assets/icons/toolbar-text-bold.svg';
import toolbarTextUnderlineIcon from '../../../assets/icons/toolbar-text-underline.svg';
import toolbarVerticalLineIcon from '../../../assets/icons/toolbar-vertical-line.svg';
import toolbarMoreIcon from '../../../assets/icons/toolbar-more.svg';

class DrawCanvas extends Component<Props, State> {
  state: State = {
    objects: [],
    points: {
      ...defaultPointState,
    },
  };
  stageRef: Konva.Stage | null = null;

  isItemFocused: boolean = false;
  isItemMoving: boolean = false;
  isDrawing: boolean = false;

  componentDidMount() {
    document.addEventListener('keydown', event => {
      if (event.key === 'Delete') {
        this.setState({
          objects: this.state.objects.filter(
            shapeObject => !shapeObject.isSelected,
          ),
        });
      }
    });
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
      } else if (this.props.drawingTool === 'Drag') {
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

  handleSelectObject = (id: string): void => {
    this.setState({
      objects: this.state.objects.map(shapeObject => ({
        ...shapeObject,
        isSelected: shapeObject.id === id,
      })),
    });
  };

  handleDblClick = e => {
    let id = e.target.id();
    if (id) {
      id = id.replace(':Rect', '').replace(':Text', '');
    }

    this.setState({
      objects: this.state.objects.map(shapeObject => ({
        ...shapeObject,
        isEditing: shapeObject.id === id,
      })),
    });
  };

  handleDragStart = e => {
    this.isItemMoving = true;
    this.handleChangeCursor();
    const id = e.target.id();
    this.handleSelectObject(id);
    const objects = this.state.objects.map(shapeObject => {
      return {
        ...shapeObject,
        isDragging: shapeObject.id === id,
      };
    });

    this.setState({ objects });
  };

  onMouseEnterItem = e => {
    let id = e.target.id();
    if (id) {
      id = id.replace(':Rect', '').replace(':Text', '');
    }
    this.setState({
      objects: this.state.objects.map(shapeObject => {
        return {
          ...shapeObject,
          isFocused: shapeObject.id === id,
        };
      }),
    });
    this.isItemFocused = true;
    this.handleChangeCursor();
  };

  onMouseLeaveItem = () => {
    this.setState({
      objects: this.state.objects.map(shapeObject => {
        return {
          ...shapeObject,
          isFocused: false,
        };
      }),
    });

    this.isItemFocused = false;
    this.handleChangeCursor();
  };

  handleClickShape = e => {
    let id = e.target.id();
    if (id) {
      id = id.replace(':Rect', '').replace(':Text', '');
    }
    this.setState({
      objects: this.state.objects.map(shapeObject => {
        return {
          ...shapeObject,
          isSelected: shapeObject.id === id,
        };
      }),
    });
    this.handleSelectObject(id);
  };

  handleDragEnd = e => {
    this.isItemMoving = false;
    this.handleChangeCursor();
    const objects = this.state.objects.map(shapeObject => {
      return {
        ...shapeObject,
        x: e.target.x(),
        y: e.target.y(),
        isDragging: false,
      };
    });
    this.setState({ objects });
  };
  handleMouseDown = e => {
    let id = e.target.id();
    if (id) {
      id = id.replace(':Rect', '').replace(':Text', '');
    }
    this.setState({
      objects: this.state.objects.map(shapeObject => ({
        ...shapeObject,
        isSelected: shapeObject.id === id,
        isEditing: shapeObject.isEditing && shapeObject.id === id,
      })),
    });
    if (this.props.drawingTool) {
      const position = e.target.getStage().getPointerPosition();
      if (this.props.drawingTool === 'Sticky') {
        const data: ObjectInterface = {
          ...this.state.points,
          x: position.x - 100,
          y: position.y - 100,
          width: 200,
          height: 200,
          id: uuidv4(),
          isDragging: false,
          isFocused: false,
          isSelected: false,
          isEditing: false,
          rotation: 0,
          type: this.props.drawingTool,
          textData: {
            ...defaultTextProperties,
          },
        };
        this.addCanvasShape(data);
      } else {
        let radius = 0;
        if (this.props.drawingTool === 'RectRounded') {
          radius = 20;
        }
        this.isDrawing = true;
        this.setState({
          points: {
            ...this.state.points,
            x: position.x,
            y: position.y,
            radius: radius,
            type: this.props.drawingTool,
          },
        });
      }
    }
  };
  handleMouseMove = e => {
    if (this.isDrawing) {
      const position = e.target.getStage().getPointerPosition();
      const width = position.x - this.state.points.x;
      const height = position.y - this.state.points.y;
      let shapeObjectType: ShapeObjectType = this.props.drawingTool;
      let radius = 0;
      let ellipseRadius: any = {
        x: 0,
        y: 0,
      };

      if (this.props.drawingTool === 'Circle') {
        if (width === height) {
          shapeObjectType = 'Circle';
          radius = Math.abs(width);
        } else {
          shapeObjectType = 'Ellipse';
          ellipseRadius = {
            x: Math.abs(width),
            y: Math.abs(height),
          };
        }
      } else if (this.props.drawingTool === 'RectRounded') {
        radius = 20;
      }
      this.setState({
        points: {
          ...this.state.points,
          width: width,
          height: height,
          radius: radius,
          ellipseRadius: ellipseRadius,
          type: shapeObjectType,
        },
      });
    }
  };

  addCanvasShape = (data: ObjectInterface) => {
    this.setState({
      objects: [
        ...this.state.objects,
        {
          ...data,
        },
      ],
    });
  };
  handleMouseUp = e => {
    if (this.isDrawing) {
      this.isDrawing = false;
      const position = e.target.getStage().getPointerPosition();
      const width = position.x - this.state.points.x;
      const height = position.y - this.state.points.y;
      let shapeObjectType: ShapeObjectType = this.props.drawingTool;
      let radius = 0;
      let ellipseRadius: any = {
        x: 0,
        y: 0,
      };
      if (this.props.drawingTool === 'Circle') {
        if (width === height) {
          shapeObjectType = 'Circle';
          radius = Math.abs(width);
        } else {
          shapeObjectType = 'Ellipse';
          ellipseRadius = {
            x: Math.abs(width),
            y: Math.abs(height),
          };
        }
      } else if (this.props.drawingTool === 'RectRounded') {
        radius = 20;
      }

      const data: ObjectInterface = {
        ...this.state.points,
        width: width,
        height: height,
        radius: radius,
        ellipseRadius: ellipseRadius,
        id: uuidv4(),
        isDragging: false,
        isFocused: false,
        isSelected: false,
        isEditing: false,
        rotation: 0,
        type: shapeObjectType,
      };

      this.addCanvasShape(data);

      this.setState({
        points: {
          ...defaultPointState,
        },
      });
    }
  };
  updateShape(data: ObjectInterface) {
    this.setState({
      objects: this.state.objects.map(shapeObject => {
        if (shapeObject.id === data.id) {
          return {
            ...data,
            id: shapeObject.id,
          };
        } else {
          return data;
        }
      }),
    });
  }
  render() {
    return (
      <>
        {this.state.objects
          .filter(
            shapeObject =>
              (shapeObject.type === 'Sticky' || shapeObject.type === 'Text') &&
              shapeObject.isEditing,
          )
          .map(shapeObject => (
            <textarea
              className="canvas-textarea"
              value={shapeObject.textData?.text}
              style={{
                position: 'absolute',
                left: shapeObject.x + 20,
                top: shapeObject.y + 20,
                width: (shapeObject.width as number) - 40 + 'px',
                height: (shapeObject.height as number) - 40 + 'px',
                zIndex: 10000,
                backgroundColor: 'white',
              }}
              onChange={event => {
                const target = event.target as HTMLTextAreaElement;
                this.updateShape({
                  ...shapeObject,
                  textData: {
                    ...shapeObject.textData,
                    text: target.value,
                  },
                });
              }}
            />
          ))}
        {this.state.objects
          .filter(
            shapeObject =>
              (shapeObject.type === 'Sticky' || shapeObject.type === 'Text') &&
              (shapeObject.isEditing || shapeObject.isSelected),
          )
          .map(shapeObject => (
            <div
              className="canvas-text-toolbar"
              style={{ left: shapeObject.x, top: shapeObject.y }}
            >
              <div className="canvas-text-toolbar-item">
                <Select
                  defaultValue="lucy"
                  style={{ width: 120, paddingLeft: '10px' }}
                >
                  <Select.Option value="jack">Jack</Select.Option>
                  <Select.Option value="lucy">Lucy</Select.Option>
                  <Select.Option value="disabled" disabled>
                    Disabled
                  </Select.Option>
                </Select>
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <img src={chevronDownIcon} alt="selection" />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <img
                  src={toolbarMinusIcon}
                  alt="selection"
                  onClick={() => {
                    this.updateShape({
                      ...shapeObject,
                      textData: {
                        ...shapeObject.textData,
                        fontSize: Math.max(
                          10,
                          (shapeObject.textData?.fontSize as number) - 1,
                        ),
                      },
                    });
                  }}
                />
              </div>
              <div className="canvas-text-toolbar-item">
                {shapeObject.textData?.fontSize}
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <img
                  src={toolbarPlusIcon}
                  alt="selection"
                  onClick={() => {
                    this.updateShape({
                      ...shapeObject,
                      textData: {
                        ...shapeObject.textData,
                        fontSize: Math.min(
                          30,
                          (shapeObject.textData?.fontSize as number) + 1,
                        ),
                      },
                    });
                  }}
                />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <img src={toolbarTextAlignmentIcon} alt="selection" />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <img
                  src={toolbarTextBoldIcon}
                  alt="selection"
                  onClick={() => {
                    this.updateShape({
                      ...shapeObject,
                      textData: {
                        ...shapeObject.textData,
                        fontStyle:
                          shapeObject.textData?.fontStyle === 'bold'
                            ? 'normal'
                            : 'bold',
                      },
                    });
                  }}
                />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <img
                  src={toolbarTextUnderlineIcon}
                  alt="selection"
                  onClick={() => {
                    this.updateShape({
                      ...shapeObject,
                      textData: {
                        ...shapeObject.textData,
                        textDecoration:
                          shapeObject.textData?.textDecoration === 'underline'
                            ? ''
                            : 'underline',
                      },
                    });
                  }}
                />
              </div>
              <div className="canvas-text-toolbar-item">
                <img src={toolbarVerticalLineIcon} alt="selection" />
              </div>
              <div className="canvas-text-toolbar-item action-button">
                <img src={toolbarMoreIcon} alt="selection" />
              </div>
            </div>
          ))}

        <Stage
          width={window.innerWidth}
          height={window.innerHeight - 80}
          className={this.props.className}
          ref={ref => (this.stageRef = ref)}
          onMouseDown={this.handleMouseDown}
          onMousemove={this.handleMouseMove}
          onMouseup={this.handleMouseUp}
        >
          <Layer>
            {this.state.objects.map(shapeObject => {
              const shapeConfig: Konva.ShapeConfig = {
                fill: '#9646f5',
                strokeWidth: 2,
                stroke:
                  shapeObject.isSelected ||
                  (shapeObject.isFocused && this.props.drawingTool === 'Drag')
                    ? '#7c7c7c'
                    : undefined,
                shadowBlur: 10,
                shadowOpacity: 0.6,
                shadowOffsetX: (() => {
                  let shadowOffset = 5;
                  if (shapeObject.isDragging) {
                    shadowOffset = 10;
                  } else if (
                    shapeObject.isFocused &&
                    this.props.drawingTool === 'Drag'
                  ) {
                    shadowOffset = 6;
                  }
                  return shadowOffset;
                })(),
                shadowOffsetY: (() => {
                  let shadowOffset = 5;
                  if (shapeObject.isDragging) {
                    shadowOffset = 10;
                  } else if (
                    shapeObject.isFocused &&
                    this.props.drawingTool === 'Drag'
                  ) {
                    shadowOffset = 6;
                  }
                  return shadowOffset;
                })(),
              };

              const nodeConfig: Konva.NodeConfig = {
                id: shapeObject.id,
                name: shapeObject.id,
                x: shapeObject.x,
                y: shapeObject.y,
                width: shapeObject.width,
                height: shapeObject.height,
                draggable: this.props.drawingTool === 'Drag',
                onClick: this.handleClickShape,
                onDblClick: this.handleDblClick,
                onDragStart: this.handleDragStart,
                onDragEnd: this.handleDragEnd,
                onMouseEnter: this.onMouseEnterItem,
                onMouseLeave: this.onMouseLeaveItem,
                scaleX: shapeObject.isDragging ? 1.2 : 1,
                scaleY: shapeObject.isDragging ? 1.2 : 1,
              };
              if (shapeObject.type === 'Rect') {
                return (
                  <Rect
                    key={shapeObject.id}
                    cornerRadius={shapeObject.radius}
                    {...shapeConfig}
                    {...nodeConfig}
                  />
                );
              } else if (shapeObject.type === 'RectRounded') {
                return (
                  <Rect
                    key={shapeObject.id}
                    cornerRadius={shapeObject.radius}
                    {...shapeConfig}
                    {...nodeConfig}
                  />
                );
              } else if (shapeObject.type === 'Circle') {
                delete nodeConfig['width'];
                delete nodeConfig['height'];
                return (
                  <Circle
                    key={shapeObject.id}
                    radius={shapeObject.radius as number}
                    {...shapeConfig}
                    {...nodeConfig}
                  />
                );
              } else if (shapeObject.type === 'Ellipse') {
                delete nodeConfig['width'];
                delete nodeConfig['height'];
                return (
                  <Ellipse
                    key={shapeObject.id}
                    radiusX={shapeObject.ellipseRadius?.x as number}
                    radiusY={shapeObject.ellipseRadius?.y as number}
                    {...shapeConfig}
                    {...nodeConfig}
                  />
                );
              } else if (shapeObject.type === 'Star') {
                return (
                  <Star
                    key={shapeObject.id}
                    numPoints={5}
                    {...shapeConfig}
                    {...nodeConfig}
                    innerRadius={(shapeObject.width as number) / 2}
                    outerRadius={shapeObject.width as number}
                  />
                );
              } else if (shapeObject.type === 'Triangle') {
                return (
                  <Shape
                    key={shapeObject.id}
                    sceneFunc={(context, shape) => {
                      context.beginPath();

                      context.moveTo((shapeObject.width as number) / 2, 0);
                      context.lineTo(0, shapeObject.height as number);
                      context.lineTo(
                        shapeObject.width as number,
                        shapeObject.height as number,
                      );
                      context.closePath();
                      // (!) Konva specific method, it is very important
                      context.fillStrokeShape(shape);
                    }}
                    {...shapeConfig}
                    {...nodeConfig}
                  />
                );
              } else if (shapeObject.type === 'Sticky') {
                return (
                  <Group key={shapeObject.id} {...shapeConfig} {...nodeConfig}>
                    <Rect
                      key={shapeObject.id + ':Rect'}
                      id={shapeObject.id + ':Rect'}
                      x={0}
                      y={0}
                      height={shapeObject.height as number}
                      width={shapeObject.width as number}
                      onDblClick={this.handleDblClick}
                      cornerRadius={30}
                      fill="#9646f5"
                    />
                    <Text
                      key={shapeObject.id + ':Text'}
                      id={shapeObject.id + ':Text'}
                      x={0}
                      y={0}
                      height={shapeObject.height as number}
                      width={shapeObject.width as number}
                      padding={20}
                      fill="#ffffff"
                      fillEnabled={true}
                      {...shapeObject.textData}
                    />
                  </Group>
                );
              }
            })}

            {this.props.drawingTool === 'Star' && this.isDrawing && (
              <Star
                numPoints={5}
                innerRadius={(this.state.points.width as number) / 2}
                outerRadius={this.state.points.width as number}
                x={this.state.points.x}
                y={this.state.points.y}
                stroke="#9646f5"
                dash={[10, 10]}
              />
            )}
            {this.props.drawingTool === 'Triangle' && this.isDrawing && (
              <Shape
                x={this.state.points.x}
                y={this.state.points.y}
                sceneFunc={(context, shape) => {
                  context.beginPath();
                  context.moveTo((this.state.points.width as number) / 2, 0);
                  context.lineTo(0, this.state.points.height as number);
                  context.lineTo(
                    this.state.points.width as number,
                    this.state.points.height as number,
                  );
                  context.closePath();
                  // (!) Konva specific method, it is very important
                  context.fillStrokeShape(shape);
                }}
                stroke="#9646f5"
                dash={[10, 10]}
              />
            )}

            {this.props.drawingTool === 'Circle' &&
              this.isDrawing &&
              this.state.points.type === 'Circle' && (
                <Circle
                  x={this.state.points.x}
                  y={this.state.points.y}
                  radius={this.state.points.radius as number}
                  stroke="#9646f5"
                  dash={[10, 10]}
                />
              )}

            {this.props.drawingTool === 'Circle' &&
              this.isDrawing &&
              this.state.points.type === 'Ellipse' && (
                <Ellipse
                  x={this.state.points.x}
                  y={this.state.points.y}
                  radiusX={this.state.points.ellipseRadius?.x as number}
                  radiusY={this.state.points.ellipseRadius?.y as number}
                  stroke="#9646f5"
                  dash={[10, 10]}
                />
              )}

            {(this.props.drawingTool === 'Rect' ||
              this.props.drawingTool === 'RectRounded') &&
              this.isDrawing && (
                <Rect
                  x={this.state.points.x}
                  y={this.state.points.y}
                  width={this.state.points.width}
                  height={this.state.points.height}
                  cornerRadius={this.state.points.radius}
                  stroke="#9646f5"
                  dash={[10, 10]}
                />
              )}

            {this.props.drawingTool === 'Sticky' && (
              <>
                <Rect
                  x={this.state.points.x}
                  y={this.state.points.y}
                  width={this.state.points.width}
                  height={this.state.points.height}
                  cornerRadius={30}
                  stroke="#9646f5"
                  dash={[10, 10]}
                />
              </>
            )}
          </Layer>
        </Stage>
      </>
    );
  }
}

export default memo(DrawCanvas);
