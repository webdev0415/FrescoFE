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
  setMessagesOffset,
  setMessagesLimit,
  messagesLimit,
  messagesOffset,
}) => {
  const [scroll, setScroll] = React.useState<null | HTMLElement>(null);

  return (
    <div className={`chatBox ${open ? 'active' : ''}`}>
      <ChatHeader hide={hide} />
      <ChatBody
        setChatMessages={setChatMessages}
        user={user}
        messages={messages}
        boardId={boardId}
        setMessagesOffset={setMessagesOffset}
        setMessagesLimit={setMessagesLimit}
        messagesLimit={messagesLimit}
        messagesOffset={messagesOffset}
        scroll={scroll}
        setScroll={setScroll}
      />
      <ChatFooter
        boardId={boardId}
        setChatMessages={setChatMessages}
        user={user}
        scroll={scroll}
      />
    </div>
  );
};
