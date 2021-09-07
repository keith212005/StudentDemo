import {REDUCER_TYPE} from '@constants';

export const saveCounter = params => ({
  type: REDUCER_TYPE.SAVE_COUNTER,
  data: params,
});
