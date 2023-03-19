import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) => {
  console.log(userEmail);
  console.log(userPassword);
  return axios.post("/api/login", { email: userEmail, password: userPassword });
};

export { handleLoginApi };
