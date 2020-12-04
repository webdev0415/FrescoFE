import React from 'react';
import { ChatMessage } from './Chat-Message';
import chatUser from 'assets/icons/chat-user.svg';
import { message } from 'antd';

interface IState {
  orgId?: any;
}

export const ChatBody = ({ messages }) => {
  return (
    <div className="chatBox-body">
      {messages.map((message, index) => {
        return (
          <ChatMessage
            key={index}
            userName={'Jose'}
            userImg={chatUser}
            message={message.message}
            logedUser={'friend'}
          />
        );
      })}
    </div>
  );
};
