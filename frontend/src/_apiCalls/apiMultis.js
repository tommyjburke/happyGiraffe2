const { default: axiosInstance } = require('.')

// add multi

export const addMulti = async (payload) => {
   try {
      const response = await axiosInstance.post('/api/multi-quiz/add-multi-quiz', payload)
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getAllMathsByTeacherId = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/multi-quiz/get-all-maths-by-teacher-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

// get all multis
export const getAllMultis = async () => {
   try {
      const response = await axiosInstance.post('/api/multi-quiz/get-all-multis')
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getAllMultisByTeacherId = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/multi-quiz/get-all-multis-by-teacher-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

// get multi by id

export const getMultiById = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/multi-quiz/get-multi-by-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

// edit multi by id

export const editMultiById = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/multi-quiz/edit-multi-by-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

// delete multi by id

export const deleteMultiById = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/multi-quiz/delete-multi-by-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

// add question to multi

export const addQuestionToMulti = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/multi-quiz/add-question-to-multi',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const editQuestionById = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/multi-quiz/edit-question-by-id',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const deleteQuestionById = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/multi-quiz/delete-question-in-multi',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}

export const getQuestionById = async (payload) => {
   try {
      const response = await axiosInstance.post(
         '/api/multi-quiz/get-question-in-multi',
         payload
      )
      return response.data
   } catch (error) {
      return error.response.data
   }
}
