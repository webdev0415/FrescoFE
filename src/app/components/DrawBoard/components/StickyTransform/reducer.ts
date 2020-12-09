import {
  BoardNotesAreaPropsInterface,
  BoardObjectInterface,
} from '../../types';
import { v4 } from 'uuid';

export interface ReducerActionsInterface {
  data?: BoardObjectInterface;
  type: 'add' | 'update' | 'delete';
  props: BoardNotesAreaPropsInterface;
  id?: string;
}

function reShapeNotes(state: BoardObjectInterface[]): BoardObjectInterface[] {
  let oldState: BoardObjectInterface[] = [];
  if (state.length) {
    if (state.length <= 2) {
      let x = 10;
      let y = 10;
      oldState = state.map(item => {
        const newItem = {
          ...item,
          x: x,
          y: y,
          width: 130,
          height: 130,
          fontSize: 14,
          circle: {
            ...item.circle,
            radius: 7,
            x: 12,
            y: 12,
          },
        };
        x = y === 10 ? x + 140 : x;
        return newItem;
      });
    } else {
      let x = 10;
      let y = 10;
      oldState = state.map(item => {
        const newItem = {
          ...item,
          x: x,
          y: y,
          width: 60,
          height: 60,
          fontSize: 8,
          circle: {
            ...item.circle,
            radius: 3,
            x: 7,
            y: 7,
          },
        };
        x = y === 10 ? x : x + 70;
        y = y === 10 ? y + 70 : 10;
        return newItem;
      });
    }
  }
  return oldState;
}

let timeout;

function addNewNotes(state: BoardObjectInterface[]): BoardObjectInterface[] {
  let oldState = [...state];
  oldState.push({
    id: v4(),
    userId: v4(),
    x: 150,
    y: 10,
    width: 130,
    height: 130,
    fontSize: 14,
    text: 'Sticky notes area',
    circle: {
      radius: 7,
      x: 12,
      y: 12,
      fill: '#000000',
    },
  });

  return reShapeNotes(oldState);
}

export function reducer(
  state: BoardObjectInterface[],
  action: ReducerActionsInterface,
): any {
  let newState: BoardObjectInterface[] = [];
  switch (action.type) {
    case 'add':
      if (timeout) {
        clearTimeout(timeout);
      }
      newState = addNewNotes(state);
      timeout = setTimeout(() => {
        action.props.onChange(action.props.id, newState);
      }, 1000);
      return newState;
    case 'update':
      if (timeout) {
        clearTimeout(timeout);
      }
      newState = state.map(item => {
        if (item.id === action.data?.id) {
          return {
            ...item,
            ...action.data,
          };
        } else {
          return item;
        }
      });
      timeout = setTimeout(() => {
        action.props.onChange(action.props.id, newState);
      }, 1000);
      return newState;
    case 'delete':
      if (timeout) {
        clearTimeout(timeout);
      }
      newState = reShapeNotes(state.filter(item => item.id !== action.id));
      timeout = setTimeout(() => {
        action.props.onChange(action.props.id, newState);
      }, 1000);
      return newState;
    default:
      return state;
  }
}
