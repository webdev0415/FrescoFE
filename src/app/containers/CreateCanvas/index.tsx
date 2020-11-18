import React, { memo, useEffect, useState } from 'react';
import { RouteChildrenProps } from 'react-router';
import logoImg from 'assets/icons/logo-color.svg';

import { Dropdown, Input, Menu, Slider, Switch } from 'antd';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { DrawCanvas } from '../../components/DrawCanvas';
import {
  CircleShapeIcon,
  CursorIcon,
  RectangleShapeIcon,
  RedoIcon,
  RoundedRectangleShapeIcon,
  ShapesIcon,
  StarShapeIcon,
  StickyNoteIcon,
  TextIcon,
  TriangleShapeIcon,
  UndoIcon,
  VerticalLineIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from '../../components/CanvasIcons';
import clsx from 'clsx';
import pageIcon from '../../../assets/icons/page.svg';
import { useHistory } from 'react-router-dom';

export const CreateCanvas = memo(
  (props: RouteChildrenProps<{ id: string; type: string }>) => {
    const [zoom, setZoom] = useState<number>(0);
    const [drawingTool, setDrawingTool] = useState<
      | 'Rect'
      | 'RectRounded'
      | 'Triangle'
      | 'Ellipse'
      | 'Star'
      | 'Text'
      | 'Sticky'
      | 'Line'
      | null
    >(null);
    const [showSubTools, setShowSubTools] = useState<string>('');
    const history = useHistory();
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
            zoomLevel={zoom / 100 + 1}
            {...props}
          />
          <div className="canvas-header">
            <div className="canvas-header-left">
              <div className="canvas-header-logo">
                <img src={logoImg} alt="logo" />
              </div>
              <div className="canvas-header-title" id="canvas-title">
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
                trigger={['click']}
                overlay={
                  <Menu className="canvas-dropdown">
                    <div className="dropdown-item">
                      <CheckOutlined /> Published
                    </div>
                    <div className="dropdown-item">
                      <img src={pageIcon} alt="page" /> Publish & Create Canvas
                    </div>
                    <div className="switch-item">
                      Public URL <Switch defaultChecked />
                    </div>
                    <div className="input-item">
                      <Input
                        addonAfter={<CopyOutlined />}
                        defaultValue="https://example.org"
                      />
                    </div>
                  </Menu>
                }
              >
                <span
                  id="save-canvas"
                  onClick={() => {
                    // window.history.back();
                  }}
                >
                  Publish
                </span>
              </Dropdown.Button>
            </div>
          </div>

          <div className="canvas-toolbar" id="canvas-toolbar">
            <div
              className={clsx(
                'canvas-toolbar-item',
                drawingTool === 'Sticky' && 'active',
              )}
              onClick={() => {
                setDrawingTool('Sticky');
                setShowSubTools('');
              }}
            >
              <StickyNoteIcon />
              {/*<img src={canvasToolbarSelectionIcon} alt="selection" />*/}
            </div>
            <div
              className={clsx(
                'canvas-toolbar-item',
                drawingTool === 'Text' && 'active',
              )}
              onClick={() => {
                setDrawingTool('Text');
                setShowSubTools('');
              }}
            >
              <TextIcon />
            </div>
            <div
              className={clsx(
                'canvas-toolbar-item',
                ['Rect', 'Circle', 'Triangle', 'RectRounded', 'Star'].includes(
                  drawingTool as string,
                ) && 'active',
              )}
              onClick={() => {
                setShowSubTools('shapes');
              }}
            >
              <span>
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
                  onClick={event => {
                    event.stopPropagation();
                    setDrawingTool('Rect');
                    setShowSubTools('');
                  }}
                >
                  <RectangleShapeIcon />
                </div>
                <div
                  className="canvas-sub-toolbar-item"
                  onClick={event => {
                    event.stopPropagation();
                    setDrawingTool('Ellipse');
                    setShowSubTools('');
                  }}
                >
                  <CircleShapeIcon />
                </div>
                <div
                  className="canvas-sub-toolbar-item"
                  onClick={event => {
                    event.stopPropagation();
                    setDrawingTool('Triangle');
                    setShowSubTools('');
                  }}
                >
                  <TriangleShapeIcon />
                </div>
                <div
                  className="canvas-sub-toolbar-item"
                  onClick={event => {
                    event.stopPropagation();
                    setDrawingTool('RectRounded');
                    setShowSubTools('');
                  }}
                >
                  <RoundedRectangleShapeIcon />
                </div>

                <div
                  className="canvas-sub-toolbar-item"
                  onClick={event => {
                    event.stopPropagation();
                    setDrawingTool('Star');
                    setShowSubTools('');
                  }}
                >
                  <StarShapeIcon />
                </div>

                <div
                  className="canvas-sub-toolbar-item"
                  onClick={event => {
                    event.stopPropagation();
                    setDrawingTool('Line');
                    setShowSubTools('');
                  }}
                >
                  <VerticalLineIcon />
                </div>
              </div>
            </div>
            <div
              className={clsx('canvas-toolbar-item', !drawingTool && 'active')}
              onClick={() => {
                setDrawingTool(null);
                setShowSubTools('');
              }}
            >
              <CursorIcon />
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
  },
);
