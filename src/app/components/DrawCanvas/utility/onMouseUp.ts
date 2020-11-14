import { ObjectInterface, ShapeObjectType } from '../types';
import { Vector2d } from 'konva/types/types';
import _ from 'lodash';
import { defaultTextProperties } from '../constants';

export function onMouseUp(
  state: ObjectInterface,
  drawingTool: ShapeObjectType,
  position: Vector2d,
): ObjectInterface {
  const width = Math.abs(position.x - state.x);
  const height = Math.abs(position.y - state.y);

  const data: ObjectInterface = {
    ...state,
  };
  const dimensions = {
    height,
    width,
  };
  if (drawingTool === 'RectRounded') {
    _.set(data, 'rect', {
      cornerRadius: 20,
      ...dimensions,
    });
  } else if (drawingTool === 'Rect') {
    _.set(data, 'rect', {
      cornerRadius: 0,
      ...dimensions,
    });
  } else if (drawingTool === 'Star') {
    _.set(data, 'star', {
      innerRadius: width / 2,
      outerRadius: width,
      numPoints: 5,
    });
  } else if (drawingTool === 'Triangle') {
    _.set(data, 'triangle', {
      ...dimensions,
    });
  } else if (drawingTool === 'Ellipse') {
    _.set(data, 'ellipse', {
      radiusX: Math.abs(width),
      radiusY: Math.abs(height),
    });
  } else if (drawingTool === 'Sticky') {
    _.set(data, 'rect', {
      cornerRadius: 0,
      ...dimensions,
    });
    _.set(data, 'sticky', {
      ...defaultTextProperties,
      fontColor: '#000000',
      backgroundColor: '#f5ecfd',
    });
  } else if (drawingTool === 'Text') {
    _.set(data, 'rect', {
      cornerRadius: 0,
      ...dimensions,
    });
    _.set(data, 'sticky', {
      ...defaultTextProperties,
      fontColor: '#000000',
      backgroundColor: undefined,
    });
  }
  return data;
}
