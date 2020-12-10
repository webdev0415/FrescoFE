import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import chatUser from 'assets/icons/chat-user.svg';
import moment from 'moment';
import { useParams } from 'react-router-dom';

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
  socketIoClient,
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
  const { id: orgId } = useParams<any>();

  useEffect(() => {
    socketIoClient.on('connect', event => {
      socketIoClient.emit('joinBoard', orgId);
    });
  }, [orgId, socketIoClient]);

  useEffect(() => {
    if (!Array.isArray(user)) {
      socketIoClient.on('createMessage', data => {
        if (data.sender.id !== user.id) {
          setChatMessages(messages => {
            if (data.sender.id !== user.id) {
              return {
                ...messages,
                messages: [data, ...messages.messages],
              };
            }
            return messages;
          });
        }
      });

      socketIoClient.on('updateMessage', data =>
        setChatMessages(messages => {
          return {
            ...messages,
            messages: messages.messages.map(message => {
              if (message.id === data.id) {
                return data;
              }
              return message;
            }),
          };
        }),
      );

      socketIoClient.on('deleteMessage', data =>
        setChatMessages(messages => {
          return {
            ...messages,
            messages: messages.messages.filter(
              message => message.id !== data.id,
            ),
          };
        }),
      );
    }
  }, [setChatMessages, socketIoClient, user]);

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
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

  const handleScroll = ({ target }) => {
    // console.log(scroll?.scrollTop);
    if (scroll?.scrollTop === 0) {
      setMessagesLimit(messagesLimit + 10);
      setMessagesOffset(messagesOffset + 20);
      scroll.scrollTop = target.clientHeight / 3;
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

  if (Array.isArray(user)) {
    return null;
  }
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
              userName={message.sender.name || message.sender.email}
              userImg={chatUser}
              message={message}
              logedUser={logedUser}
              setChatMessages={setChatMessages}
              boardId={boardId}
              sameUser={message?.sender?.id === user.id}
            />
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};
