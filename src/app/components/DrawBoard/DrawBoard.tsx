import React, { Component } from 'react';
import { Layer, Stage } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';
import {
  BoardSocketEventEnum,
  ObjectInterface,
  ObjectSocketInterface,
  Props,
  State,
} from './types';
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

class DrawBoard extends Component<Props, State> {
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
    this.getData();
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
    const canvas: any = {
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

  updateHistory(data: ObjectInterface) {
    this.setState({
      prevHistory: [
        ...this.state.prevHistory,
        { ...data, isEditing: false, isSelected: false, isFocused: false },
      ],
      nextHistory: [],
    });
  }

  updateShape(data: ObjectInterface) {
    if (data.type !== 'Sticky') {
      return;
    }

    const item = this.state.objects.find(item => item.id === data.id);
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

  render() {
    return (
      <div className={this.props.className}>
        <Stage
          width={1900 * this.props.zoomLevel}
          height={1200 * this.props.zoomLevel}
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
                    socketIoClient={this.props.socketIoClient}
                    zoomLevel={this.props.zoomLevel}
                    className={this.props.className}
                    onChange={data => {
                      this.updateShape(data);
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
