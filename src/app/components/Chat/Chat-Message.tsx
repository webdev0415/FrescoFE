import React, { useState } from 'react';
import chatUser from 'assets/icons/chat-user.svg';
import { MessagesApiService } from 'services/APIService/MessagesApi.service';

interface IState {
  orgId?: any;
}

export const ChatMessage = ({
  userName,
  userImg,
  message,
  logedUser,
  setChatMessages,
}) => {
  const [msgSettings, setMsgSettings] = useState(false);
  const [msgEditable, setMsgEditable] = useState(false);

  const handleDropdown = () => {
    setMsgSettings(!msgSettings);
  };

  const deleteMessage = () => {
    MessagesApiService.deleteMessage(message).subscribe(data => {
      setChatMessages(prevState => ({
        ...prevState,
        messages: [...prevState.messages.filter(msg => msg.id !== message.id)],
      }));
      setMsgSettings(false);
    });
  };
  const editMessage = () => {
    setMsgEditable(!msgEditable);
    setMsgSettings(false);
  };

  let messageSettings;
  if (logedUser === 'loged-user') {
    messageSettings = (
      <div className="chatBox-message-settings">
        <span onClick={handleDropdown}>...</span>
        <div
          className={`chatBox-message-settings-dropdown ${
            msgSettings ? 'active' : ''
          } `}
        >
          <ul>
            <li>
              <button onClick={editMessage}>Edit</button>
            </li>
            <li>
              <button onClick={deleteMessage}>Delete</button>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={`chatBox-body-message ${logedUser}`}>
      <div className="chatBox-body-message-user">
        <img src={userImg} />
        <span>{userName}</span>
      </div>
      <div
        className={`chatBox-body-message-content ${
          msgEditable ? 'editable' : ''
        } `}
      >
        <p>{message.message}</p>
        <input type="text" value={message.message} />
      </div>
      {messageSettings}
    </div>
  );
};
