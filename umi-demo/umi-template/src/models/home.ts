export default {
    namespace: 'home',
    state: {
        a: '1',
        filterData: {}
    },
    reducers: {
        changeFilterData(state, action){
            return {
                ...state, ...action.payload
            }
        }
    }
}