import {REDUCER_TYPE} from '@constants';

const intialState = {
  count: 10,
};

export default saveCounter = (state = intialState, action) => {
  switch (action.type) {
    case REDUCER_TYPE.SAVE_COUNTER:
      return {
        ...state,
        count: action.data,
      };

    default:
      return state;
  }
};
