import React, { PureComponent } from 'react';
import { Layer, Stage } from 'react-konva';
import { v4 as uuidV4 } from 'uuid';
import Konva from 'konva';
import {
  BoardNotesAreaInterface,
  BoardObjectInterface,
  ObjectInterface,
  Props,
  State,
} from './types';
import { generateDefaultBoardNotesData } from './constants';

import {
  BoardsSection,
  EllipseTransform,
  LineTransform,
  NotesArea,
  NotesHeaderSection,
  RectTransform,
  StarTransform,
  StickyTransform,
  TriangleTransform,
} from './components';

import {
  BoardApiService,
  ImageUploadingService,
} from '../../../services/APIService';

class DrawBoard extends PureComponent<Props, State> {
  state: State = {
    id: uuidV4(),
    objects: [],
    data: [],
    hoverItem: '',
    SelectedItem: '',
    canvas: {
      name: '',
      orgId: '',
      categoryId: '',
      imageId: '',
    },
  };
  stageRef: Konva.Stage | null = null;

  componentDidMount() {
    this.getData();
    document.addEventListener('keydown', this.onDeleteCanvasItem);
    document.addEventListener('click', this.onSelectCanvasItem);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onDeleteCanvasItem);
    document.removeEventListener('click', this.onSelectCanvasItem);
  }

  onSelectCanvasItem = (event: MouseEvent) => {
    this.setState(state => ({ SelectedItem: state.hoverItem }));
  };

  onDeleteCanvasItem = (event: KeyboardEvent) => {
    if (!!this.state.SelectedItem && event.key === 'Delete') {
      this.setState(
        state => ({
          objects: state.objects.filter(item => item.id !== state.SelectedItem),
        }),
        () => {
          this.save();
        },
      );
    }
  };

  uploadImage(): void {
    ImageUploadingService.imageUploadFromDataUrl(
      this.stageRef?.toDataURL({ pixelRatio: 1 }) as string,
      this.props.match?.params.type as string,
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

  getJsonData(): Promise<string> {
    return new Promise(resolve => {
      const data = {
        objects: this.state.objects,
        data: this.state.data,
      };
      resolve(JSON.stringify(data));
    });
  }

  saveBoard(): void {
    this.getJsonData().then(data => {
      const canvas = { ...this.state.canvas };
      if (!canvas.imageId) {
        delete canvas.imageId;
      }
      BoardApiService.updateById(this.props.match?.params.id as string, {
        ...canvas,
        data: data,
      }).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.error(error);
        },
      );
    });
  }

  getData(): void {
    this.getBoardObject();
  }

  getBoardObject(): void {
    const canvasTitle = document.getElementById(
      'canvas-title',
    ) as HTMLSpanElement;
    BoardApiService.getById(this.props.match?.params.id as string).subscribe(
      boardData => {
        canvasTitle.innerText = boardData.name;
        let objects: ObjectInterface[] = [];
        let data: BoardNotesAreaInterface[] = [];
        const canvasObjects = !!boardData.data
          ? JSON.parse(boardData.data)
          : [];

        if (Array.isArray(canvasObjects)) {
          objects = canvasObjects;
          data = generateDefaultBoardNotesData();
        } else {
          data = canvasObjects.data;
          objects = canvasObjects.objects;
        }

        this.setState(
          {
            objects: objects,
            data: data,
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

  onChangeNotes = (id: string, data: BoardObjectInterface[]) => {
    console.log('onChangeNotes', this.state);
    this.setState(
      {
        data: this.state.data.map(item => {
          if (item.id === id) {
            return {
              ...item,
              data,
            };
          } else {
            return item;
          }
        }),
      },
      () => {
        console.log('callback', this.state);
        this.save();
      },
    );
  };

  onMouseEnterCanvasObject = id => {
    this.setState({ hoverItem: id });
  };

  onMouseLeaveCanvasObject = id => {
    if (this.state.hoverItem === id) {
      this.setState({ hoverItem: id });
    }
  };

  render() {
    return (
      <div className={this.props.className}>
        <Stage
          width={Math.max(1980, window.innerWidth) * this.props.zoomLevel}
          height={
            Math.max(1100, window.innerHeight - 80) * this.props.zoomLevel
          }
          className="canvas-body-content"
          ref={ref => (this.stageRef = ref)}
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
                    onMouseEnter={this.onMouseEnterCanvasObject}
                    onMouseLeave={this.onMouseLeaveCanvasObject}
                    selected={this.state.SelectedItem}
                  />
                );
              } else if (shapeObject.type === 'Ellipse') {
                return (
                  <>
                    <EllipseTransform
                      key={shapeObject.id}
                      data={shapeObject}
                      onMouseEnter={this.onMouseEnterCanvasObject}
                      onMouseLeave={this.onMouseLeaveCanvasObject}
                      selected={this.state.SelectedItem}
                    />
                  </>
                );
              } else if (shapeObject.type === 'Star') {
                return (
                  <>
                    <StarTransform
                      key={shapeObject.id}
                      data={shapeObject}
                      onMouseEnter={this.onMouseEnterCanvasObject}
                      onMouseLeave={this.onMouseLeaveCanvasObject}
                      selected={this.state.SelectedItem}
                    />
                  </>
                );
              } else if (shapeObject.type === 'Triangle') {
                return (
                  <TriangleTransform
                    key={shapeObject.id}
                    data={shapeObject}
                    onMouseEnter={this.onMouseEnterCanvasObject}
                    onMouseLeave={this.onMouseLeaveCanvasObject}
                    selected={this.state.SelectedItem}
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
                    onMouseEnter={this.onMouseEnterCanvasObject}
                    onMouseLeave={this.onMouseLeaveCanvasObject}
                    selected={this.state.SelectedItem}
                  />
                );
              } else if (shapeObject.type === 'Line') {
                return (
                  <LineTransform
                    key={shapeObject.id}
                    data={shapeObject}
                    onMouseEnter={this.onMouseEnterCanvasObject}
                    onMouseLeave={this.onMouseLeaveCanvasObject}
                    selected={this.state.SelectedItem}
                  />
                );
              } else {
                return <></>;
              }
            })}

            <NotesHeaderSection
              x={20}
              y={35}
              width={290}
              height={40}
              fill="#55DDE0"
              textFill="#ffffff"
              text="Awareness"
            />

            <NotesHeaderSection
              x={290 + 30}
              y={35}
              width={290}
              height={40}
              fill="#33658A"
              textFill="#ffffff"
              text="Choices"
            />

            <NotesHeaderSection
              x={290 + 30 + 290 + 10}
              y={35}
              width={290}
              height={40}
              fill="#F6AE2D"
              textFill="#4E4B5C"
              text="Decisions"
            />

            <NotesHeaderSection
              x={290 + 30 + 290 + 10 + 290 + 10}
              y={35}
              width={290}
              height={40}
              fill="#F26419"
              textFill="#ffffff"
              text="Threats"
            />

            <BoardsSection
              x={20}
              y={90}
              width={window.innerWidth - 20}
              height={14}
              text="What do you think?"
            />

            <BoardsSection
              x={20}
              y={310}
              width={window.innerWidth - 20}
              height={14}
              text="Search Queries"
            />

            <BoardsSection
              x={20}
              y={530}
              width={window.innerWidth - 20}
              height={14}
              text="Search Queries"
            />

            <BoardsSection
              x={20}
              y={750}
              width={window.innerWidth - 20}
              height={14}
              text="Opportunity Areas"
            />
            {this.state.data.map(item => (
              <NotesArea
                key={item.id}
                id={item.id}
                y={item.y}
                x={item.x}
                height={item.height}
                width={item.width}
                data={item.data}
                onChange={this.onChangeNotes}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default DrawBoard;
