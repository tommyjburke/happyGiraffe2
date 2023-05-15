const { default: axiosInstance } = require('.')

export const registerUser = async (payload) => {
   try {
      const response = await axiosInstance.post('/api/users/register', payload)
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const loginUser = async (payload) => {
   try {
      const response = await axiosInstance.post('/api/users/login', payload)
      return response.data
   } catch (error) {
      return error.response.data
   }
}

// get token from server, decrypt it, send user info to frontend

export const getUserInfo = async () => {
   try {
      const response = await axiosInstance.post('/api/users/get-user-info')
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const addChild = async (payload) => {
   try {
      const response = await axiosInstance.post('/api/users/add-child', payload)
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getUserConnections = async () => {
   try {
      const response = await axiosInstance.post('/api/users/get-all-connections')
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getUserPupils = async () => {
   try {
      const response = await axiosInstance.post('/api/users/get-my-pupils')
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getAllUsers = async (payload) => {
   try {
      const response = await axiosInstance.post('/api/users/get-all-users', payload)
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getConnectionsByPupilId = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/connections/get-connections-by-pupil-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const addConnection = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/connections/add-connection',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}
