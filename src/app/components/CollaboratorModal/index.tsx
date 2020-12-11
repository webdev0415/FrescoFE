/* eslint-disable react-hooks/exhaustive-deps */
import React, { CSSProperties, Fragment, useState } from 'react';
import Text from 'antd/lib/typography/Text';
import { CloseIcon, GroupIcon, ToolbarStickyIcon } from 'assets/icons';
import clsx from 'clsx';

export const CollaboratorModal = ({ closeModal, collaborator }) => {
  const [selected, setSelected] = useState<any>([]);

  const onSelect = (item: any) => {
    if (selected.includes(item.id)) {
      setSelected(selected.filter(i => i !== item.id));
    } else {
      setSelected([...selected, item.id]);
    }
  };
  return (
    <Fragment>
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 40,
          bottom: 40,
          width: '25rem',
          paddingBottom: '10px',
          backgroundColor: 'white',
          zIndex: 1000,
          paddingLeft: 10,
          boxShadow: '0 0 10px 0 rgba(131,134,163,0.50)',
        }}
        id="collaborator-modal"
      >
        <div
          style={{
            display: 'inline-flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '40px',
            padding: '0 16px 0 0',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <GroupIcon />
            <Text style={{ marginLeft: 6, fontSize: 20, fontWeight: 400 }}>
              Collaborators
            </Text>
          </div>
          <CloseIcon onClick={closeModal} className="icon-default" />
        </div>
        <div
          style={{
            borderBottom: '1px solid gray',
            marginTop: '10px',
            marginBottom: '10px',
          }}
        />
        <p>Select a collaborator to view its contributions </p>
        <div className="collaborators-list">
          {collaborator.map(item => (
            <div
              className={clsx('collaborator-item', {
                active: selected.includes(item.id),
              })}
              onClick={() => onSelect(item)}
              style={{ '--color': item.color } as CSSProperties}
            >
              <div className="collaborator-item-left">
                <div className="identity-circle" />
                <div className="collaborator-title">{item.name}</div>
              </div>
              <div className="collaborator-item-right">
                <div className="collaborator-icon">
                  <ToolbarStickyIcon />
                </div>
                <div className="collaborator-count">{item.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};
