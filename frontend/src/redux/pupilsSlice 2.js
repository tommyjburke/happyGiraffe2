import { createSlice } from '@reduxjs/toolkit'

const pupilsSlice = createSlice({
   name: 'pupils',
   initialState: {
      pupils: [],
      activePupil: null,
   },
   reducers: {
      setPupils: (state, action) => {
         state.pupils = action.payload
      },
      setActivePupil: (state, action) => {
         state.activePupil = action.payload
      },
   },
})

export const { setPupils, setActivePupil } = pupilsSlice.actions
export default pupilsSlice.reducer
