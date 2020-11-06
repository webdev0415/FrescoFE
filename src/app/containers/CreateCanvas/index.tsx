import React, { memo, useEffect, useState } from 'react';
import logoImg from 'assets/icons/logo-color.svg';

import { Dropdown, Menu, Slider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { DrawCanvas } from '../../components/DrawCanvas';
import {
  TextIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RedoIcon,
  UndoIcon,
  CursorIcon,
  ShapesIcon,
  StickyNoteIcon,
  StarShapeIcon,
  RectangleShapeIcon,
  RoundedRectangleShapeIcon,
  TriangleShapeIcon,
  CircleShapeIcon,
} from '../../components/CanvasIcons';
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
        <DrawCanvas
          className="canvas-body"
          drawingTool={drawingTool}
          zoomLevel={zoom / 10 + 1}
        />
        <div className="canvas-header">
          <div className="canvas-header-left">
            <div className="canvas-header-logo">
              <img src={logoImg} alt="logo" />
            </div>
            <div className="canvas-header-title">My Customer Journey</div>
            <div className="canvas-header-actions">
              <div className="canvas-header-action-item">
                <UndoIcon />
              </div>
              <div className="canvas-header-action-item">
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
            <StickyNoteIcon
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
            <TextIcon
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
            <span
              onClick={() => {
                setShowSubTools('shapes');
              }}
            >
              <ShapesIcon />
            </span>

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
                <RectangleShapeIcon />
              </div>
              <div
                className="canvas-sub-toolbar-item"
                onClick={() => {
                  setDrawingTool('Circle');
                  setShowSubTools('');
                }}
              >
                <CircleShapeIcon />
              </div>
              <div
                className="canvas-sub-toolbar-item"
                onClick={() => {
                  setDrawingTool('Triangle');
                  setShowSubTools('');
                }}
              >
                <TriangleShapeIcon />
              </div>
              <div
                className="canvas-sub-toolbar-item"
                onClick={() => {
                  setDrawingTool('RectRounded');
                  setShowSubTools('');
                }}
              >
                <RoundedRectangleShapeIcon />
              </div>

              <div
                className="canvas-sub-toolbar-item"
                onClick={() => {
                  setDrawingTool('Star');
                  setShowSubTools('');
                }}
              >
                <StarShapeIcon />
              </div>
            </div>
          </div>
          <div
            className={clsx(
              'canvas-toolbar-item',
              drawingTool === 'Drag' && 'active',
            )}
          >
            <CursorIcon
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
              <ZoomOutIcon />
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
              <ZoomInIcon />
            </div>
            <div className="canvas-footer-action-text">{zoom}%</div>
          </div>
        </div>
      </div>
    </div>
  );
});
