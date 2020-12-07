import React, { useState } from 'react';
import { MessagesApiService } from 'services/APIService/MessagesApi.service';

interface IState {
  orgId?: any;
}

export const ChatFooter = ({ boardId, user, setChatMessages }) => {
  const [message, setMessage] = useState('');
  const handleSubmit = evt => {
    evt.preventDefault();
    MessagesApiService.postMessage(message, boardId).subscribe(data => {
      setMessage('');
    });
    let newMessage = { message: message, sender: user };
    setChatMessages(prevState => ({
      ...prevState,
      messages: [...prevState.messages, newMessage],
    }));
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
