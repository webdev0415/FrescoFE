import React, { useState } from 'react';
import { MessagesApiService } from 'services/APIService/MessagesApi.service';

interface IState {
  orgId?: any;
}

export const ChatMessage = ({
  message,
  logedUser,
  setChatMessages,
  boardId,
}) => {
  const [msgSettings, setMsgSettings] = useState(false);
  const [msgEditable, setMsgEditable] = useState(false);
  const [msg, setMsg] = useState(message.message);
  const [editableMessage, setEditableMessage] = useState(message.message);
  const messageId = message.id;

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

  const submitEdit = e => {
    e.preventDefault();
    MessagesApiService.editMessage(
      messageId,
      editableMessage,
      boardId,
    ).subscribe(data => {
      setMsg(data.message);
      setMsgEditable(!msgEditable);
    });
  };

  let messageSettings;
  if (logedUser) {
    messageSettings = (
      <div
        className={`chatBox-message-settings  ${msgEditable ? 'editable' : ''}`}
      >
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
              <button onClick={deleteMessage} className="delete">
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div className={`chatBox-body-message ${logedUser ? 'my' : ''}`}>
      <div
        className={`chatBox-body-message-content ${
          msgEditable ? 'editable' : ''
        } `}
      >
        <p>{msg}</p>
        <small></small>
        <form onSubmit={submitEdit}>
          <input
            type="text"
            value={editableMessage}
            onChange={e => setEditableMessage(e.target.value)}
          />
        </form>
      </div>
      {messageSettings}
    </div>
  );
};
