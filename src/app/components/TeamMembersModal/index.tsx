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
  const [selectedMemeber, setSelectMember] = React.useState<any>(null);
  const [
    isShowProfileDetailModal,
    setIsShowProfileDetailModal,
  ] = React.useState(false);

  const handleSelectTeamMember = (member: any) => {
    setSelectMember(member);
    setIsShowProfileDetailModal(true);
  };

  const handleOnCloseMembersListModal = () => {
    onCancel();
  };

  const handleOnCloseProfileDetailsModal = () => {
    setIsShowProfileDetailModal(false);
  };

  return (
    <Fragment>
      <Modal
        visible={true}
        footer={null}
        onCancel={() => handleOnCloseMembersListModal()}
      >
        <div style={{ width: '90%', margin: 'auto' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Team Members</p>

          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={membersList}
            renderItem={item => (
              <List.Item
                actions={[
                  <a
                    key="list-loadmore-edit"
                    onClick={() => handleSelectTeamMember(item)}
                  >
                    View Profile
                  </a>,
                ]}
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

      {selectedMemeber && (
        <Modal
          visible={isShowProfileDetailModal}
          footer={null}
          onCancel={() => handleOnCloseProfileDetailsModal()}
        >
          <div style={{ width: '90%', margin: 'auto' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Profile</p>

            <div
              className="avatar"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '50px',
              }}
            >
              {selectedMemeber.avatar ? (
                <Avatar
                  src={selectedMemeber.avatar}
                  style={{
                    width: '80px',
                    height: '80px',
                  }}
                />
              ) : (
                <Avatar
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    border: '1px solid #cbc8c8',
                  }}
                >
                  <Text
                    style={{
                      color: '#9646f5',
                      fontWeight: 'bold',
                      fontSize: '25px',
                    }}
                  >
                    {selectedMemeber?.name
                      ?.split(' ')
                      .map(n => n[0])
                      .join('')}
                  </Text>
                </Avatar>
              )}
            </div>

            <div className="name">
              <span style={{ color: 'grey' }}>Name</span>
              <p style={{ fontWeight: 500 }}>{selectedMemeber.name}</p>
            </div>
            <div className="email">
              <span style={{ color: 'grey' }}>Email</span>
              <p style={{ fontWeight: 500, color: '#9646f5' }}>
                {selectedMemeber.email}
              </p>
            </div>

            <div className="aboutme">
              <span style={{ color: 'grey' }}>About Me</span>
              <p style={{ fontWeight: 500 }}>{selectedMemeber.aboutme}</p>
            </div>
          </div>
        </Modal>
      )}
    </Fragment>
  );
};
