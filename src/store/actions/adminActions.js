import actionTypes from "./actionTypes";
import {
  getAllCodeService,
  createNewUserService,
  getAllUsers,
  deleteUserService,
  editUserService,
  getDoctorsByPage,
  getGetPostsLimitService,
} from "../../services/userService";
import { toast } from "react-toastify";
//return 1 acction
// export const fetchGenderStart = () => ({
//   type: actionTypes.FETCH_GENDER_START,
// });

//return 1 function

//ĐỊNH NGHĨA các action (~EVENT)
export const fetchGenderStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.FETCH_GENDER_START,
      });
      let res = await getAllCodeService("GENDER");
      if (res && res.errCode === 0) {
        // console.log("hoidanit check get state: ", getState);
        dispatch(fetchGenderSuccess(res.data));
      } else {
        dispatch(fetchGenderFailed());
      }
    } catch (e) {
      dispatch(fetchGenderFailed());
      console.log("fetchGenderStart error", e);
    }
  };
};

export const fetchGenderSuccess = (genderData) => ({
  type: actionTypes.FETCH_GENDER_SUCCESS,
  data: genderData,
});
export const fetchGenderFailed = () => ({
  type: actionTypes.FETCH_GENDER_FAILDED,
});

//get chức vụ thành công (lấy data) truyền sang cho redux
export const fetchPositionSuccess = (positionData) => ({
  type: actionTypes.FETCH_POSITION_SUCCESS,
  data: positionData,
});
export const fetchPositionFailed = () => ({
  type: actionTypes.FETCH_POSITION_FAILDED,
});

export const fetchRoleSuccess = (roleData) => ({
  type: actionTypes.FETCH_ROLE_SUCCESS,
  data: roleData,
});
export const fetchRoleFailed = (roleData) => ({
  type: actionTypes.FETCH_ROLE_FAILDED,
});

export const fetchPositionStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("POSITION");
      if (res && res.errCode === 0) {
        // console.log("hoidanit check get state: ", getState);
        dispatch(fetchPositionSuccess(res.data));
      } else {
        dispatch(fetchPositionFailed());
      }
    } catch (e) {
      dispatch(fetchPositionFailed());
      console.log("fetchPositionFailed error", e);
    }
  };
};

export const fetchRoleStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("ROLE");
      if (res && res.errCode === 0) {
        // console.log("hoidanit check get state: ", getState);
        dispatch(fetchRoleSuccess(res.data)); // fire action fetchGenderSuccess
      } else {
        dispatch(fetchRoleFailed());
      }
    } catch (e) {
      dispatch(fetchRoleFailed());
      console.log("fetchRoleFailed error", e);
    }
  };
};
//FIRE ACTION
export const createNewUser = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewUserService(data);
      console.log("hoidanit check create user redux: ", res);
      if (res && res.errCode === 0) {
        toast.success("Create a new user succeed!!");
        dispatch(saveUserSuccess()); // fire action fetchGenderSuccess
        dispatch(fetchAllUsersStart());
      } else {
        dispatch(saveUserFailed());
      }
    } catch (e) {
      dispatch(saveUserFailed());
      console.log("saveUserFailed error", e);
    }
  };
};

export const saveUserSuccess = () => ({
  type: actionTypes.CREATE_USER_SUCCESS,
});

export const saveUserFailed = () => ({
  type: actionTypes.CREATE_USER_FAILDED,
});
//start doing end

export const fetchAllUsersStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllUsers("ALL");
      if (res && res.errCode === 0) {
        // console.log("hoidanit check get state: ", getState);
        //js array reverse (javascript)
        dispatch(fetchAllUsersSuccess(res.users.reverse())); // fire action fetchGenderSuccess// res.users vì res trả về tên biến users ở tab network
      } else {
        toast.error("Fetch all users error!");
        dispatch(fetchAllUsersFailed());
      }
    } catch (e) {
      toast.error("Fetch all users error!");
      dispatch(fetchAllUsersFailed());
      console.log("fetchAllUsersFailed error", e);
    }
  };
};

export const fetchAllUsersSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_USERS_SUCCESS,
  users: data, //truyền 1 đi 1 cái biến có key là users và giá trị của nó là data
});

export const fetchAllUsersFailed = () => ({
  type: actionTypes.FETCH_ALL_USERS_FAILDED, //xảy ra khi kết nối server, api trả về bị faild
});

export const deleteAUser = (userId) => {
  return async (dispatch, getState) => {
    try {
      let res = await deleteUserService(userId);
      console.log("hoidanit check create user redux: ", res);
      if (res && res.errCode === 0) {
        toast.success("Delete the user succeed!!");
        dispatch(deleteUserSuccess()); // fire action fetchGenderSuccess
        dispatch(fetchAllUsersStart()); //XÓA NGƯỜI DÙNG XONG CẦN LOAD LẠI NGƯỜI DÙNG
      } else {
        toast.error("Delete the user error!");
        dispatch(saveUserFailed());
      }
    } catch (e) {
      toast.error("Delete the user error!");
      dispatch(deleteUserFailed());
      console.log("deleteUserFailed error", e);
    }
  };
};

//chính 1 cái action, sau này muốn xử lý action này thì tùy
export const deleteUserSuccess = () => ({
  type: actionTypes.DELETE_USER_SUCCESS,
});

export const deleteUserFailed = () => ({
  type: actionTypes.DELETE_USER_FAILDED,
});

export const editAUser = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await editUserService(data);
      if (res && res.errCode === 0) {
        toast.success("Update the user succeed!!");
        dispatch(editUserSuccess()); // fire action fetchGenderSuccess
        dispatch(fetchAllUsersStart()); //XÓA NGƯỜI DÙNG XONG CẦN LOAD LẠI NGƯỜI DÙNG
      } else {
        toast.error("Update the user error!");
        dispatch(editUserFailed());
      }
    } catch (e) {
      toast.error("Update the user error!");
      dispatch(editUserFailed());
      console.log("EditUserFailed error", e);
    }
  };
};

export const editUserSuccess = () => ({
  type: actionTypes.EDIT_USER_SUCCESS,
});

export const editUserFailed = () => ({
  type: actionTypes.EDIT_USER_FAILDED,
});

export const getAllDoctorsStart = (page, limit) => {
  return async (dispatch, getState) => {
    try {
      let res = await getDoctorsByPage(page, limit);
      if (res && res.err === 0) {
        //js array reverse (javascript)
        console.log("FASFASF", res.doctorData);
        dispatch(getDoctorsSuccess(res.doctorData)); // fire action fetchGenderSuccess// res.users vì res trả về tên biến users ở tab network
      } else {
        toast.error("Fetch all doctors error!");
        dispatch(getDoctorsFail());
      }
    } catch (e) {
      toast.error("Fetch all doctors error!");
      dispatch(getDoctorsFail());
      console.log("getDoctorsFail error", e);
    }
  };
};

export const getDoctorsSuccess = (data) => ({
  type: actionTypes.GET_ALL_DOCTORS_SUCCESS,
  doctors: data?.rows, //truyền 1 đi 1 cái biến có key là users và giá trị của nó là data
  count: data?.count,
  total: data?.rows.length,
});

export const getDoctorsFail = () => ({
  type: actionTypes.GET_ALL_DOCTORS_FAILDED, //xảy ra khi kết nối server, api trả về bị faild
});

export const getPostsLimit = (page) => {
  return async (dispatch, getState) => {
    try {
      let res = await getGetPostsLimitService(page);
      if (res && res.errCode === 0) {
        // console.log("check post", res.data);
        dispatch(getPostsLimitSuccess(res.data));
      } else {
        dispatch(getPostsLimitFailed());
      }
    } catch (e) {
      dispatch(getPostsLimitFailed());
      console.log("getPostsLimitFailed error", e);
    }
  };
};

export const getPostsLimitSuccess = (data) => ({
  type: actionTypes.GET_POSTS_LIMIT_SUCCESS,
  posts: data?.rows,
  count: data?.count,
});
export const getPostsLimitFailed = () => ({
  type: actionTypes.GET_POSTS_LIMIT_FAILDED,
});