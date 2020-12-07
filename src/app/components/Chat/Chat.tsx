import React, { useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import './Chat.less';
import { ChatBody } from './ChatBody';
import { ChatFooter } from './ChatFooter';

interface IState {
  orgId?: any;
}

export const Chat = ({
  open,
  hide,
  messages,
  boardId,
  setChatMessages,
  user,
}) => {
  return (
    <div className={`chatBox ${open ? 'active' : ''}`}>
      <ChatHeader hide={hide} />
      <ChatBody
        setChatMessages={setChatMessages}
        user={user}
        messages={messages}
      />
      <ChatFooter
        boardId={boardId}
        setChatMessages={setChatMessages}
        user={user}
      />
    </div>
  );
};
