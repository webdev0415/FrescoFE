import React, { memo, useEffect, useState } from 'react';
import canvasToolbarSelectionIcon from 'assets/icons/canvas-toolbar-selection.svg';
import toolbarShapeIcon from 'assets/icons/toolbar-shape.svg';
import cursorIcon from 'assets/icons/cursor.svg';
import logoImg from 'assets/icons/logo-color.svg';
import undoIcon from 'assets/icons/undo.svg';
import redoIcon from 'assets/icons/redo.svg';
import zoomInIcon from 'assets/icons/zoom-in.svg';
import zoomOutIcon from 'assets/icons/zoom-out.svg';
import chevronDownIcon from 'assets/icons/chevron-down.svg';
import toolbarMinusIcon from 'assets/icons/toolbar-minus.svg';
import toolbarPlusIcon from 'assets/icons/toolbar-plus.svg';
import toolbarTextAlignmentIcon from 'assets/icons/toolbar-text-alignment.svg';
import toolbarTextBoldIcon from 'assets/icons/toolbar-text-bold.svg';
import toolbarTextUnderlineIcon from 'assets/icons/toolbar-text-underline.svg';
import toolbarVerticalLineIcon from 'assets/icons/toolbar-vertical-line.svg';
import toolbarMoreIcon from 'assets/icons/toolbar-more.svg';

import { Dropdown, Menu, Select, Slider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { DrawCanvas } from '../../components/DrawCanvas';
import { TextIcon } from '../../components/CanvasIcons';
import clsx from 'clsx';

export const CreateCanvas = memo(() => {
  const [zoom, setZoom] = useState<number>(0);
  const [drawingTool, setDrawingTool] = useState<
    | 'Rect'
    | 'RectRounded'
    | 'Triangle'
    | 'Circle'
    | 'Star'
    | 'Drag'
    | 'Text'
    | 'Sticky'
    | null
  >(null);
  const [showSubTools, setShowSubTools] = useState<string>('');
  useEffect(() => {
    document.addEventListener('click', event => {
      const target = event.target as Node;
      const toolbar = document.getElementById(
        'canvas-toolbar',
      ) as HTMLDivElement;
      if (toolbar) {
        if (!toolbar.contains(target)) {
          setShowSubTools('');
        }
      }
    });
  }, []);
  return (
    <div className="canvas-view">
      <div className="canvas-editor">
        <DrawCanvas className="canvas-body" drawingTool={drawingTool} />
        <div className="canvas-header">
          <div className="canvas-header-left">
            <div className="canvas-header-logo">
              <img src={logoImg} alt="logo" />
            </div>
            <div className="canvas-header-title">My Customer Journey</div>
            <div className="canvas-header-actions">
              <div className="canvas-header-action-item">
                <img src={undoIcon} alt="logo" />
              </div>
              <div className="canvas-header-action-item">
                <img src={redoIcon} alt="logo" />
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
              Dropdown
            </Dropdown.Button>
          </div>
        </div>

        <div className="canvas-toolbar" id="canvas-toolbar">
          <div
            className={clsx(
              'canvas-toolbar-item',
              drawingTool === 'Sticky' && 'active',
            )}
          >
            <TextIcon
              onClick={() => {
                setDrawingTool('Sticky');
                setShowSubTools('');
              }}
            />
            {/*<img src={canvasToolbarSelectionIcon} alt="selection" />*/}
          </div>
          <div
            className={clsx(
              'canvas-toolbar-item',
              drawingTool === 'Text' && 'active',
            )}
          >
            <img
              src={canvasToolbarSelectionIcon}
              alt="selection"
              onClick={() => {
                setDrawingTool('Text');
                setShowSubTools('');
              }}
            />
          </div>
          <div
            className={clsx(
              'canvas-toolbar-item',
              ['Rect', 'Circle', 'Triangle', 'RectRounded', 'Star'].includes(
                drawingTool as string,
              ) && 'active',
            )}
          >
            <img
              src={toolbarShapeIcon}
              alt="selection"
              onClick={() => {
                setShowSubTools('shapes');
              }}
            />
            <div
              className="canvas-sub-toolbar"
              style={{
                display: showSubTools === 'shapes' ? 'flex' : 'none',
              }}
            >
              <div
                className="canvas-sub-toolbar-item"
                onClick={() => {
                  setDrawingTool('Rect');
                  setShowSubTools('');
                }}
              >
                <span className="material-icons">check_box_outline_blank</span>
              </div>
              <div
                className="canvas-sub-toolbar-item"
                onClick={() => {
                  setDrawingTool('Circle');
                  setShowSubTools('');
                }}
              >
                <span className="material-icons">radio_button_unchecked</span>
              </div>
              <div
                className="canvas-sub-toolbar-item"
                onClick={() => {
                  setDrawingTool('Triangle');
                  setShowSubTools('');
                }}
              >
                <span className="material-icons">change_history</span>
              </div>
              <div
                className="canvas-sub-toolbar-item"
                onClick={() => {
                  setDrawingTool('RectRounded');
                  setShowSubTools('');
                }}
              >
                <span className="material-icons">crop_din</span>
              </div>

              <div
                className="canvas-sub-toolbar-item"
                onClick={() => {
                  setDrawingTool('Star');
                  setShowSubTools('');
                }}
              >
                <span className="material-icons">star_outline</span>
              </div>
            </div>
          </div>
          <div
            className={clsx(
              'canvas-toolbar-item',
              drawingTool === 'Drag' && 'active',
            )}
          >
            <img
              src={cursorIcon}
              alt="selection"
              onClick={() => {
                setDrawingTool('Drag');
                setShowSubTools('');
              }}
            />
          </div>
        </div>
        <div className="canvas-footer">
          <div className="canvas-footer-actions">
            <div
              className="canvas-footer-action-item"
              onClick={() => {
                if (zoom !== 0) {
                  setZoom(Math.max(zoom - 25, 0));
                }
              }}
            >
              <img src={zoomOutIcon} alt="selection" />
            </div>
            <div className="canvas-footer-action-slider">
              <Slider
                value={zoom}
                onChange={event => {
                  setZoom(event);
                }}
              />
            </div>
            <div
              className="canvas-footer-action-item"
              onClick={() => {
                if (zoom !== 100) {
                  setZoom(Math.min(zoom + 25, 100));
                }
              }}
            >
              <img src={zoomInIcon} alt="selection" />
            </div>
            <div className="canvas-footer-action-text">{zoom}%</div>
          </div>
        </div>
      </div>
    </div>
  );
});
