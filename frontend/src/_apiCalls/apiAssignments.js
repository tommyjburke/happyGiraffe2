const { default: axiosInstance } = require('.')

export const createAssignment = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/assignments/add-assignment',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getDataToSetAssignmentByUserId = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/assignments/get-multis-maths-groups',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getAllAssignmentsByTeacherId = async (payload) => {
   try {
      console.log('payload', payload)
      const response = await axiosInstance.post(
         '/api/assignments/get-assignments-by-teacher-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getAllAssignmentsByPupilId = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/assignments/get-assignments-by-pupil-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getAllAssignmentsByGroupId = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/assignments/get-all-assignments-by-group-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const deleteAssignmentById = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/assignments/delete-assignment-by-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getAssignmentStatusForAllPupils = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/assignments/get-assignment-status-for-all-pupils',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}
