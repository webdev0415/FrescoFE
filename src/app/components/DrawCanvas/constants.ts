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
];

export const defaultPointState: PointsInterface = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  radius: 0,
  ellipseRadius: {
    x: 0,
    y: 0,
  },
  type: null,
};

export const defaultObjectState: ObjectInterface = {
  id: '',
  rotation: 0,
  isDragging: false,
  isFocused: false,
  isSelected: false,
  isEditing: false,
  ...defaultPointState,
};

export const defaultTextProperties: TextProperties = {
  fontFamily: 'Arial',
  fontSize: 12,
  text:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  ellipsis: true,
  padding: 20,
  align: 'center',
  verticalAlign: 'middle',
};
