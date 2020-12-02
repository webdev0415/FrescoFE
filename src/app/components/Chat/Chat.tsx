import React from 'react';
import { ChatHeader } from './ChatHeader';
import './Chat.less';
import { ChatBody } from './ChatBody';
import { ChatFooter } from './ChatFooter';

interface IState {
  orgId?: any;
}

export const Chat = ({ open, hide }) => {
  return (
    <div className={`chatBox ${open ? 'active' : ''}`}>
      <ChatHeader hide={hide} />
      <ChatBody />
      <ChatFooter />
    </div>
  );
};
