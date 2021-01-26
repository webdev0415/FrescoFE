import React, { PureComponent } from 'react';
import { Layer, Stage } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';
import { ObjectInterface, Props, State } from './types';
import { defaultObjectState } from './constants';
import {
  CollaboratorColorAndCount,
  collaboratorsService,
} from 'services/CollaboratorsService';

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

class DrawBoard extends PureComponent<Props, State> {
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
    zoomLevel: 1,
  };

  stageRef: Konva.Stage | null = null;
  textAreaRef = React.createRef<HTMLTextAreaElement>();
  isItemFocused: boolean = false;
  isItemMoving: boolean = false;
  isDrawing: boolean = false;

  isClicked: boolean = false;
  startX: number = 0;
  startY: number = 0;
  scrollLeft: number = 0;
  scrollTop: number = 0;
  currentPositionX: number = 0;
  currentPositionY: number = 0;

  componentDidMount() {
    this.getData();
    this.setState({ zoomLevel: this.props.zoomLevel });
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any,
  ) {
    if (
      this.state.zoomLevel === prevState.zoomLevel &&
      this.state.zoomLevel !== this.props.zoomLevel
    ) {
      console.log(
        'componentDidUpdate',
        this.state.zoomLevel,
        this.props.zoomLevel,
      );
      this.setState({ zoomLevel: this.props.zoomLevel });
      const canvasBody = document.querySelector(
        '.canvas-body-content canvas',
      ) as HTMLDivElement;

      const canvasWidth = 1900 * this.state.zoomLevel;
      const canvasHeight = 1200 * this.state.zoomLevel;

      if (canvasBody) {
        canvasBody.style.width = canvasWidth + 'px';
        canvasBody.style.height = canvasHeight + 'px';
        canvasBody.style.top =
          (window.innerHeight / 2 - canvasHeight / 2) *
            (this.props.zoomLevel - 1) +
          'px';
        canvasBody.style.left =
          (window.innerWidth / 2 - canvasWidth / 2) *
            (this.props.zoomLevel - 1) +
          'px';
      }
    }
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
    this.updateCollaborators();
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

  updateCollaborators = () => {
    const collaborators: CollaboratorColorAndCount = {};
    this.state.objects.forEach(item => {
      if (item.notes) {
        item.notes.forEach(note => {
          if (collaborators.hasOwnProperty(note.userId)) {
            collaborators[note.userId].color = note.circle.fill;
            collaborators[note.userId].count =
              collaborators[note.userId].count + 1;
          } else {
            collaborators[note.userId] = {
              color: note.circle.fill,
              count: 1,
            };
          }
        });
      }
    });
    collaboratorsService.patch(collaborators);
  };

  getBoardObject(): void {
    const canvasTitle = document.getElementById(
      'canvas-title',
    ) as HTMLSpanElement;
    const canvasTitleInput = document.getElementById(
      'canvas-title-input',
    ) as HTMLInputElement;
    BoardApiService.getById(this.props.match?.params.id as string).subscribe(
      boardData => {
        collaboratorsService.update(
          boardData.users.map(item => ({
            color: collaboratorsService.getRandomColor(),
            count: 0,
            email: item.email,
            id: item.id,
            name: item.name,
            role: item.role,
            selected: false,
          })),
        );
        canvasTitle.innerText = boardData.name;
        document.title = boardData.name;
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

  onWheel = (e: any) => {
    const scaleBy = 1.05;
    const stage = e.target.getStage();

    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = Math.max(
      1,
      Math.min(2, e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy),
    );
    const newZoomLevel = Math.max(
      0,
      Math.min(100, Math.trunc(newScale * 100 - 100)),
    );
    const zoomIn = newScale > oldScale;
    const zoomOut = newScale < oldScale;

    if (zoomIn || zoomOut) {
      const scrollTo = {
        left: mousePointTo.x * (newScale - 1),
        top: mousePointTo.y * (newScale - 1),
      };

      this.setState({ zoomLevel: newZoomLevel / 100 + 1 }, () => {
        // console.log({
        //   scaleBy,
        //   oldScale,
        //   mousePointTo,
        //   newScale,
        //   zoom: newScale * 100 - 100,
        //   newZoomLevel,
        //   scrollTo,
        // });
        const canvasBody = document.querySelector('.canvas-body-content');
        if (canvasBody) {
          canvasBody.scrollTo({
            left: scrollTo.left,
            top: scrollTo.top,
          });
        }
        this.props.onZoom(newZoomLevel);
      });
    }
  };

  onMouseDown = (evt: Konva.KonvaEventObject<MouseEvent>) => {
    this.isClicked = true;
    const canvasBody = document.querySelector(
      '.canvas-body-content',
    ) as HTMLDivElement;
    const stage = evt.target.getStage();
    const position = stage?.getPointerPosition();
    this.startX = evt.evt.pageX - canvasBody.offsetLeft;
    this.startY = evt.evt.pageY - canvasBody.offsetTop;
    this.scrollLeft = canvasBody.scrollLeft;
    this.scrollTop = canvasBody.scrollTop;
    canvasBody.style.cursor = 'all-scroll';
  };
  onMouseUp = (evt: Konva.KonvaEventObject<MouseEvent>) => {
    const canvasBody = document.querySelector(
      '.canvas-body-content',
    ) as HTMLDivElement;
    const stage = evt.target.getStage();
    const position = stage?.getPointerPosition();
    this.startX = evt.evt.pageX - canvasBody.offsetLeft;
    this.startY = evt.evt.pageY - canvasBody.offsetTop;
    this.scrollLeft = canvasBody.scrollLeft;
    this.scrollTop = canvasBody.scrollTop;
    canvasBody.style.cursor = 'auto';
  };
  onMouseMove = (evt: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = evt.target.getStage();
    const position = stage?.getPointerPosition();
    if (this.isClicked) {
      const mousePointTo = {
        x: (position?.x as number) - (stage?.x() as number),
        y: (position?.y as number) - (stage?.y() as number),
      };
      const canvasBody = document.querySelector(
        '.canvas-body-content',
      ) as HTMLDivElement;
      const x = evt.evt.pageX - canvasBody.offsetLeft;
      const y = evt.evt.pageY - canvasBody.offsetTop;
      const walkX = x - this.startX;
      const walkY = y - this.startY;
      if (x > 5 || y > 5) {
        canvasBody.scrollTo({
          left: this.scrollLeft - walkX,
          top: this.scrollTop - walkY,
        });
      }
    }
  };

  render() {
    return (
      <div className={this.props.className}>
        <Stage
          width={1900 * this.state.zoomLevel}
          height={1200 * this.state.zoomLevel}
          className="canvas-body-content"
          style={{
            overflow: 'hidden',
          }}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          ref={ref => (this.stageRef = ref)}
          scale={{
            x: this.state.zoomLevel,
            y: this.state.zoomLevel,
          }}
          onWheel={this.onWheel}
          key={'Stage'}
        >
          <Layer key={'Layer'}>
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
                    zoomLevel={this.state.zoomLevel}
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
