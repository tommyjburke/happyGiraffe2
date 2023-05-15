import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'

import './_stylesheets/theme.css'
import './_stylesheets/alignments.css'
import './_stylesheets/textelements.css'
import './_stylesheets/custom-components.css'
import './_stylesheets/form-elements.css'
import './_stylesheets/layout.css'
import './_stylesheets/MathStyles.css'
import './_stylesheets/antd-styles.css'

import Register from './pages/Register'
import Login from './pages/Login.jsx.jsx'
import ProtectedRoute from './components/ProtectedRoute'
import logo from './_media/logo.png'

import QuizDashboard from './pages/teacher/QuizDashboard'
import AddUpdateMulti from './pages/teacher/AddUpdateMulti'
import background from './_media/giraffe_background5.png'
import Loading from './components/Loading'
import { useSelector } from 'react-redux'

import PupilResults from './pages/pupil/PupilResults'
import AdminMultiResults from './pages/teacher/ResultsDashboard'
import CreateMulti from './pages/teacher/CreateMulti'

import ResultsDashboard from './pages/teacher/ResultsDashboard'
import TakeMultiQuiz from './pages/pupil/TakeMultiQuiz'
import Home from './pages/Home'
import Footer from './components/Footer'
import Search from './components/Search'
import PupilsDashboard from './pages/teacher/PupilsDashboard'

import AddMathsQuiz from './pages/teacher/AddMathsQuiz'

import MyProfile from './pages/teacher/MyProfile'
import NavBar from './components/NavBar'
import UpdateMathsQuiz from './pages/teacher/UpdateMathsQuiz'
import FindTeacher from './pages/pupil/FindTeacher'
import PupilHomework from './pages/pupil/PupilHomework'
import NotFound from './components/NotFound'
import MyAssignments from './pages/teacher/MyAssignments'
import SetAssignment from './pages/teacher/SetAssignment'
import Homework from './pages/pupil/Homework'

// style={{ backgroundImage: `url(${background})` }}

function App() {
   const { loading } = useSelector((state) => state.loader)
   const [duration, setDuration] = useState(60)
   // const navigate = useNavigate()

   const routes = [
      // COMMON ROUTES
      { path: '/login', component: Login },
      { path: '/register', component: Register },
      { path: '/createmulti', component: CreateMulti },
      { path: '/createmaths', component: AddMathsQuiz },

      // PUPIL ROUTES
      { path: '/', component: Home, isProtected: true },
      { path: '/pupil/multi-quiz/:id', component: TakeMultiQuiz, isProtected: true },
      { path: '/pupil/maths-quiz/:id', component: TakeMultiQuiz, isProtected: true },
      { path: '/pupil/myresults/', component: PupilResults, isProtected: true },
      { path: '/pupil/find-teacher/', component: FindTeacher, isProtected: true },
      { path: '/pupil/homework/', component: Homework, isProtected: true },

      // TEACHER ROUTES
      { path: '/teacher/quiz', component: QuizDashboard, isProtected: true },
      {
         path: '/teacher/pupils-dashboard',
         component: PupilsDashboard,
         isProtected: true,
      },
      { path: '/teacher/add-multi', component: AddUpdateMulti, isProtected: true },
      { path: '/teacher/add-maths', component: AddMathsQuiz, isProtected: true },
      { path: '/teacher/profile', component: MyProfile, isProtected: true },
      // { path: '/teacher/set-assignment', component: SetAssignment, isProtected: true },
      {
         path: '/teacher/edit-multi-by-id/:id',
         component: AddUpdateMulti,
         isProtected: true,
      },
      {
         path: '/teacher/edit-maths-by-id/:id',
         component: UpdateMathsQuiz,
         isProtected: true,
      },
      { path: '/teacher/assignments', component: MyAssignments, isProtected: true },
      { path: '/teacher/results', component: ResultsDashboard, isProtected: true },
      // Catch-all route
   ]

   return (
      <>
         {loading && <Loading />}

         <ConfigProvider
            theme={{
               token: {
                  // fontFamily: 'Delicious Handrawn',
                  colorPrimary: '#654321',
                  backgroundAttachment: 'fixed',
               },
               components: {
                  Slider: {
                     colorPrimary: '#654321',
                     railStyle: {
                        backgroundColor: 'orange',
                     },
                  },
               },
            }}
         >
            {/* className='giraffe_background h-screen bg-primary ' style={{ backgroundImage: `url(${background})` }} */}
            <div className='giraffe_background h-screen bg-primary '>
               {/* <NavBar /> */}
               <BrowserRouter>
                  <Routes>
                     {routes.map((route) => (
                        <Route
                           key={route.path}
                           path={route.path}
                           element={
                              route.isProtected ? (
                                 <ProtectedRoute>
                                    <route.component />
                                 </ProtectedRoute>
                              ) : (
                                 <route.component />
                              )
                           }
                        />
                     ))}
                     <Route path='*' element={<NotFound />} />
                  </Routes>
               </BrowserRouter>
               <Footer />
            </div>
         </ConfigProvider>
      </>
   )
}

export default App
