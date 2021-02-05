import React from 'react';
import { ChatHeader } from './ChatHeader';
import './Chat.less';
import ChatBody from './ChatBody';
import { ChatFooter } from './ChatFooter';

export const Chat = ({
  open,
  hide,
  messages,
  messagesOnLoad,
  boardId,
  setChatMessages,
  user,
  setMessagesOffset,
  messagesOffset,
  socketIoClient,
  newMessagesBucket,
  loadingMessages,
}) => {
  const [scroll, setScroll] = React.useState<null | HTMLElement>(null);
  return (
    <div className={`chatBox ${open ? 'active' : ''}`}>
      <ChatHeader hide={hide} />
      <ChatBody
        setChatMessages={setChatMessages}
        user={user}
        socketIoClient={socketIoClient}
        messages={messages}
        messagesOnLoad={messagesOnLoad}
        boardId={boardId}
        setMessagesOffset={setMessagesOffset}
        messagesOffset={messagesOffset}
        scroll={scroll}
        open={open}
        setScroll={setScroll}
        newMessagesBucket={newMessagesBucket}
        loadingMessages={loadingMessages}
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
