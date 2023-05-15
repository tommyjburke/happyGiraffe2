const { default: axiosInstance } = require('.')

// add multi-result
export const addMultiResult = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/multi-result/add-multi-result',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

// get all multiResults
export const getAllMultiResult = async (filters) => {
   try {
      const response = await axiosInstance.post(
         '/api/multi-result/get-all-multi-result',
         filters
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

// get all multiResults by user
export const getAllMultiResultByUser = async () => {
   try {
      const response = await axiosInstance.post(
         '/api/multi-result/get-all-multi-result-by-user'
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

// delete multi-result by id

// export const deleteReportById = async (payload) => {
//    try {
//       const response = await axiosInstance.post('/api/multis/delete-multi-result-by-id', payload)
//       return response.data
//    } catch (error) {
//       return error.response.data
//    }
// }

// function to delete multi-result by id
export const deleteMultiResultById = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/multi-result/delete-multi-result-by-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}
