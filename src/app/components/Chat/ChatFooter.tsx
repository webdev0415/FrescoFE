import React from 'react';

interface IState {
  orgId?: any;
}

export const ChatFooter = () => {
  return (
    <div className="chatBox-footer">
      <form>
        <input type="text" placeholder="Write a message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
