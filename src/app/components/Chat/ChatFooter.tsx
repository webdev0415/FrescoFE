import React, { useState } from 'react';
import { MessagesApiService } from 'services/APIService/MessagesApi.service';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

interface IState {
  orgId?: any;
}

export const ChatFooter = ({ boardId, user, setChatMessages, scroll }) => {
  const [message, setMessage] = useState('');
  const handleSubmit = evt => {
    evt.preventDefault();
    if (message != '') {
      MessagesApiService.postMessage(message, boardId).subscribe(data => {
        setMessage('');
      });
      let newMessage = {
        message: message,
        sender: user,
        id: uuidv4(),
        createdgitAt: moment(),
      };
      setChatMessages(prevState => {
        console.log([...prevState.messages, newMessage], '===');
        return {
          ...prevState,
          messages: [newMessage, ...prevState.messages],
        };
      });
      const heightBeforeRender = scroll.scrollHeight;

      setTimeout(() => {
        if (scroll) {
          scroll.scrollTop = scroll.scrollHeight + heightBeforeRender;
        }
      }, 120);
    }
  };
  return (
    <div className="chatBox-footer">
      <form onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          type="text"
          placeholder="Write a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
