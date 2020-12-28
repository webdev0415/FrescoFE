import React, { memo } from 'react';
import { ChatIcon, CloseIcon } from '../../../assets/icons/icons-component';

interface Props {
  hide();
}

export const ChatHeader = memo(
  (props: Props): JSX.Element => {
    return (
      <>
        <div className="chatBox-header">
          <div
            className="d-flex"
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <ChatIcon />
            <span className="chatBox-header-title">Live Chat</span>
          </div>
          <div>
            <button
              role="button"
              onClick={() => props.hide()}
              className="chatBox-header-close"
            >
              <CloseIcon className="icon-default" />
            </button>
          </div>
        </div>
      </>
    );
  },
);
