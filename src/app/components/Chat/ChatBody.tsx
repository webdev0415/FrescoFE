import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './Chat-Message';
import chatUser from 'assets/icons/chat-user.svg';
import moment from 'moment';

interface IState {
  orgId?: any;
}

export const ChatBody = ({
  messages,
  user,
  setChatMessages,
  boardId,
  setMessagesOffset,
  setMessagesLimit,
  messagesLimit,
  messagesOffset,
  scroll,
  setScroll,
}) => {
  const messagesGroup = 120; //seconds
  let logedUser = 'friend';
  let messagesArr = [...(messages?.messages || [])];

  messagesArr?.reverse();

  const messagesRef = useRef<null | HTMLElement>(null);
  const scrollToBottom = () => {
    messagesRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    console.log('messages.length', messagesArr.length);
    if (scroll && messages && messagesArr.length <= 25) {
      // 35 items
      const heightBeforeRender = scroll.scrollHeight;
      // wait for 70 items to render
      setTimeout(() => {
        if (scroll) {
          scroll.scrollTop = scroll.scrollHeight + heightBeforeRender;
        }
      }, 120);
    }
  }, [scroll, messages, messagesArr.length]);

  const handleScroll = heightBeforeRender => {
    // console.log(scroll?.scrollTop);
    if (scroll?.scrollTop === 0) {
      setMessagesLimit(messagesLimit + 10);
      setMessagesOffset(messagesOffset + 20);
      scroll.scrollTop = heightBeforeRender;
      console.log('messages limit', messagesLimit);
      console.log('messagesOffset', messagesOffset);
    }

    if (
      scroll &&
      scroll.scrollTop < 100 &&
      // state.hasMoreItems &&
      messages.length >= 35
    ) {
      // fetchMore({
      //   variables: {
      //     channelId,
      //     cursor: messages[messages.length - 1].created_at,
      //   },
      //   updateQuery: (previousResult, { fetchMoreResult }) => {
      //     if (!fetchMoreResult) {
      //       return previousResult;
      //     }
      //     // if (fetchMoreResult.messages.length < 35) {
      //     //   setState({ hasMoreItems: false });
      //     // }
      //     return {
      //       ...previousResult,
      //       messages: [...previousResult.messages, ...fetchMoreResult.messages],
      //     };
      //   },
      // });
    }
  };

  return (
    <div
      className="chatBox-body"
      onScroll={handleScroll}
      ref={scroller => {
        setScroll(scroller);
      }}
    >
      {/* {msgs} */}
      {messagesArr ? (
        messagesArr.map((message, index) => {
          let msgDate = moment(message.createdAt);

          let now = moment();

          let prevMsgDate = messagesArr[index - 1]?.createdAt;

          let diff = msgDate.diff(prevMsgDate, 'minutes');

          if (message.sender.id === user.id) {
            logedUser = 'loged-user';
          }

          return (
            <ChatMessage
              key={message.id}
              userName={message.sender.name}
              userImg={chatUser}
              message={message}
              logedUser={logedUser}
              setChatMessages={setChatMessages}
              boardId={boardId}
              sameUser={
                message?.sender?.id === messagesArr[index - 1]?.sender?.id &&
                diff <= 2
              }
            />
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};
