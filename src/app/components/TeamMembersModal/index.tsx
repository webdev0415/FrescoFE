import React, { Fragment } from 'react';
import { Modal, List, Avatar, Skeleton } from 'antd';

import Text from 'antd/lib/typography/Text';

export const TeamMembersModal = ({ onCancel, loading }) => {
  const initList = [
    {
      name: 'Abe Bazan',
      avatar:
        'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      email: 'abe@gmail.com',
      aboutme:
        "UX Designer. Star Wars fan. Basically I'm a geek pasionated about design hahaha",
      loading: false,
    },
    {
      name: 'Paul Van Zandt',
      avatar:
        'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      email: 'paul@gmail.com',
      aboutme:
        "UX Designer. Star Wars fan. Basically I'm a geek pasionated about design hahaha",
      loading: false,
    },
    {
      name: 'Hovhannes Zhamharyan',
      avatar: undefined,
      email: 'hovhannes@gmail.com',
      aboutme:
        "UX Designer. Star Wars fan. Basically I'm a geek pasionated about design hahaha",
      loading: false,
    },
    {
      name: 'Yuri Cheng',
      avatar: undefined,
      email: 'yuri@gmail.com',
      aboutme:
        "UX Designer. Star Wars fan. Basically I'm a geek pasionated about design hahaha",
      loading: false,
    },
  ];
  const [membersList, setMembersList] = React.useState(initList);
  const handleOnCancel = () => {
    onCancel();
  };

  return (
    <Fragment>
      <Modal visible={true} footer={null} onCancel={() => handleOnCancel()}>
        <div style={{ width: '90%', margin: 'auto' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Team Members</p>

          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={membersList}
            renderItem={item => (
              <List.Item
                actions={[<a key="list-loadmore-edit">View Profile</a>]}
              >
                <Skeleton avatar title={false} loading={item.loading}>
                  <List.Item.Meta
                    avatar={
                      item.avatar ? (
                        <Avatar src={item.avatar} />
                      ) : (
                        <Avatar
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            border: '1px solid #cbc8c8',
                          }}
                        >
                          <Text
                            style={{ color: '#9646f5', fontWeight: 'bold' }}
                          >
                            {item?.name
                              ?.split(' ')
                              .map(n => n[0])
                              .join('')}
                          </Text>
                        </Avatar>
                      )
                    }
                    title={item.name}
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </Fragment>
  );
};
