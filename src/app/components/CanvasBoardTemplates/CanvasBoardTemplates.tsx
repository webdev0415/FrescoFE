import React, { memo, useCallback, useEffect, useState } from 'react';
import { Button, Input, Tabs } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import {
  BoardApiService,
  CanvasApiService,
  CanvasCategoryInterface,
  CanvasCategoryService,
  CanvasResponseInterface,
} from 'services/APIService';
import { CanvasBoardTemplateItem } from '../CanvasBoardTemplateItem';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

interface Props {
  orgId: string;

  onClose();
}

export const CanvasBoardTemplates = memo((props: Props) => {
  const defaultBoardName = `Untitled Board, ${moment().format(
    'DD/mm/yy, hh:mm A',
  )}`;

  const [boardName, setBoardName] = useState<string>(defaultBoardName);
  const [loadingCreateBoard, setLoadingCreateBoard] = useState<string>('');
  const [activeKey, setActiveKey] = useState<string>('');
  const [boards, setBoards] = useState<CanvasResponseInterface[]>([]);
  const [categories, setCategories] = useState<CanvasCategoryInterface[]>([]);

  const history = useHistory();

  const handleCreateBoard = useCallback(
    (id: string) => {
      setLoadingCreateBoard(id);
      CanvasApiService.getById(id).subscribe(canvas => {
        BoardApiService.create({
          data: canvas.data,
          name: boardName,
          orgId: props.orgId,
          categoryId: activeKey,
        }).subscribe(
          board => {
            props.onClose();
            history.push(`/board/${board.id}?organization=${props.orgId}`, {
              orgId: props.orgId,
            });
            console.log(board);
          },
          () => {
            setLoadingCreateBoard('');
          },
        );
      });
    },
    [boardName, props, activeKey, history],
  );

  useEffect(() => {
    CanvasCategoryService.list().subscribe(
      categoriesList => {
        setCategories(categoriesList);
        if (categoriesList[0]) {
          setActiveKey(categoriesList[0].id as string);
        }
      },
      error => {
        console.error(error);
      },
    );
  }, []);

  useEffect(() => {
    CanvasApiService.getByOrganizationId(props.orgId).subscribe(
      boardsList => {
        setBoards(boardsList);
      },
      error => {
        console.error(error);
      },
    );
  }, [props.orgId]);

  return (
    <div className="create-board-view">
      <div className="form-view">
        <Input
          placeholder="Board Name"
          value={boardName}
          onChange={event => setBoardName(event.target.value as string)}
        />
        <Button type="default" icon={<CloseOutlined />} onClick={props.onClose}>
          Cancel
        </Button>
      </div>
      <Tabs
        className="canvas-board-template"
        defaultActiveKey={activeKey}
        onChange={key => {
          setActiveKey(key);
        }}
      >
        {categories.map(category => (
          <Tabs.TabPane tab={category.name} key={category.id}>
            <div className="card-section">
              <div className="card-grid">
                {boards
                  .filter(
                    (board: CanvasResponseInterface) =>
                      board.categoryId === category.id,
                  )
                  .map(board => {
                    return (
                      <CanvasBoardTemplateItem
                        key={board.id}
                        loading={loadingCreateBoard === board.id}
                        board={board}
                        onSelect={handleCreateBoard}
                      />
                    );
                  })}
              </div>
            </div>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
});
