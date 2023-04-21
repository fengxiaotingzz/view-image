export const dispatchFilter = () => (dispatch) => {
  dispatch({
    type: 'changeFilterData/filterData',
    payload: {
      value: '333',
    },
  });
};
