import { createSlice } from '@reduxjs/toolkit'

const usersSlice = createSlice({
   name: 'users',
   initialState: {
      user: null,
      // activeProfile: null,
   },
   reducers: {
      setUser: (state, action) => {
         state.user = action.payload
         // state.activeProfile = null // reset active profile when switching user
      },
   },
})

export const { setUser } = usersSlice.actions
export default usersSlice.reducer

// import { createSlice } from '@reduxjs/toolkit'

// const usersSlice = createSlice({
//    name: 'users',
//    initialState: {
//       user: null,
//       activeProfile: null,
//       pupils: [], // add pupils to the initial state with an empty array as default
//    },
//    reducers: {
//       setUser: (state, action) => {
//          state.user = action.payload.user
//          state.activeProfile = action.payload.activeProfile
//          state.pupils = [] || action.payload.pupils // assign an empty array as the default value for pupils
//       },
//       setActiveProfile: (state, action) => {
//          state.activeProfile = action.payload
//       },
//    },
// })

// export const { setUser, setActiveProfile } = usersSlice.actions
// export default usersSlice.reducer
