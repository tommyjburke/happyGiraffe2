import { configureStore } from '@reduxjs/toolkit'
import usersSlice from './usersSlice'
import loaderSlice from './loaderSlice'
import kidsSlice from './kidsSlice'
import activeKidSlice from './activeKidSlice'
// import pupilsSlice from './pupilsSlice'
// import activeProfileSlice from './activeProfileSlice'

const store = configureStore({
   reducer: {
      users: usersSlice,
      loader: loaderSlice,
      kids: kidsSlice,
      activeKid: activeKidSlice,
   },
})

export default store
