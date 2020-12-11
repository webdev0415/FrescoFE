import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
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
  const messagesGroupDuration = 120; //seconds
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
      const heightBeforeRender = scroll.scrollHeight;
      setTimeout(() => {
        if (scroll) {
          scroll.scrollTop = scroll.scrollHeight + heightBeforeRender;
        }
      }, 120);
    }
  }, [scroll, messages, messagesArr.length]);

  const handleScroll = ({ target }) => {
    if (scroll?.scrollTop === 0) {
      setMessagesLimit(messagesLimit + 10);
      setMessagesOffset(messagesOffset + 20);
      scroll.scrollTop = target.clientHeight / 3;
    }
  };

  if (Array.isArray(user)) {
    return null;
  }

  const sortMessagesByGroups = messages => {
    let groups: any[] = [];

    messages.forEach((message, index) => {
      if (index) {
        const createdStamp = moment(message.createdAt).valueOf();
        const lastGroup = groups[groups.length - 1];

        const inDuration =
          createdStamp >= lastGroup.startStamp &&
          createdStamp <= lastGroup.endStamp;
        const sameUser = lastGroup.user.id === message.sender.id;

        if (inDuration && sameUser) {
          groups[groups.length - 1].messages.push(message);
        } else {
          groups.push({
            user: message.sender,
            startStamp: moment(message.createdAt).valueOf(),
            endStamp: moment(message.createdAt)
              .add(messagesGroupDuration, 'seconds')
              .valueOf(),
            messages: [message],
          });
        }
      } else {
        groups.push({
          user: message.sender,
          startStamp: moment(message.createdAt).valueOf(),
          endStamp: moment(message.createdAt)
            .add(messagesGroupDuration, 'seconds')
            .valueOf(),
          messages: [message],
        });
      }
    });
    return groups;
  };

  return (
    <div
      className="chatBox-body"
      onScroll={handleScroll}
      ref={scroller => {
        setScroll(scroller);
      }}
    >
      {sortMessagesByGroups(messagesArr || []).map((group, index) => {
        const loggedUserMessageGroup =
          group.user.id === user.id ? 'logged-user' : '';

        return (
          <>
            <div className={`chatBox-body-user ${loggedUserMessageGroup}`}>
              <img src={chatUser} alt="avatar" />
              <span>{group.user.name || group.user.email}</span>
            </div>
            {group.messages.map(message => (
              <ChatMessage
                key={`${message.id}-${index}`}
                message={message}
                logedUser={loggedUserMessageGroup}
                setChatMessages={setChatMessages}
                boardId={boardId}
              />
            ))}
          </>
        );
      })}
    </div>
  );
};
