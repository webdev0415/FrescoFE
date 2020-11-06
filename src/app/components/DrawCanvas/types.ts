export type ShapeObjectType =
  | 'Rect'
  | 'RectRounded'
  | 'Triangle'
  | 'Circle'
  | 'Ellipse'
  | 'Star'
  | 'Drag'
  | 'Text'
  | 'Sticky'
  | null;

type TextAlignType = 'left' | 'center' | 'right';
type TextVerticalType = 'top' | 'middle' | 'bottom';
type FontStyleType = 'normal' | 'bold' | 'italic';
type FontVariantType = 'normal' | 'small-caps';
type TextDecoration = 'line-through' | 'underline' | '';
type WrapType = 'word' | 'char' | 'none';

export interface TextProperties {
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: FontStyleType;
  fontVariant?: FontVariantType;
  align?: TextAlignType;
  letterSpacing?: number;
  verticalAlign?: TextVerticalType;
  padding?: number;
  lineHeight?: number;
  textDecoration?: TextDecoration;
  wrap?: WrapType;
  ellipsis?: boolean;
}

export interface PointsInterface {
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  ellipseRadius?: {
    x: number;
    y: number;
  };
  type: ShapeObjectType;
}

export interface ObjectInterface extends PointsInterface {
  id: string;
  rotation: number;
  textData?: TextProperties;
  isDragging: boolean;
  isFocused: boolean;
  isSelected: boolean;
  isEditing: boolean;
}

export interface Props {
  className: string;
  drawingTool: ShapeObjectType;
}

export interface State {
  objects: ObjectInterface[];
  points: PointsInterface;
}
