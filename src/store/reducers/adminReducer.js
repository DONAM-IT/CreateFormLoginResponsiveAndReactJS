import actionTypes from "../actions/actionTypes";

//VIẾT REDUCER LÀM GÌ VỚI ACTION ĐẤY, SAU ĐÓ CHẠY VÀO REACT FIRE CÁI ACTION ĐẤY LÀ XONG
const initialState = {
  isLoadingGender: false,
  genders: [],
  roles: [],
  positions: [],
  users: [],
  topDotors: [],
  allDoctors: [],
  allScheduleTime: [], //đặt 1 cái biến cho thằng redux
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

    case actionTypes.FETCH_GENDER_FAILDED:
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

    case actionTypes.FETCH_POSITION_FAILDED:
      state.positions = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_ROLE_SUCCESS:
      state.roles = action.data;

      return {
        ...state,
      };

    case actionTypes.FETCH_POSITION_FAILDED:
      state.roles = [];
      return {
        ...state,
      };
    //viết switch để lưu vào redux
    case actionTypes.FETCH_ALL_USERS_SUCCESS:
      state.users = action.users; //action.users là biến users lấy từ bên file adminAction.js có hàm fetchAllUsersSuccess truyền qua
      return {
        ...state,
      };

    case actionTypes.FETCH_ALL_USERS_FAILDED:
      state.users = []; //action.users là biến users lấy từ bên file adminAction.js có hàm fetchAllUsersSuccess truyền qua
      return {
        ...state,
      };
    case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
      state.topDotors = action.dataDoctors; //gán giá trị của biến dataDoctors cho redux
      return {
        ...state,
      };
    case actionTypes.FETCH_TOP_DOCTORS_FAILDED:
      state.topDotors = [];
      return {
        ...state,
      };

    case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
      state.allDoctors = action.dataDr; //qua bên adminAction truyền gì cho action
      return {
        ...state,
      };
    case actionTypes.FETCH_ALL_DOCTORS_FAILDED:
      state.allDoctors = [];
      return {
        ...state,
      };

    case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
      state.allScheduleTime = action.dataTime;
      return {
        ...state,
      };
    case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILDED:
      state.allScheduleTime = [];
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default adminReducer;
