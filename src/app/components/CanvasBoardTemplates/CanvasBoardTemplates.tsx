import React, { memo, useEffect, useState } from 'react';
import { Button, Input, Tabs } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { CanvasCategoryService } from '../../../services/APIService/CanvasCategory.service';
import { zip } from 'rxjs';
import {
  BoardApiService,
  CanvasApiService,
} from '../../../services/APIService';
import {
  CanvasCategoryInterface,
  CanvasResponseInterface,
} from '../../../services/APIService/interfaces';
import { useHistory } from 'react-router-dom';

const { TabPane } = Tabs;

interface Props {
  orgId: string;

  onClose();
}

interface State {
  boards: CanvasResponseInterface[];
  categories: CanvasCategoryInterface[];
  loading: boolean;
}

export const CanvasBoardTemplates = memo((props: Props) => {
  const [boardName, setBoardName] = useState('');
  const [loadingCreateBoard, setLoadingCreateBoard] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [state, setState] = useState<State>({
    boards: [],
    categories: [],
    loading: false,
  });

  const history = useHistory();

  const handleCreateBoard = (id: string) => {
    setLoadingCreateBoard(id);
    CanvasApiService.getById(id).subscribe(canvas => {
      BoardApiService.create({
        data: canvas.data,
        name: boardName,
        orgId: props.orgId,
        categoryId: activeKey,
      }).subscribe(
        board => {
          setLoadingCreateBoard('');
          props.onClose();
          history.push(`/canvas/${board.id}/board`);
          console.log(board);
        },
        () => {
          setLoadingCreateBoard('');
        },
      );
    });
  };

  useEffect(() => {
    setState({
      ...state,
      loading: true,
    });
    zip(
      CanvasCategoryService.list(),
      CanvasApiService.getByOrganizationId(props.orgId),
    ).subscribe(
      ([categories, boards]) => {
        if (categories.length) {
          setActiveKey(categories[0].id);
        }
        setState({
          categories,
          boards,
          loading: false,
        });
      },
      error => {
        setState({
          ...state,
          loading: false,
        });
        console.error(error);
      },
    );
  }, [props.orgId]);
  return (
    <div className="create-board-view">
      <div className="form-view">
        <Input
          placeholder="Board Name"
          onChange={event => setBoardName(event.target.value)}
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
        {state.categories.map(category => (
          <TabPane tab={category.name} key={category.id}>
            <div className="card-section">
              <div className="card-grid">
                {state.boards
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
                            type="primary"
                            disabled={!boardName}
                            icon={<PlusOutlined />}
                            loading={loadingCreateBoard === board.id}
                            onClick={() => handleCreateBoard(board.id)}
                          >
                            Select
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                {new Array(5).fill(0).map((item, index) => (
                  <div className="cards-board card-board-select" key={index}>
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                    <div className="card-footer card-board-footer">
                      <div className="card-title">
                        {category.name} Placeholder
                      </div>
                      <div className="card-description">
                        Use this template to create a shared understanding of
                        customer aspirations and priorities{' '}
                      </div>
                      <div className="card-board-action">
                        <Button type="primary" disabled={true}>
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