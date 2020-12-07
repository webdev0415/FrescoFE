import React from 'react';
import { ChatMessage } from './Chat-Message';
import chatUser from 'assets/icons/chat-user.svg';

interface IState {
  orgId?: any;
}

export const ChatBody = ({ messages, user, setChatMessages }) => {
  console.log('sdjfkljdslfsf', messages);
  let logedUser = 'friend';
  return (
    <div className="chatBox-body">
      {messages.messages ? (
        messages.messages.map((message, index) => {
          if (message.sender.id == user.id) {
            logedUser = 'loged-user';
          }
          return (
            <ChatMessage
              key={index}
              userName={message.sender.name}
              userImg={chatUser}
              message={message}
              logedUser={logedUser}
              setChatMessages={setChatMessages}
            />
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};
