import React, { memo } from 'react';
import canvasToolbarSelectionIcon from 'assets/icons/canvas-toolbar-selection.svg';

export const CreateCanvas = memo(() => {
  return (
    <div className="canvas-view">
      <div className="canvas-editor">
        <div className="canvas-header">
          <div className="canvas-header-left">s</div>
          <div className="canvas-header-right">s</div>
        </div>
        <div className="canvas-toolbar">
          <div className="canvas-toolbar-item">
            <img src={canvasToolbarSelectionIcon} alt="selection" />
          </div>
          <div className="canvas-toolbar-item">
            <img src={canvasToolbarSelectionIcon} alt="selection" />
          </div>
          <div className="canvas-toolbar-item">
            <img src={canvasToolbarSelectionIcon} alt="selection" />
          </div>
          <div className="canvas-toolbar-item">
            <img src={canvasToolbarSelectionIcon} alt="selection" />
          </div>
        </div>
      </div>
    </div>
  );
});
