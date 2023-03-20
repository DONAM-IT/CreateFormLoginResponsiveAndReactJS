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

export { handleLoginApi, getAllUsers };
