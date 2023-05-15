import { createSlice } from '@reduxjs/toolkit'

const activeKidSlice = createSlice({
   name: 'activeKid',
   initialState: {
      activeKid: JSON.parse(localStorage.getItem('activeKid')) || null,
   },
   reducers: {
      setActiveKid: (state, action) => {
         state.activeKid = action.payload
         if (action.payload === null) {
            localStorage.removeItem('activeKid')
         } else {
            localStorage.setItem('activeKid', JSON.stringify(action.payload))
         }
      },
   },
})

export const { setActiveKid } = activeKidSlice.actions
export default activeKidSlice.reducer
