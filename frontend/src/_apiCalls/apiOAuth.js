const { default: axiosInstance } = require('.')

export const loginGoogle = async (payload) => {
   try {
      const response = await axiosInstance.post('/api/auth/login-google', payload)
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const loginFacebook = async (payload) => {
   try {
      const response = await axiosInstance.post('/api/auth/login-facebook', payload)
      return response.data
   } catch (error) {
      return error.response.data
   }
}
