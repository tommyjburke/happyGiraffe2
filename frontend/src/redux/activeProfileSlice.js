import { createSlice } from '@reduxjs/toolkit'

// const activeProfileSlice = createSlice({
//    name: 'activeProfile',
//    initialState: {
//       activeProfile: null,
//    },
//    reducers: {
//       setActiveProfile: (state, action) => {
//          state.activeProfile = action.payload // reset active profile when switching user
//       },
//    },
// })

// export const { setActiveProfile } = activeProfileSlice.actions
// export default activeProfileSlice.reducer

// const activeProfileSlice = createSlice({
//    name: 'activeProfile',
//    initialState: {
//       activeProfile: localStorage.getItem('activeProfile') || null,
//    },
//    reducers: {
//       setActiveProfile: (state, action) => {
//          state.activeProfile = action.payload
//          localStorage.setItem('activeProfile', action.payload)
//       },
//    },
// })

// export const { setActiveProfile } = activeProfileSlice.actions
// export default activeProfileSlice.reducer

// const activeProfileSlice = createSlice({
//    name: 'activeProfile',
//    initialState: {

//       activeProfile: JSON.parse(localStorage.getItem('activeProfile')) || null,
//    },
//    reducers: {
//       setActiveProfile: (state, action) => {
//          state.activeProfile = action.payload

//          localStorage.setItem('activeProfile', JSON.stringify(action.payload))
//       },
//    },
// })

// export const { setActiveProfile } = activeProfileSlice.actions
// export default activeProfileSlice.reducer

const activeProfileSlice = createSlice({
   name: 'activeProfile',
   initialState: {
      activeProfile: localStorage.getItem('activeProfile') || null,
   },
   reducers: {
      setActiveProfile: (state, action) => {
         state.activeProfile = action.payload
         // localStorage.setItem('activeProfile', action.payload)
         localStorage.setItem('activeProfile', JSON.stringify(action.payload))
      },
   },
})

export const { setActiveProfile } = activeProfileSlice.actions
export default activeProfileSlice.reducer
