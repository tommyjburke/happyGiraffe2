import { Col, message, Row } from 'antd'
import { useEffect, useState } from 'react'

import { getAllMultis } from '../../_apiCalls/apiMultis'
import { getAllMaths } from '../../_apiCalls/apiMaths'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
//
import { useNavigate } from 'react-router-dom'
import Greeting from '../../components/Greeting'
import TakeMathsQuiz from './TakeMathsQuiz'
import { useDispatch, useSelector } from 'react-redux'

export default function PupilHomework() {
   const { user } = useSelector((state) => state.users)
   const { activeKid } = useSelector((state) => state.activeKid)
   const [mathsQuizzes, setMathsQuizzes] = useState([])
   const [multis, setMultis] = useState([])
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const [selectedMathsQuizId, setSelectedMathsQuizId] = useState(null)
   const [showMathsQuiz, setShowMathsQuiz] = useState(false)
   const opts = ['*', '/', '+', '-']

   const userState = useSelector((state) => state.users)

   console.log('userState', userState) // log the user state to the console
   console.log('user', user)

   const handleStartMathsQuiz = (quizId) => {
      setSelectedMathsQuizId(quizId)
      setShowMathsQuiz(true)
   }

   // retrieve multiple choice quizzes
   const getMultis = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getAllMultis()
         if (response.success) {
            setMultis(response.data)
         } else {
            message.error(response.message)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   const getMaths = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getAllMaths()
         if (response.success) {
            setMathsQuizzes(response.data)
         } else {
            message.error(response.message)
         }
         dispatch(HideLoading())
         // console.log(response.data)
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   useEffect(() => {
      getMultis()
      getMaths()
   }, [])

   if (user) {
      return (
         user && (
            <div>
               Poo
               {activeKid && activeKid.name}
               <Greeting title='Home: Homework ______' />
               <div className='divider'></div>
               <Row gutter={[8, 8]}>
                  {multis.map((multi) => (
                     <Col span={6}>
                        <div className='card2  flex flex-col gap-1 p-2'>
                           <h4 className='blueFont bordered2 !important'>
                              {multi?.type && 'MULTIPLE CHOICE'}
                           </h4>
                           <h4>
                              <u>{multi?.name}</u>
                           </h4>

                           <h1 className='text-md'>Category : {multi.category}</h1>

                           <h1 className='text-md'>Total Marks : {multi.totalMarks}</h1>
                           <h1 className='text-md'>
                              Passing Marks : {multi.passingMarks}
                           </h1>
                           <h1 className='text-md'>Timer : {multi.duration}</h1>

                           <button
                              className='brownButton2'
                              onClick={() => navigate(`/pupil/multi-quiz/${multi._id}`)}
                           >
                              Start Quiz
                           </button>
                        </div>
                     </Col>
                  ))}

                  {mathsQuizzes.map((mathsQuiz) => (
                     <Col span={6}>
                        <div className='card2  flex flex-col gap-1 p-2'>
                           <div key={mathsQuiz._id}>
                              {mathsQuiz.gameOptions && (
                                 <div>
                                    <h4 className='redFont bordered2'>
                                       {mathsQuiz.type && 'MATHS'}
                                    </h4>
                                    <h4>
                                       <u>{mathsQuiz.gameOptions.title}</u>
                                    </h4>
                                    <h3>
                                       Questions: {mathsQuiz.gameOptions.numQuestions}
                                    </h3>
                                    <h3>
                                       {/* Timer: {mathsQuiz.gameOptions.countdownSeconds} */}
                                       {!mathsQuiz.gameOptions.useCountdown && 'No Timer'}
                                       {mathsQuiz.gameOptions.useCountdown && (
                                          <>
                                             Timer:{' '}
                                             {mathsQuiz.gameOptions.countdownSeconds}
                                          </>
                                       )}
                                    </h3>
                                    <h3 className='text-md'>
                                       Math types: [
                                       {mathsQuiz.gameOptions.operators
                                          .map((op) => opts[op])
                                          .join(', ')}
                                       ]
                                    </h3>
                                    <button
                                       className='brownButton2'
                                       onClick={() => handleStartMathsQuiz(mathsQuiz._id)}
                                    >
                                       Start Quiz
                                    </button>
                                    {showMathsQuiz && (
                                       <TakeMathsQuiz
                                          quizId={selectedMathsQuizId}
                                          onClose={() => setShowMathsQuiz(false)}
                                       />
                                    )}
                                 </div>
                              )}
                           </div>
                        </div>
                     </Col>
                  ))}
               </Row>
            </div>
         )
      )
   } else {
      return (
         <div>
            <div className='divider'></div>
            <Greeting />
            You have not signed in. <br />
            Use the navigation to sign in, <br />
            or create a quiz that cannot be saved <br />
            nor shared with other users.
         </div>
      )
   }
}
