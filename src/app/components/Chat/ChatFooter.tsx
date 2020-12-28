import React, { useState } from 'react';
import { MessagesApiService } from 'services/APIService/MessagesApi.service';

interface IState {
  orgId?: any;
}

export const ChatFooter = ({ boardId, user, setChatMessages, scroll }) => {
  const [message, setMessage] = useState('');
  const handleSubmit = evt => {
    evt.preventDefault();
    if (message != '') {
      setMessage('');
      MessagesApiService.postMessage(message, boardId).subscribe(data => {
        setChatMessages(prevState => {
          return {
            ...prevState,
            messages: [data, ...prevState.messages],
          };
        });
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
          role="input-message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          type="text"
          placeholder="Write a message"
        />
        <button role="button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};
