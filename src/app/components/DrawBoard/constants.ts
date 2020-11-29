import {
  BoardNotesAreaInterface,
  ObjectInterface,
  PointsInterface,
  StickyProperty,
} from './types';
import { v4 as uuidV4 } from 'uuid';

export const fontNames = [
  'Comic Sans MS',
  'Courier New',
  'Georgia',
  'Impact',
  'Microsoft Sans Serif',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
  'Arial',
  'Roboto',
  'Space Grotesk',
  'Poppins',
  'Syne Tactile',
  'Itim',
  'Anton',
  'Josefin Sans',
];

export const defaultPointState: PointsInterface = {
  x: 0,
  y: 0,
  type: null,
};

export const defaultShapeConfig = {
  fill: '#9646f5',
  strokeWidth: 2,
  opacity: 0.8,
  shadowBlur: 10,
  shadowOpacity: 0.6,
  shadowOffsetX: 5,
  shadowOffsetY: 5,
};

export const defaultObjectState: ObjectInterface = {
  id: '',
  rotation: 0,
  isFocused: false,
  isSelected: false,
  isEditing: false,
  isLocked: false,
  ...defaultPointState,
  shapeConfig: {
    ...defaultShapeConfig,
  },
};

export const defaultTextProperties: StickyProperty = {
  height: 200,
  width: 200,
  fontFamily: 'Arial',
  fontSize: 12,
  text: '',
  ellipsis: true,
  padding: 20,
  align: 'center',
  fontColor: '#000000',
  backgroundColor: undefined,
  stroke: undefined,
  verticalAlign: 'middle',
};

export function generateDefaultBoardNotesData(): BoardNotesAreaInterface[] {
  let x = 20;
  let y = 130;
  const data: BoardNotesAreaInterface[] = [];
  Array(4)
    .fill('row')
    .forEach(() => {
      Array(4)
        .fill('column')
        .forEach(() => {
          let newData: BoardNotesAreaInterface = {
            width: 290,
            height: 150,
            x: x,
            y: y,
            data: [],
            id: uuidV4(),
          };
          data.push(newData);
          x = x + 290 + 10;
        });
      x = 20;
      y = y + 220;
    });
  console.log('generateDefaultBoardNotesData', data);
  return data;
}
