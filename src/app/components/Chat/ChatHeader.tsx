import React from 'react';
import chatHeaderIcon from 'assets/icons/chat-header.svg';
import { ChatIcon, CloseIcon } from '../../../assets/icons';

interface IState {
  orgId?: any;
}

interface ChatHeaderProps {
  hide();
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ hide }) => {
  return (
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
          onClick={() => hide()}
          className="chatBox-header-close"
        >
          <CloseIcon className="icon-default" />
        </button>
      </div>
    </div>
  );
};
