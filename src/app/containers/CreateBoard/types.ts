import Konva from 'konva';
import { RouteChildrenProps } from 'react-router';

export type ShapeObjectType =
  | 'Rect'
  | 'RectRounded'
  | 'Triangle'
  | 'Ellipse'
  | 'Star'
  | 'Text'
  | 'Sticky'
  | null;

type TextAlignType = 'left' | 'center' | 'right';
type TextVerticalType = 'top' | 'middle' | 'bottom';
type FontStyleType = 'normal' | 'bold' | 'italic';
type FontVariantType = 'normal' | 'small-caps';
type TextDecoration = 'line-through' | 'underline' | '';
type WrapType = 'word' | 'char' | 'none';

export interface ShapeProperty {
  height: number;
  width: number;
}

export interface TextProperties extends Partial<ShapeProperty> {
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

export interface StickyProperty extends ShapeProperty {
  cornerRadius: number;
}

export interface EllipseProperties {
  radiusX: number;
  radiusY: number;
}

export interface RectangleProperties extends ShapeProperty {
  cornerRadius: number;
}

export interface TriangleProperties extends ShapeProperty {}

export interface StarProperties {
  innerRadius: number;
  outerRadius: number;
  numPoints: number;
}

export interface PointsInterface {
  x: number;
  y: number;
  textData?: TextProperties;
  sticky?: StickyProperty;
  rect?: RectangleProperties;
  star?: StarProperties;
  ellipse?: EllipseProperties;
  triangle?: TriangleProperties;
  type: ShapeObjectType;
}

export interface ObjectInterface extends PointsInterface {
  id: string;
  rotation: number;
  shapeConfig?: Konva.ShapeConfig;
  isFocused: boolean;
  isSelected: boolean;
  isEditing: boolean;
}
export interface SelectedStickyInterface extends PointsInterface {
  id: string;
  shapeConfig?: Konva.ShapeConfig;
}

export interface Props
  extends RouteChildrenProps<{ id: string; orgId: string }> {
  className: string;
  drawingTool: ShapeObjectType;
  zoomLevel: number;
}

export interface State {
  objects: ObjectInterface[];
  points: ObjectInterface;
  prevHistory: ObjectInterface[];
  nextHistory: ObjectInterface[];
  canvas: {
    name: string;
    orgId: string;
  };
  selectedStickyData: SelectedStickyInterface | null;
}

export interface FontInterface {
  fontFamily: string;
  fontName: string;
}

export interface TransformShapeProps {
  data: ObjectInterface;
  onChange(data: ObjectInterface): void;
  onSelect(event: Konva.KonvaEventObject<MouseEvent>): void;
  draggable?: boolean;
}
