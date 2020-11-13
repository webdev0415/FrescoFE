import { ObjectInterface, PointsInterface, TextProperties } from './types';

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
  ...defaultPointState,
  shapeConfig: {
    ...defaultShapeConfig,
  },
};

export const defaultTextProperties: TextProperties = {
  height: 200,
  width: 200,
  fontFamily: 'Arial',
  fontSize: 12,
  text:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  ellipsis: true,
  padding: 20,
  align: 'center',
  verticalAlign: 'middle',
};
