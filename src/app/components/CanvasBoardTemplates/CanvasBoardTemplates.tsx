import React, { memo, MouseEvent, useEffect, useState } from 'react';
import { Button, Tabs, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { CanvasCategoryService } from '../../../services/APIService/CanvasCategory.service';
import { zip } from 'rxjs';
import {
  CanvasApiService,
  BoardApiService,
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
  const [state, setState] = useState<State>({
    boards: [],
    categories: [],
    loading: false,
  });

  const history = useHistory();

  const handleCreateBoard = (id: string) => {
    CanvasApiService.getById(id).subscribe(canvas => {
      BoardApiService.create({
        data: canvas.data,
        name: boardName,
        orgId: props.orgId,
      }).subscribe(board => {
        props.onClose();
        history.push(`/canvas/${board.id}/board`);
        console.log(board);
      });
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
        console.log(categories, boards);
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
  }, [props.orgId, state]);
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
      <Tabs className="canvas-board-template">
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
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
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
                        <Button type="primary">Select</Button>
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
