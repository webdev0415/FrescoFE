import React, { Component, memo } from 'react';
import { Layer, Stage, Star, Text, Rect } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';

interface Props {
  className: string;
}
interface PointsInterface {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface ObjectInterface extends PointsInterface {
  id: string;
  rotation: number;
  isDragging: boolean;
  type: 'Rect';
}
interface State {
  objects: ObjectInterface[];
}

class DrawCanvas extends Component<Props, State> {
  state: State = {
    objects: [],
  };
  stageRef: Konva.Stage | null = null;
  canvasBoxRef: HTMLDivElement | null = null;

  isItemFocused: boolean = false;
  isDrawing: boolean = false;
  points: PointsInterface = { x: 0, y: 0, width: 0, height: 0 };

  componentDidMount() {
    (document.querySelector<HTMLDivElement>(
      '.canvas-body',
    ) as HTMLDivElement).appendChild(this.canvasBoxRef as HTMLDivElement);
  }

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
    if (!this.isItemFocused) {
      this.isDrawing = true;
      const position = e.target.getStage().getPointerPosition();
      this.points.x = position.x;
      this.points.y = position.y;
      Object.assign((this.canvasBoxRef as HTMLDivElement).style, {
        top: this.points.y + 'px',
        left: this.points.x + 'px',
      });
      (this.canvasBoxRef as HTMLDivElement).style.removeProperty('display');
    }
  };
  handleMouseMove = e => {
    if (this.isDrawing) {
      const position = e.target.getStage().getPointerPosition();
      this.points.width = position.x - this.points.x;
      this.points.height = position.y - this.points.y;
      Object.assign((this.canvasBoxRef as HTMLDivElement).style, {
        top: this.points.y + 'px',
        left: this.points.x + 'px',
        width: this.points.width + 'px',
        height: this.points.height + 'px',
      });
    }
  };
  handleMouseUp = e => {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.setState({
        objects: [
          ...this.state.objects,
          {
            ...this.points,
            id: uuidv4(),
            isDragging: false,
            rotation: 0,
            type: 'Rect',
          },
        ],
      });
      Object.assign((this.canvasBoxRef as HTMLDivElement).style, {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        display: 'none',
      });
      this.points = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    }
  };
  render() {
    return (
      <>
        <div
          ref={ref => (this.canvasBoxRef = ref)}
          style={{
            display: 'none',
            width: 0,
            height: 0,
            position: 'absolute',
            border: '2px dashed #9646f5',
          }}
        />
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
            {this.state.objects.map(shapeObject => (
              <Rect
                key={shapeObject.id}
                id={shapeObject.id}
                x={shapeObject.x}
                y={shapeObject.y}
                width={shapeObject.width}
                height={shapeObject.height}
                fill="black"
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
            ))}
          </Layer>
        </Stage>
      </>
    );
  }
}

export default memo(DrawCanvas);
