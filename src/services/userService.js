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
export { handleLoginApi, getAllUsers, createNewUserService, deleteUserService };
