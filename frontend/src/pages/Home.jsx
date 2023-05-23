import { Col, message, Row, Space } from 'antd'
import { useEffect, useState } from 'react'

import { getAllMultis, getAllMultisByTeacherId } from '../_apiCalls/apiMultis'

import { getAllMaths, getAllMathsByTeacherId } from '../_apiCalls/apiMaths'
import { HideLoading, ShowLoading } from '../redux/loaderSlice'
//
import { useNavigate } from 'react-router-dom'
import Greeting from '../components/Greeting'
import TakeMathsQuiz from './pupil/TakeMathsQuiz'
import TakeMultiQuiz from './pupil/TakeMultiQuiz'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

export default function Home() {
   const { activeKid } = useSelector((state) => state.activeKid)
   const { user } = useSelector((state) => state.users)
   const [mathsQuizzes, setMathsQuizzes] = useState([])
   const [multis, setMultis] = useState([])
   const [selectedMultiId, setSelectedMultiId] = useState(null)
   const [showMultiQuiz, setShowMultiQuiz] = useState(false)
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const opts = ['x', '/', '+', '-']
   const [selectedMathsQuizId, setSelectedMathsQuizId] = useState(null)
   const [showMathsQuiz, setShowMathsQuiz] = useState(false)

   //
   const userState = useSelector((state) => state.users)

   if (activeKid) {
      navigate(`/pupil/homework`)
   }

   const startMathsQuiz = (quizId) => {
      setSelectedMathsQuizId(quizId)
      setShowMathsQuiz(true)
   }

   const startMultiQuiz = (multiId) => {
      setSelectedMultiId(multiId)
      setShowMultiQuiz(true)
   }

   // retrieve multiple choice quizzes
   const getMultis = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getAllMultisByTeacherId()
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
         const response = await getAllMathsByTeacherId()
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
               <Greeting title='Home: Homework' />

               <div className='divider'></div>
               <Row gutter={[14, 14]}>
                  {multis.map((multi) => (
                     <Col span={6}>
                        <div className='card2  flex flex-col gap-1 p-2'>
                           <div key={multi._id}>
                              <h4 className='blueFont bordered2 !important'>
                                 {multi?.type && 'MULTIPLE CHOICE'}
                              </h4>
                              <h4>
                                 <u>{multi?.title}</u>
                              </h4>
                              <h3>Questions: {multi.questions.length}</h3>
                              <h3>
                                 {/* Timer: {mathsQuiz.gameOptions.countdownSeconds} */}
                                 {!multi.useCountdown && 'No Timer'}
                                 {multi.useCountdown && (
                                    <>Timer: {multi.countdownSeconds}</>
                                 )}
                              </h3>
                              <button
                                 disabled={multi.questions.length == 0 ? true : false}
                                 className={
                                    multi.questions.length == 0
                                       ? 'greyButton2'
                                       : 'brownButton2'
                                 }
                                 // onClick={() =>
                                 //    navigate(`/pupil/multi-quiz/${multi._id}`)
                                 // }
                                 onClick={() => {
                                    startMultiQuiz(multi._id)
                                    console.log(multi._id)
                                 }}
                              >
                                 Start Quiz
                              </button>
                              {showMultiQuiz && (
                                 <TakeMultiQuiz
                                    quizId={selectedMultiId}
                                    onClose={() => setShowMultiQuiz(false)}
                                 />
                              )}
                           </div>
                           {moment(multi.updatedAt).fromNow()}
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
                                       onClick={() => startMathsQuiz(mathsQuiz._id)}
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
                           {moment(mathsQuiz.updatedAt).fromNow()}
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
            <div className='container'>
               <Space wrap>
                  <button
                     type='default'
                     // style={{ background: 'red !important', borderColor: 'yellow' }}
                     onClick={() => navigate('/teacher/add-maths')}
                     className='yellowRedButton'
                  >
                     + CREATE MATHS QUIZ
                  </button>
                  <br />

                  {/* <button
                     className='yellowBlueButton'
                     onClick={() => navigate('/teacher/add-multi')}
                  >
                     + CREATE MULTIPLE CHOICE
                  </button> */}
               </Space>
            </div>
         </div>
      )
   }
}
