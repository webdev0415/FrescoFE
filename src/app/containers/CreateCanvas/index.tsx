import React, { memo } from 'react';
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
export const CreateCanvas = memo(() => {
  return (
    <div className="canvas-view">
      <div className="canvas-editor">
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

        <div className="canvas-text-toolbar">
          <div className="canvas-text-toolbar-item">
            <Select
              defaultValue="lucy"
              style={{ width: 120, paddingLeft: '10px' }}
            >
              <Select.Option value="jack">Jack</Select.Option>
              <Select.Option value="lucy">Lucy</Select.Option>
              <Select.Option value="disabled" disabled>
                Disabled
              </Select.Option>
            </Select>
          </div>
          <div className="canvas-text-toolbar-item action-button">
            <img src={chevronDownIcon} alt="selection" />
          </div>
          <div className="canvas-text-toolbar-item action-button">
            <img src={toolbarMinusIcon} alt="selection" />
          </div>
          <div className="canvas-text-toolbar-item">12</div>
          <div className="canvas-text-toolbar-item action-button">
            <img src={toolbarPlusIcon} alt="selection" />
          </div>
          <div className="canvas-text-toolbar-item action-button">
            <img src={toolbarTextAlignmentIcon} alt="selection" />
          </div>
          <div className="canvas-text-toolbar-item action-button">
            <img src={toolbarTextBoldIcon} alt="selection" />
          </div>
          <div className="canvas-text-toolbar-item action-button">
            <img src={toolbarTextUnderlineIcon} alt="selection" />
          </div>
          <div className="canvas-text-toolbar-item">
            <img src={toolbarVerticalLineIcon} alt="selection" />
          </div>
          <div className="canvas-text-toolbar-item action-button">
            <img src={toolbarMoreIcon} alt="selection" />
          </div>
        </div>

        <div className="canvas-toolbar">
          <div className="canvas-toolbar-item">
            <img src={canvasToolbarSelectionIcon} alt="selection" />
          </div>
          <div className="canvas-toolbar-item">
            <img src={canvasToolbarSelectionIcon} alt="selection" />
          </div>
          <div className="canvas-toolbar-item">
            <img src={toolbarShapeIcon} alt="selection" />
          </div>
          <div className="canvas-toolbar-item">
            <img src={cursorIcon} alt="selection" />
          </div>
        </div>
        <div className="canvas-footer">
          <div className="canvas-footer-actions">
            <div className="canvas-footer-action-item">
              <img src={zoomInIcon} alt="selection" />
            </div>
            <div className="canvas-footer-action-slider">
              <Slider defaultValue={30} />
            </div>
            <div className="canvas-footer-action-item">
              <img src={zoomOutIcon} alt="selection" />
            </div>
            <div className="canvas-footer-action-item">100%</div>
          </div>
        </div>
      </div>
    </div>
  );
});
