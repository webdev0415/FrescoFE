import React from 'react';
import { ChatMessage } from './Chat-Message';
import chatUser from 'assets/icons/chat-user.svg';

interface IState {
  orgId?: any;
}

export const ChatBody = () => {
  return (
    <div className="chatBox-body">
      <ChatMessage
        userName={'Jose'}
        userImg={chatUser}
        message="Hey team, let’s start with this! Can we focus our efforts of this
          session on choices?"
        logedUser={'friend'}
      />

      <ChatMessage
        userName={'Abe Baz (You)'}
        userImg={chatUser}
        message="Sure let’s do that"
        logedUser={'loged-user'}
      />

      <ChatMessage
        userName={'Jose'}
        userImg={chatUser}
        message="Hey team, let’s start with this! Can we focus our efforts of this
          session on choices?"
        logedUser={'friend'}
      />

      <ChatMessage
        userName={'Jose'}
        userImg={chatUser}
        message="Hey team, let’s start with this! Can we focus our efforts of this
          session on choices?"
        logedUser={'friend'}
      />

      <ChatMessage
        userName={'Abe Baz (You)'}
        userImg={chatUser}
        message="Sure let’s do that"
        logedUser={'loged-user'}
      />

      <ChatMessage
        userName={'Abe Baz (You)'}
        userImg={chatUser}
        message="Sure let’s do that"
        logedUser={'loged-user'}
      />
    </div>
  );
};
