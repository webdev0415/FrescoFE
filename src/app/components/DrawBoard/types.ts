import Konva from 'konva';
import { RouteChildrenProps } from 'react-router';

export type ShapeObjectType =
  | 'Rect'
  | 'RectRounded'
  | 'Triangle'
  | 'Ellipse'
  | 'Star'
  | 'Text'
  | 'Line'
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

export interface CanvasPoints {
  x: number;
  y: number;
}

export interface StickyProperty extends Partial<ShapeProperty> {
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
  stroke?: string;
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

export interface PointsInterface extends CanvasPoints {
  textData?: StickyProperty;
  sticky?: StickyProperty;
  rect?: RectangleProperties;
  star?: StarProperties;
  ellipse?: EllipseProperties;
  triangle?: TriangleProperties;
  line?: CanvasPoints[];
  type: ShapeObjectType;
}

export interface ObjectInterface extends PointsInterface {
  id: string;
  rotation: number;
  shapeConfig?: Konva.ShapeConfig;
  isFocused: boolean;
  isSelected: boolean;
  isEditing: boolean;
  isLocked: boolean;
}

export interface Props
  extends RouteChildrenProps<{ id: string; type: string }> {
  className: string;
  zoomLevel: number;
}

export interface State {
  id: string;
  objects: ObjectInterface[];
  data: BoardNotesAreaInterface[];
  hoverItem: string;
  SelectedItem: string;
  canvas: {
    name: string;
    orgId: string;
    categoryId: string;
    imageId: string;
  };
}

export interface FontInterface {
  fontFamily: string;
  fontName: string;
}

export interface TransformShapeProps {
  data: ObjectInterface;
  onMouseEnter(id: string);
  onMouseLeave(id: string);
  selected: string;
}

export interface BoardEventInterface {
  boardId: string;
  data: string;
}

export interface ObjectSocketInterface {
  id: string;
  data: ObjectInterface;
}

export interface BoardNotesIdentityCircle extends CanvasPoints {
  radius: number;
  fill: string;
}
export interface BoardObjectInterface extends CanvasPoints, ShapeProperty {
  id: string;
  userId: string;
  fontSize: number;
  text: string;
  circle: BoardNotesIdentityCircle;
}
export interface BoardNotesAreaInterface extends CanvasPoints, ShapeProperty {
  id: string;
  data: BoardObjectInterface[];
}

export interface BoardNotesAreaPropsInterface extends BoardNotesAreaInterface {
  onChange(id: string, data: BoardObjectInterface[]);
}

export interface BoardNotesIdentityCircle extends CanvasPoints {
  radius: number;
  fill: string;
}
export interface BoardObjectInterface extends CanvasPoints, ShapeProperty {
  id: string;
  userId: string;
  fontSize: number;
  text: string;
  circle: BoardNotesIdentityCircle;
}
export interface BoardNotesAreaInterface extends CanvasPoints, ShapeProperty {
  id: string;
  data: BoardObjectInterface[];
}

export interface BoardNotesAreaPropsInterface extends BoardNotesAreaInterface {
  onChange(id: string, data: BoardObjectInterface[]);
}

export interface BoardNotesIdentityCircle extends CanvasPoints {
  radius: number;
  fill: string;
}
export interface BoardObjectInterface extends CanvasPoints, ShapeProperty {
  id: string;
  userId: string;
  fontSize: number;
  text: string;
  circle: BoardNotesIdentityCircle;
}
export interface BoardNotesAreaInterface extends CanvasPoints, ShapeProperty {
  id: string;
  data: BoardObjectInterface[];
}

export interface BoardNotesAreaPropsInterface extends BoardNotesAreaInterface {
  onChange(id: string, data: BoardObjectInterface[]);
}
