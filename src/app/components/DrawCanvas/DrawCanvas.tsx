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
  ObjectInterface,
  State,
  TextProperties,
  FontInterface,
} from './types';
import _ from 'lodash';
import {
  defaultObjectState,
  defaultPointState,
  defaultTextProperties,
} from './constants';
import { Select, Modal } from 'antd';
import {
  StarTransform,
  EllipseTransform,
  RectTransform,
  StickyTransform,
  TextTransform,
  TriangleTransform,
} from './components';
import {
  ChevronDownIcon,
  MinusSquareIcon,
  MoreIcon,
  TextAlignmentIcon,
  TextBoldIcon,
  TextUnderLineIcon,
  VerticalLineIcon,
  TextColorIcon,
  FillColorIcon,
  BorderStyleIcon,
  MarkerIcon,
} from '../CanvasIcons';

class DrawCanvas extends Component<Props, State> {
  state: State = {
    objects: [],
    points: {
      ...defaultObjectState,
    },
    history: [[]],
    historyIndex: 0,
  };
  stageRef: Konva.Stage | null = null;

  isItemFocused: boolean = false;
  isItemMoving: boolean = false;
  isDrawing: boolean = false;

  fontList: FontInterface[] = [
    {
      fontFamily: 'Arial',
      fontName: 'Arial',
    },
    {
      fontFamily: 'Roboto',
      fontName: 'Roboto',
    },
    {
      fontFamily: 'Space Grotesk',
      fontName: 'Space Grotesk',
    },
    {
      fontFamily: 'Poppins',
      fontName: 'Poppins',
    },
    {
      fontFamily: 'Syne Tactile',
      fontName: 'Syne Tactile',
    },
    {
      fontFamily: 'Itim',
      fontName: 'Itim',
    },
    {
      fontFamily: 'Anton',
      fontName: 'Anton',
    },
    {
      fontFamily: 'Josefin Sans',
      fontName: 'Josefin Sans',
    },
  ];

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

    const undoHistory = document.getElementById(
      'undo-history',
    ) as HTMLDivElement;
    const redoHistory = document.getElementById(
      'redo-history',
    ) as HTMLDivElement;

    undoHistory.addEventListener('click', () => {
      const historyLength = this.state.history.length;
      const historyIndex = this.state.historyIndex;
      if (historyIndex => 0 && historyIndex < historyLength) {
        const newHistoryIndex = Math.max(0, historyIndex - 1);
        this.setState({
          objects: _.cloneDeep(this.state.history[newHistoryIndex].slice()),
          historyIndex: newHistoryIndex,
        });
      }
    });

    redoHistory.addEventListener('click', e => {
      const historyLength = this.state.history.length;
      const historyIndex = this.state.historyIndex;
      if (historyIndex => 0 && historyIndex < historyLength - 1) {
        const newHistoryIndex = Math.min(historyIndex + 1, historyLength - 1);
        this.setState({
          objects: _.cloneDeep(this.state.history[newHistoryIndex].slice()),
          historyIndex: newHistoryIndex,
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
      console.log(this.props.zoomLevel);
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
        this.addCanvasShape(data);
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
      const history = _.cloneDeep(this.state.objects.slice());
      this.updateHistory(history);
    }
    this.setState({
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
    });
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

      this.addCanvasShape(data);

      this.setState({
        points: {
          ...defaultObjectState,
        },
      });
    }
  };

  updateHistory(data: ObjectInterface[]) {
    this.setState({
      history: [
        ...this.state.history,
        data.map(item => ({ ...item, isEditing: false, isDragging: false })),
      ],
      historyIndex: this.state.historyIndex + 1,
    });
  }

  updateShape(data: ObjectInterface, saveHistory: boolean = false) {
    if (saveHistory) {
      const history = _.cloneDeep(this.state.objects);
      this.updateHistory(history);
    }

    this.setState({
      objects: this.state.objects.map(shapeObject => {
        if (shapeObject.id === data.id) {
          return {
            ...data,
            id: shapeObject.id,
          };
        } else {
          return {
            ...shapeObject,
            isSelected: false,
            isEditing: false,
            isFocused: false,
          };
        }
      }),
    });
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
                  {this.fontList.map(font => (
                    <Select.Option
                      key={font.fontName}
                      value={font.fontFamily}
                      style={{
                        fontFamily: font.fontFamily,
                      }}
                    >
                      {font.fontName}
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
                <MinusSquareIcon
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
                      this.updateShape(data);
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
                        this.updateShape(data);
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
                        this.updateShape(data);
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
                      this.updateShape(data);
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
                      this.updateShape(data);
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
                      this.updateShape(data);
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
