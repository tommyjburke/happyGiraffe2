const { default: axiosInstance } = require('.')

export const addPupil = async (payload) => {
   try {
      const response = await axiosInstance.post('/api/pupils/add-pupil', payload)
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const findTeacher = async (payload) => {
   try {
      const response = await axiosInstance.post('/api/pupils/find-teacher', payload)
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const deletePupil = async (payload) => {
   try {
      const response = await axiosInstance.post('/api/pupils/delete-pupil', payload)
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const updatePupil = async (payload) => {
   try {
      const response = await axiosInstance.post('/api/pupils/update-pupil', payload)
      return response.data
   } catch (error) {
      return error.response.data
   }
}
