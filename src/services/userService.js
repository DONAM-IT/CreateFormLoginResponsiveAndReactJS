import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) => {
  console.log(userEmail);
  console.log(userPassword);
  return axios.post("/api/login", { email: userEmail, password: userPassword });
};

const getAllUsers = (inputId) => {
  // cú pháp template string là dùng 2 dấu ``
  return axios.get(`/api/get-all-users?id=${inputId}`);
};

const createNewUserService = (data) => {
  console.log("check data from service : ", data);
  return axios.post(`/api/create-new-user`, data);
};

const deleteUserService = (userId) => {
  // return axios.delete(`/api/delete-user`, { id: userId });
  return axios.delete(`/api/delete-user`, {
    data: {
      id: userId,
    },
  });
};

const editUserService = (inputData) => {
  return axios.put(`/api/edit-user`, inputData);
};

const getAllCodeService = (inputType) => {
  return axios.get(`/api/allcode?type=${inputType}`);
};

const getGetPostsLimitService = (page) => {
  return axios.get(`/api/v1/post/limit?page=${page}`);
};

const getDoctorsByPage = (page, limit) => {
  return axios.get(`/api/v1/doctors/?limit=${limit}&page=${page}`);
};

export {
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getDoctorsByPage,
  getGetPostsLimitService,
};
