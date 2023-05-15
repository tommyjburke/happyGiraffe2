// import { createSlice } from '@reduxjs/toolkit'

// const kidsSlice = createSlice({
//    name: 'kids',
//    initialState: {
//       kids: [],
//       activeKid: JSON.parse(localStorage.getItem('activeKid')) || null,
//    },
//    reducers: {
//       setKids: (state, action) => {
//          state.kids = action.payload
//       },
//       setActiveKid: (state, action) => {
//          state.activeKid = action.payload
//          if (action.payload === null) {
//             localStorage.removeItem('activeKid')
//          } else {
//             localStorage.setItem('activeKid', JSON.stringify(action.payload))
//          }
//       },
//    },
// })

// export const { setKids, setActiveKid } = kidsSlice.actions
// export default kidsSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

const kidsSlice = createSlice({
   name: 'kids',
   initialState: {
      kids: [],
   },
   reducers: {
      setKids: (state, action) => {
         state.kids = action.payload
      },
   },
})

export const { setKids } = kidsSlice.actions
export default kidsSlice.reducer
