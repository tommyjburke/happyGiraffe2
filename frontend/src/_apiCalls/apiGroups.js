const { default: axiosInstance } = require('.')

export const createGroup = async (payload) => {
   try {
      const response = await axiosInstance.post('/api/groups/add-group', payload)
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getAllGroupsByTeacherId = async () => {
   try {
      const response = await axiosInstance.post(
         '/api/groups/get-all-groups-by-teacher-id'
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getAllGroupsByPupilId = async () => {
   try {
      const response = await axiosInstance.post('/api/groups/get-all-groups-by-pupil-id')
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const deleteGroupById = async (payload) => {
   try {
      const response = await axiosInstance.post('/api/groups/delete-group-by-id', payload)
      return response.data
   } catch (error) {
      return error.response.data
   }
}

const updateGroupById = async (payload) => {
   try {
      const response = await axiosInstance.post('/api/groups/update-group-by-id', payload)
      return response.data
   } catch (error) {
      return error.response.data
   }
}
