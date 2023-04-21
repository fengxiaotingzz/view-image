import { connect } from 'dva';
import { cloneDeep, isEmpty } from 'lodash';
import { request } from './ajax';
import {withErrorBoundary} from '@/common/error'
import { compose } from 'lodash/fp';

const getStateObj = (stateArr, stateValue) => {
  return (state) => {
    const currentObj = state?.[stateValue];
    if (!isEmpty(currentObj)) {
      const obj = {};
      stateArr?.forEach((val) => {
        if (currentObj?.[val]) {
          obj[val] = currentObj?.[val];
        }
      });
      return obj;
    } else {
      throw Error('not found this action name');
    }
  };
};

const handlePayload = (payload = {}, typeList = []) => {
  let current = undefined;
  const result = typeList?.reduce((total, cur, i) => {
    total[cur] = undefined;
    if (i === typeList?.length - 1) {
      total[cur] = payload;
      current = total[cur];
    }
    return total;
  }, {});

  return { payload: result, current };
};

const dispatchFunc = (dispatch, stateValue) => {
  return (obj) => {
    const { type, payload = {}, url, ...other } = obj;
    const typeList = type?.split('/');
    const resultPayload = handlePayload(
      payload,
      typeList?.slice(1, typeList?.length),
    );
    const payloadObj = new Object(resultPayload?.payload);
    const current = resultPayload?.current;
    const curType = `${stateValue}/${typeList?.[0]}`;

    if (url) {
      current.loading = true;
      dispatch({
        type: curType,
        payload: cloneDeep(payloadObj),
      });

      request({ url, ...other }).then((res) => {
        current.loading = false;
        if (res) {
          current.data = res || {};
        }

        dispatch({
          type: curType,
          payload: cloneDeep(payloadObj),
        });
      });
    } else {
      dispatch({
        type: curType,
        payload: cloneDeep(payloadObj),
      });
    }
  };
};

const connectBox = (stateArr, stateValue) => (WrapComponent) => {
  return withErrorBoundary(connect(getStateObj(stateArr, stateValue))(function (props) {
    const { dispatch, componentStack, ...others } = props;
    return (
      <WrapComponent
        {...{ ...others, dispatch: dispatchFunc(dispatch, stateValue) }}
      />
    );
  }))
};

export default connectBox;
