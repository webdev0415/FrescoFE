import React from 'react';
import { CanvasResponseInterface } from '../../../services/APIService';
import { Button } from 'antd';

interface Props {
  loading: boolean;
  board: CanvasResponseInterface;
  onSelect(id: string);
}

export const CanvasBoardTemplateItem: React.FC<Props> = (
  props: Props,
): JSX.Element => {
  const { loading, board, onSelect } = props;

  return (
    <div className="cards-board card-board-select" key={board.id}>
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
          Use this template to create a shared understanding of customer
          aspirations and priorities
        </div>
        <div className="card-board-action">
          <Button
            block={true}
            loading={loading}
            onClick={() => {
              onSelect(board.id);
            }}
            type="primary"
          >
            Select
          </Button>
        </div>
      </div>
    </div>
  );
};
