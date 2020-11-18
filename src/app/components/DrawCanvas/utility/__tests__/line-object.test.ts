import { ObjectInterface, ShapeObjectType } from '../../types';
import { Vector2d } from 'konva/types/types';
import { defaultObjectState } from '../../constants';
import { v4 as uuidv4 } from 'uuid';
import { onMouseUp, onMouseMove, onMouseDown } from '../index';

describe('Draw Line On Canvas', () => {
  let state: ObjectInterface = { ...defaultObjectState };
  let drawingTool: ShapeObjectType = 'Line';
  let id = uuidv4();

  beforeEach(() => {
    state = { ...defaultObjectState };
  });

  it('should handle onMouseDown Start Drawing Line Object', () => {
    const pointerPositions: Vector2d = { x: 0, y: 0 };
    const objectState = { ...state };
    expect(onMouseDown(objectState, drawingTool, pointerPositions, id)).toEqual(
      {
        ...objectState,
        id: id,
        type: 'Line',
        line: [pointerPositions],
      },
    );
  });

  it('should handle onMouseMove Drawing Line Object', () => {
    let pointerPositions: Vector2d = { x: 12, y: 22 };
    const objectState: ObjectInterface = { ...state, id, type: 'Line' };
    expect(onMouseMove(objectState, drawingTool, pointerPositions)).toEqual({
      ...objectState,
      id: id,
      type: 'Line',
      line: [{ x: 0, y: 0 }, pointerPositions],
    });
  });

  it('should handle onMouseUp End Drawing Line Object', () => {
    let pointerPositions: Vector2d = { x: 32, y: 44 };
    const objectState: ObjectInterface = { ...state, id, type: 'Line' };
    expect(onMouseUp(objectState, drawingTool, pointerPositions)).toEqual({
      ...objectState,
      id: id,
      type: 'Line',
      line: [{ x: 0, y: 0 }, pointerPositions],
    });
  });
});
