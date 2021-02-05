/* eslint-disable react-hooks/exhaustive-deps */
import React, { CSSProperties, Fragment, useEffect, useState } from 'react';
import Text from 'antd/lib/typography/Text';
import { CloseIcon, GroupIcon, ToolbarStickyIcon } from 'assets/icons';
import clsx from 'clsx';
import {
  CollaboratorInterface,
  collaboratorsService,
} from 'services/CollaboratorsService';

export const CollaboratorModal = ({ closeModal }) => {
  const [collaborators, setCollaborators] = useState<CollaboratorInterface[]>(
    [],
  );

  useEffect(() => {
    collaboratorsService.state.subscribe(value => {
      setCollaborators(value);
    });
  });

  const onSelect = (item: any) => {
    const data = collaborators.map(collaborator => {
      if (collaborator.id === item.id) {
        return {
          ...collaborator,
          selected: !collaborator.selected,
        };
      } else {
        return collaborator;
      }
    });
    collaboratorsService.update(data);
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
            padding: '10px 16px 0 0',
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
          {collaborators.map(item => (
            <div
              className={clsx('collaborator-item', {
                active: item.selected,
              })}
              onClick={() => onSelect(item)}
              style={{ '--color': item.color } as CSSProperties}
            >
              <div className="collaborator-item-left">
                <div className="identity-circle" />
                <div className="collaborator-title">{item.email}</div>
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
