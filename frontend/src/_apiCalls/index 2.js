// after registration success we get Token, needed to send token inside axios Headers.
// creating an axios instance seperately where will be put the header every time
// by default the header will be sent to the backend server

import axios from "axios"

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})

export default axiosInstance
