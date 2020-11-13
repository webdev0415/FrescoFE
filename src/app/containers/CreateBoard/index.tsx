import React, { Component } from 'react';
import { Layer, Stage } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import Konva from 'konva';
import { ObjectInterface, Props, State, TextProperties } from './types';
import _ from 'lodash';
import { defaultObjectState, defaultTextProperties } from './constants';
import { Dropdown, Menu, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import logoImg from 'assets/icons/logo-color.svg';

import { UndoIcon, RedoIcon } from 'app/components/CanvasIcons';
import {
  EllipseTransform,
  RectTransform,
  StarTransform,
  TextTransform,
  TriangleTransform,
} from 'app/components/DrawCanvas/components';
import { StickyTransform } from './components/StickyTransform';
import { BoardApiService } from 'services/APIService/BoardsApi.service';
import Auth from 'services/Auth';

export class CreateBoard extends Component<Props, State> {
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
      if (event.key === 'Delete') {
        this.setState({
          objects: this.state.objects.filter(
            shapeObject => !shapeObject.isSelected,
          ),
        });
      }
    });

    this.redoHistory();
    this.undoHistory();

    this.getCanvasObject();
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
    BoardApiService.updateById(this.props.match?.params.id as string, {
      ...this.state.canvas,
      data: data,
      createdUserId: Auth.getUser().id,
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
    const boardTitle = document.getElementById(
      'board-title',
    ) as HTMLSpanElement;
    BoardApiService.getById(this.props.match?.params.id as string).subscribe(
      boardData => {
        boardTitle.innerText = boardData.name;
        const boardObjects = !!boardData.data ? JSON.parse(boardData.data) : [];

        this.setState({
          objects: boardObjects,
          canvas: { orgId: boardData.orgId, name: boardData.name },
        });
      },
      error => {
        console.error(error);
      },
    );
  }

  handleSelect = (data: ObjectInterface) => {
    if (data.type === 'Sticky') {
      console.log('data', data);
      this.setState({
        selectedStickyData: { ...data },
      });
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
      <div className="canvas-view">
        <div className="canvas-editor">
          <div className="canvas-body">
            <Stage
              width={window.innerWidth * 1}
              height={(window.innerHeight - 80) * 1}
              className="canvas-body-content"
              ref={ref => (this.stageRef = ref)}
              scale={{
                x: 1,
                y: 1,
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
                        draggable={false}
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
                          draggable={false}
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
                          draggable={false}
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
                        draggable={false}
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
                        draggable={false}
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
                        draggable={false}
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
              </Layer>
            </Stage>
          </div>
          <div className="canvas-header">
            <div className="canvas-header-left">
              <div className="canvas-header-logo">
                <img src={logoImg} alt="logo" />
              </div>
              <div className="canvas-header-title" id="board-title">
                My Customer Journey
              </div>
              <div className="canvas-header-actions">
                <div className="canvas-header-action-item" id="undo-history">
                  <UndoIcon />
                </div>
                <div className="canvas-header-action-item" id="redo-history">
                  <RedoIcon />
                </div>
              </div>
            </div>
            <div className="canvas-header-right">
              <Dropdown.Button
                overlay={
                  <Menu>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                      1st menu item
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}>
                      2nd menu item
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UserOutlined />}>
                      3rd menu item
                    </Menu.Item>
                  </Menu>
                }
              >
                <span id="save-canvas">Publish</span>
              </Dropdown.Button>
            </div>
          </div>
        </div>
        {!!this.state.selectedStickyData && (
          <textarea
            ref={this.textAreaRef}
            style={{
              ...this.state.selectedStickyData.textData,
              position: 'absolute',
              top: this.state.selectedStickyData?.y + 40,
              left: this.state.selectedStickyData?.x,
              width: this.state.selectedStickyData.sticky?.width,
              maxHeight: this.state.selectedStickyData.sticky?.height,
              resize: 'none',
              color: '#ffffff',
              background: this.state.selectedStickyData?.shapeConfig?.fill,
              borderRadius: this.state.selectedStickyData?.sticky?.cornerRadius,
              padding: '15px 0',
              outline: 'none',
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && this.state.selectedStickyData) {
                this.updateObjectText(this.state.selectedStickyData.id, {
                  ...this.state.selectedStickyData.textData,
                  text: this.textAreaRef.current?.value,
                });
                this.setState({
                  selectedStickyData: null,
                });
              }
            }}
            // className="canvas-text-editor"
            id="canvas-text-editor"
            contentEditable="true"
            defaultValue={this.state.selectedStickyData.textData?.text}
          ></textarea>
        )}
      </div>
    );
  }
}
