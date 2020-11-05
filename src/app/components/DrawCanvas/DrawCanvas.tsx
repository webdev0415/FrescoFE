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
} from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';

type ShapeObjectType =
  | 'Rect'
  | 'RectRounded'
  | 'Triangle'
  | 'Circle'
  | 'Ellipse'
  | 'Star'
  | null;

interface Props {
  className: string;
  drawingTool: ShapeObjectType;
}
interface PointsInterface {
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  ellipseRadius?: {
    x: number;
    y: number;
  };
  type: ShapeObjectType;
}
interface ObjectInterface extends PointsInterface {
  id: string;
  rotation: number;
  isDragging: boolean;
}
interface State {
  objects: ObjectInterface[];
  points: PointsInterface;
}
class DrawCanvas extends Component<Props, State> {
  state: State = {
    objects: [],
    points: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      radius: 0,
      ellipseRadius: {
        x: 0,
        y: 0,
      },
      type: null,
    },
  };
  stageRef: Konva.Stage | null = null;
  canvasBoxRef: HTMLDivElement | null = null;

  isItemFocused: boolean = false;
  isDrawing: boolean = false;

  handleDragStart = e => {
    const id = e.target.id();
    const objects = this.state.objects.map(shapeObject => {
      return {
        ...shapeObject,
        isDragging: shapeObject.id === id,
      };
    });

    this.setState({ objects });
  };

  onMouseEnterItem = () => {
    this.isItemFocused = true;
  };

  onMouseLeaveItem = () => {
    this.isItemFocused = false;
  };

  handleDragEnd = e => {
    const objects = this.state.objects.map(shapeObject => {
      return {
        ...shapeObject,
        isDragging: false,
      };
    });
    this.setState({ objects });
  };
  handleMouseDown = e => {
    if (!(this.isItemFocused || !this.props.drawingTool)) {
      this.isDrawing = true;
      const position = e.target.getStage().getPointerPosition();
      this.setState({
        points: {
          ...this.state.points,
          x: position.x,
          y: position.y,
          type: this.props.drawingTool,
        },
      });
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
        if (this.state.points.width === this.state.points.height) {
          shapeObjectType = 'Circle';
          radius = (this.state.points.width as number) / 2;
        } else {
          shapeObjectType = 'Ellipse';
          ellipseRadius = {
            x: (this.state.points.width as number) / 2,
            y: (this.state.points.height as number) / 2,
          };
        }
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
  handleMouseUp = e => {
    if (this.isDrawing) {
      this.isDrawing = false;
      let shapeObjectType: ShapeObjectType = this.props.drawingTool;
      let radius = 0;
      let ellipseRadius: any = {
        x: 0,
        y: 0,
      };
      if (this.props.drawingTool === 'Circle') {
        if (this.state.points.width === this.state.points.height) {
          shapeObjectType = 'Circle';
          radius = (this.state.points.width as number) / 2;
        } else {
          shapeObjectType = 'Ellipse';
          ellipseRadius = {
            x: (this.state.points.width as number) / 2,
            y: (this.state.points.height as number) / 2,
          };
        }
      }
      this.setState({
        objects: [
          ...this.state.objects,
          {
            ...this.state.points,
            radius: radius,
            ellipseRadius: ellipseRadius,
            id: uuidv4(),
            isDragging: false,
            rotation: 0,
            type: shapeObjectType,
          },
        ],
      });
      this.setState({
        points: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          radius: 0,
          ellipseRadius: {
            x: 0,
            y: 0,
          },
          type: this.props.drawingTool,
        },
      });
    }
  };
  render() {
    return (
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
                context.moveTo(this.state.points.x, this.state.points.y);
                context.lineTo(
                  this.state.points.x - (this.state.points.width as number) / 2,
                  this.state.points.y + (this.state.points.height as number),
                );
                context.lineTo(
                  this.state.points.x + (this.state.points.width as number) / 2,
                  this.state.points.y + (this.state.points.height as number),
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
                fill="black"
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

          {this.state.objects.map(shapeObject => {
            if (shapeObject.type === 'Rect') {
              return (
                <Rect
                  key={shapeObject.id}
                  id={shapeObject.id}
                  x={shapeObject.x}
                  y={shapeObject.y}
                  width={shapeObject.width}
                  height={shapeObject.height}
                  fill="black"
                  cornerRadius={shapeObject.radius}
                  draggable
                  onDragStart={this.handleDragStart}
                  onDragEnd={this.handleDragEnd}
                  onMouseEnter={this.onMouseEnterItem}
                  onMouseLeave={this.onMouseLeaveItem}
                  shadowBlur={10}
                  shadowOpacity={0.6}
                  shadowOffsetX={shapeObject.isDragging ? 10 : 5}
                  shadowOffsetY={shapeObject.isDragging ? 10 : 5}
                  scaleX={shapeObject.isDragging ? 1.2 : 1}
                  scaleY={shapeObject.isDragging ? 1.2 : 1}
                />
              );
            } else if (shapeObject.type === 'Circle') {
              return (
                <Circle
                  key={shapeObject.id}
                  id={shapeObject.id}
                  x={shapeObject.x}
                  y={shapeObject.y}
                  name={shapeObject.id}
                  draggable
                  fill="black"
                  radius={shapeObject.radius as number}
                  onDragStart={this.handleDragStart}
                  onDragEnd={this.handleDragEnd}
                  onMouseEnter={this.onMouseEnterItem}
                  onMouseLeave={this.onMouseLeaveItem}
                  shadowBlur={10}
                  shadowOpacity={0.6}
                  shadowOffsetX={shapeObject.isDragging ? 10 : 5}
                  shadowOffsetY={shapeObject.isDragging ? 10 : 5}
                  scaleX={shapeObject.isDragging ? 1.2 : 1}
                  scaleY={shapeObject.isDragging ? 1.2 : 1}
                />
              );
            } else if (shapeObject.type === 'Ellipse') {
              return (
                <Ellipse
                  key={shapeObject.id}
                  id={shapeObject.id}
                  x={shapeObject.x}
                  y={shapeObject.y}
                  name={shapeObject.id}
                  draggable
                  fill="black"
                  radiusX={shapeObject.ellipseRadius?.x as number}
                  radiusY={shapeObject.ellipseRadius?.y as number}
                  onDragStart={this.handleDragStart}
                  onDragEnd={this.handleDragEnd}
                  onMouseEnter={this.onMouseEnterItem}
                  onMouseLeave={this.onMouseLeaveItem}
                  shadowBlur={10}
                  shadowOpacity={0.6}
                  shadowOffsetX={shapeObject.isDragging ? 10 : 5}
                  shadowOffsetY={shapeObject.isDragging ? 10 : 5}
                  scaleX={shapeObject.isDragging ? 1.2 : 1}
                  scaleY={shapeObject.isDragging ? 1.2 : 1}
                />
              );
            } else if (shapeObject.type === 'Star') {
              return (
                <Star
                  key={shapeObject.id}
                  id={shapeObject.id}
                  x={shapeObject.x}
                  y={shapeObject.y}
                  numPoints={5}
                  innerRadius={(shapeObject.width as number) / 2}
                  outerRadius={shapeObject.width as number}
                  name={shapeObject.id}
                  draggable
                  fill="black"
                  radius={shapeObject.ellipseRadius}
                  radiusX={shapeObject.ellipseRadius?.x as number}
                  radiusY={shapeObject.ellipseRadius?.y as number}
                  onDragStart={this.handleDragStart}
                  onDragEnd={this.handleDragEnd}
                  onMouseEnter={this.onMouseEnterItem}
                  onMouseLeave={this.onMouseLeaveItem}
                  shadowBlur={10}
                  shadowOpacity={0.6}
                  shadowOffsetX={shapeObject.isDragging ? 10 : 5}
                  shadowOffsetY={shapeObject.isDragging ? 10 : 5}
                  scaleX={shapeObject.isDragging ? 1.2 : 1}
                  scaleY={shapeObject.isDragging ? 1.2 : 1}
                />
              );
            } else if (shapeObject.type === 'Triangle') {
              return (
                <Shape
                  key={shapeObject.id}
                  id={shapeObject.id}
                  x={shapeObject.x}
                  y={shapeObject.y}
                  sceneFunc={(context, shape) => {
                    context.beginPath();
                    context.moveTo(shapeObject.x, shapeObject.y);

                    context.lineTo(
                      shapeObject.x - (shapeObject.height as number) / 2,
                      shapeObject.y + (shapeObject.height as number),
                    );
                    context.lineTo(
                      shapeObject.x + (shapeObject.width as number) / 2,
                      shapeObject.y + (shapeObject.height as number),
                    );
                    context.closePath();
                    // (!) Konva specific method, it is very important
                    context.fillStrokeShape(shape);
                  }}
                  draggable
                  fill="black"
                  strokeWidth={4}
                  onDragStart={this.handleDragStart}
                  onDragEnd={this.handleDragEnd}
                  onMouseEnter={this.onMouseEnterItem}
                  onMouseLeave={this.onMouseLeaveItem}
                  shadowBlur={10}
                  shadowOpacity={0.6}
                  shadowOffsetX={shapeObject.isDragging ? 10 : 5}
                  shadowOffsetY={shapeObject.isDragging ? 10 : 5}
                  scaleX={shapeObject.isDragging ? 1.2 : 1}
                  scaleY={shapeObject.isDragging ? 1.2 : 1}
                />
              );
            }
          })}
        </Layer>
      </Stage>
    );
  }
}

export default memo(DrawCanvas);
