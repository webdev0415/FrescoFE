import React, { memo, MouseEvent, useEffect, useState } from 'react';
import { Button, Tabs, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { CanvasCategoryService } from '../../../services/APIService/CanvasCategory.service';
import { zip } from 'rxjs';
import { CanvasApiService } from '../../../services/APIService';
import {
  CanvasCategoryInterface,
  CanvasResponseInterface,
} from '../../../services/APIService/interfaces';
const { TabPane } = Tabs;

interface Props {
  orgId: string;
  onClose(event: MouseEvent);
}

interface State {
  boards: CanvasResponseInterface[];
  categories: CanvasCategoryInterface[];
  loading: boolean;
}

export const CanvasBoardTemplates = memo((props: Props) => {
  const [state, setState] = useState<State>({
    boards: [],
    categories: [],
    loading: false,
  });

  const [images, setImages] = useState<Record<string, string>>({});

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
        <Input placeholder="Board Name" />
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
                  .map(boards => (
                    <div
                      className="cards-board card-board-select"
                      key={boards.id}
                    >
                      <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                      />
                      <div className="card-footer card-board-footer">
                        <div className="card-title">{boards.name}</div>
                        <div className="card-description">
                          Use this template to create a shared understanding of
                          customer aspirations and priorities
                        </div>
                        <div className="card-board-action">
                          <Button type="primary">Select</Button>
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
                      <div className="card-title">Business Model</div>
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
