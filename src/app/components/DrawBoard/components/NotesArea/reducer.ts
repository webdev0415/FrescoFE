import {
  BoardNotesAreaPropsInterface,
  BoardObjectInterface,
} from '../../types';
import { v4 } from 'uuid';

export interface ReducerActionsInterface {
  data?: BoardObjectInterface;
  type: 'add' | 'update';
  props: BoardNotesAreaPropsInterface;
}

function addNewNotes(state: BoardObjectInterface[]): BoardObjectInterface[] {
  let oldState = [...state];
  if (state.length) {
    if (oldState.length === 1) {
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
    } else {
      let x = 10;
      let y = 10;
      oldState = oldState.map(item => {
        const newItem = {
          ...item,
          x: x,
          y: y,
          width: 60,
          height: 60,
          fontSize: 8,
          circle: {
            radius: 3,
            x: 7,
            y: 7,
            fill: '#000000',
          },
        };
        x = y === 10 ? x : x + 70;
        y = y === 10 ? y + 70 : 10;
        return newItem;
      });
      oldState.push({
        id: v4(),
        userId: v4(),
        x: x,
        y: y,
        width: 60,
        height: 60,
        fontSize: 8,
        text: 'Sticky notes area',
        circle: {
          radius: 3,
          x: 7,
          y: 7,
          fill: '#000000',
        },
      });
    }
  } else {
    oldState.push({
      id: v4(),
      userId: v4(),
      x: 10,
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
  }
  return oldState;
}

export function reducer(
  state: BoardObjectInterface[],
  action: ReducerActionsInterface,
): any {
  let newState: BoardObjectInterface[] = [];
  switch (action.type) {
    case 'add':
      newState = addNewNotes(state);
      action.props.onChange(action.props.id, newState);
      return newState;
    case 'update':
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
      action.props.onChange(action.props.id, newState);
      return newState;
    default:
      return state;
  }
}
