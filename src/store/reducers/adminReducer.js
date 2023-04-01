import actionTypes from "../actions/actionTypes";

//VIẾT REDUCER LÀM GÌ VỚI ACTION ĐẤY, SAU ĐÓ CHẠY VÀO REACT FIRE CÁI ACTION ĐẤY LÀ XONG
const initialState = {
  isLoadingGender: false,
  genders: [],
  roles: [],
  positions: [],
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_GENDER_START:
      let copyState = { ...state };
      copyState.isLoadingGender = true;
      // console.log("hoi dan it fire fetch gender start: ", action);
      return {
        ...copyState,
      };

    case actionTypes.FETCH_GENDER_SUCCESS:
      state.genders = action.data;
      state.isLoadingGender = false;

      // console.log("hoi dan it fire fetch gender success: ", action);

      return {
        ...state,
      };

    case actionTypes.FETCH_GENDER_FAIDED:
      // console.log("hoi dan it fire fetch gender failed: ", action);
      state.isLoadingGender = false;
      state.genders = [];
      return {
        ...state,
      };

    case actionTypes.FETCH_POSITION_SUCCESS:
      state.positions = action.data;

      return {
        ...state,
      };

    case actionTypes.FETCH_POSITION_FAIDED:
      state.positions = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_ROLE_SUCCESS:
      state.roles = action.data;

      return {
        ...state,
      };

    case actionTypes.FETCH_POSITION_FAIDED:
      state.roles = [];
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default adminReducer;
