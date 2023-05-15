const { default: axiosInstance } = require('.')

// add result
export const addMathsResult = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/maths-result/add-maths-result',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

// get all results
export const getAllMathsResult = async (filters) => {
   try {
      const response = await axiosInstance.post(
         '/api/maths-result/get-all-maths-results',
         filters
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

// get all results by user
export const getAllMathsResultByUser = async (userId) => {
   try {
      const response = await axiosInstance.post(
         '/api/maths-result/get-all-maths-results-by-user',
         {
            userId: userId,
         }
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getAllMathsResultByPupilId = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/maths-result/get-all-maths-results-by-pupil-id',
         payload
      )

      return response.data
   } catch (error) {
      return error.response.data
   }
}

// delete result by id

// export const deleteResultById = async (payload) => {
//    try {
//       const response = await axiosInstance.post('/api/multis/delete-result-by-id', payload)
//       return response.data
//    } catch (error) {
//       return error.response.data
//    }
// }

// function to delete result by id
export const deleteMathsResultById = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/maths-result/delete-maths-result-by-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getAllMathsResultByAssignmentIdViaTeacherId = async () => {
   try {
      const response = await axiosInstance.post(
         '/api/maths-result/get-all-maths-results-by-teacher-id'
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}
