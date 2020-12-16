import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import chatUser from 'assets/icons/chat-user.svg';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import chatArrow from 'assets/icons/arrow.png';
import ScrollNumber from 'antd/lib/badge/ScrollNumber';


const ChatBody = ({
  messages,
  user,
  setChatMessages,
  boardId,
  setMessagesOffset,
  messagesOffset,
  scroll,
  socketIoClient,
  setScroll,
  open,
  messagesOnLoad,
  newMessagesBucket,
  setChatNotification,
  loadingMessages
}) => {

  const messagesGroupDuration = 120;
  let messagesArr = [...(messages?.messages || [])];
  const heightBeforeRender = scroll?.scrollHeight;

  messagesArr?.reverse();
  const messagesRef = useRef<null | HTMLElement>(null);
  const [scrollToBottomIcon, setScrollToBottomIcon] = React.useState('');
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
    if (scroll) {
      scroll.scrollTop = scroll.scrollHeight;
    }
  }, [open, scroll]);


  const getNewMessagesIcon = () => {
    if (scroll) {
      if (scroll.scrollHeight - scroll.scrollTop > (scroll.offsetHeight + 50)) {
        setScrollToBottomIcon('active');
      }
    }
  }

  useEffect(() => {
    if (!Array.isArray(user)) {
      socketIoClient.on('createMessage', data => {
        if (data.sender.id !== user.id) {
          setChatMessages(messages => {
            getNewMessagesIcon();
            if (!open) {
              setChatNotification(true)
            }
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
  }, [setChatMessages, socketIoClient, user, scroll, open]);

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

  const handleToBottom = () => {
    if (scroll) {
      scroll.scrollTop = scroll.scrollHeight + heightBeforeRender
    }
    setScrollToBottomIcon('');
    setChatNotification(false)
  }

  const handleScroll = ({ target }) => {



    if (target.scrollTop < 50 && !messagesOnLoad) {
      if (
        scroll?.scrollTop === 0 &&
        newMessagesBucket &&
        newMessagesBucket.length
      ) {
        setMessagesOffset(messagesOffset + 25);
        scroll.scrollTop = target.clientHeight / 3;
      }
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
      className={`chatBox-body`}
      onScroll={handleScroll}
      ref={scroller => setScroll(scroller)}
    >
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      <div className={`chatBox-body-new-message ${scrollToBottomIcon}`}>
        <button onClick={() => handleToBottom()}>
          <img src={chatArrow} />
        </button>
      </div>
      {sortMessagesByGroups(messagesArr || []).map((group, index) => {
        const loggedUserMessageGroup =
          group.user.id === user.id ? 'logged-user' : '';

        console.log('group', group)
        return (
          <div key={`${index}-${uuidv4()}`}>
            <div className={`chatBox-body-user ${loggedUserMessageGroup}`}>
              <img src={chatUser} alt="avatar" />
              <p className='user-block'> <span>{group.user.name || group.user.email}</span> <span className='chatBox-body-user-time'> {moment(group.messages[0].createdAt).format('HH:MM')} </span></p>
            </div>
            {group.messages.map((message, index) => (
              <ChatMessage
                key={`${message.id}-${index}-${uuidv4()}`}
                message={message}
                logedUser={loggedUserMessageGroup}
                setChatMessages={setChatMessages}
                boardId={boardId}
                time={message.createdAt}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ChatBody;
