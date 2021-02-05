import React, { memo, useEffect, useState } from 'react';
import { Button, Input, Tabs } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import {
  BoardApiService,
  CanvasApiService,
  CanvasCategoryInterface,
  CanvasCategoryService,
  CanvasResponseInterface,
} from '../../../services/APIService';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

const { TabPane } = Tabs;

interface Props {
  orgId: string;
  teamId?: string;

  onClose();
}

interface State {
  boards: CanvasResponseInterface[];
  categories: CanvasCategoryInterface[];
  loading: boolean;
}
/* istanbul ignore next */
export const CanvasBoardTemplates = memo((props: Props) => {
  const [boardName, setBoardName] = useState('');
  const [loadingCreateBoard, setLoadingCreateBoard] = useState('');
  const [activeKey, setActiveKey] = useState('1');
  const [boards, setBoards] = useState<CanvasResponseInterface[]>([]);
  const [categories, setCategories] = useState<CanvasCategoryInterface[]>([]);

  useEffect(() => {
    const defaultBoardName = `Untitled Board, ${moment().format(
      'DD/mm/yy, hh:mm A',
    )}`;
    setBoardName(defaultBoardName);
  }, []);

  const history = useHistory();

  const handleCreateBoard = (id: string, categoryId: string) => {
    setLoadingCreateBoard(id);
    CanvasApiService.getById(id).subscribe(canvas => {
      BoardApiService.create({
        data: canvas.data,
        name: boardName,
        orgId: props.orgId,
        categoryId: categoryId,
        teamId: props.teamId,
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
  };

  useEffect(() => {
    CanvasCategoryService.list().subscribe(data => {
      setCategories(data);
    });
  }, []);

  useEffect(() => {
    CanvasApiService.getByOrganizationId(props.orgId).subscribe(data => {
      setBoards(data);
    });
  }, [props.orgId]);

  console.log('board name', boardName);
  return (
    <div className="create-board-view">
      {/* <div className="form-view">
        <Input
          placeholder="Board Name"
          value={boardName}
          onChange={event => setBoardName(event.target.value)}
        />
        <Button type="default" icon={<CloseOutlined />} onClick={props.onClose}>
          Cancel
        </Button>
      </div> */}
      <Tabs
        className="canvas-board-template"
        defaultActiveKey={activeKey}
        onChange={key => {
          setActiveKey(key);
        }}
      >
        {categories.map((category, index) => (
          <TabPane
            tab={category.name}
            key={category.id}
            tabKey={String(index + 1)}
          >
            <div className="card-section">
              <div className="card-grid">
                {boards
                  .filter(board => board.categoryId === category.id)
                  .map(board => (
                    <div
                      className="cards-board card-board-select"
                      key={board.id}
                    >
                      <img
                        alt="example"
                        style={{
                          border: '1px solid #f0f2f5',
                          backgroundColor: 'white',
                        }}
                        src={
                          board.path ||
                          'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
                        }
                      />
                      <div className="card-footer card-board-footer">
                        <div className="card-title">{board.name}</div>
                        <div className="card-description">
                          Use this template to create a shared understanding of
                          customer aspirations and priorities
                        </div>
                        <div className="card-board-action">
                          <Button
                            block
                            type="primary"
                            role="select-button"
                            loading={loadingCreateBoard === board.id}
                            onClick={() =>
                              handleCreateBoard(board.id, category.id)
                            }
                          >
                            Select
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
});
