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
  loadingMessages,
}) => {
  const messagesGroupDuration = 120;
  let messagesArr = [...(messages?.messages || [])];
  const heightBeforeRender = scroll?.scrollHeight;

  messagesArr?.reverse();
  const messagesRef = useRef<null | HTMLElement>(null);
  const [scrollToBottomIcon, setScrollToBottomIcon] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const scrollToBottom = () => {
    messagesRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const { id: orgId } = useParams<any>();

  useEffect(() => {
    if (messagesOnLoad == true) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [messagesOnLoad]);

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

  // useEffect(() => {
  //   if (scroll) {
  //     if (scroll.scrollHeight - scroll.scrollTop > scroll.offsetHeight + 50) {
  //       setScrollToBottomIcon('active');
  //     }
  //   }
  // }, [newMessageIcon]);

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
      scroll.scrollTop = scroll.scrollHeight + heightBeforeRender;
    }
    setScrollToBottomIcon('');
  };

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
      <div className={`lds-ellipsis ${messagesOnLoad ? 'active' : ''} `}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={`chatBox-body-new-message ${scrollToBottomIcon}`}>
        <button onClick={() => handleToBottom()}>
          <img src={chatArrow} />
        </button>
      </div>
      {sortMessagesByGroups(messagesArr || []).map((group, index) => {
        const loggedUserMessageGroup =
          group.user.id === user.id ? 'logged-user' : '';
        return (
          <div key={`${index}-${uuidv4()}`}>
            <div
              className={`chatBox-body-user ${
                messagesOnLoad ? 'onload' : ''
              } ${loggedUserMessageGroup}`}
            >
              <img src={chatUser} alt="avatar" />
              <p className="user-block">
                {' '}
                <span>
                  {group.user.firstName} {group.user.lastName}
                </span>{' '}
                <span className="chatBox-body-user-time">
                  {' '}
                  {moment(group.messages[0].createdAt).format('HH:MM')}{' '}
                </span>
              </p>
            </div>
            {group.messages.map((message, index) => (
              <ChatMessage
                key={`${message.id}-${index}-${uuidv4()}`}
                message={message}
                logedUser={loggedUserMessageGroup}
                setChatMessages={setChatMessages}
                boardId={boardId}
                time={message.createdAt}
                messagesOnLoad={messagesOnLoad}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ChatBody;
