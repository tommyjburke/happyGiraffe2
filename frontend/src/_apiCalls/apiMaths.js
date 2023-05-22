const { default: axiosInstance } = require('.')

// add mathsQuiz
export const addMathsQuiz = async (divsData, gameOptions) => {
   try {
      const response = await axiosInstance.post('/api/maths-quiz/add-maths-quiz', {
         divsData,
         gameOptions,
      })
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getAllMathsByTeacherId = async (userId) => {
   try {
      const response = await axiosInstance.post(
         '/api/maths-quiz/get-all-maths-by-teacher-id',
         { userId }
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

// get all mathsQuizzes
export const getAllMaths = async () => {
   try {
      const response = await axiosInstance.post('/api/maths-quiz/get-all-maths')
      return response.data
   } catch (error) {
      return error.response.data
   }
}

// // get mathsQuiz by id

export const getMathsById = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/maths-quiz/get-maths-by-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const deleteMathsById = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/maths-quiz/delete-maths-by-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const updateMathsById = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/maths-quiz/update-maths-by-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}
