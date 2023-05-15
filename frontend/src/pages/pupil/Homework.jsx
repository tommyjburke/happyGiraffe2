import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ShowLoading, HideLoading } from '../../redux/loaderSlice'
import { getAllAssignmentsByPupilId } from '../../_apiCalls/apiAssignments'
import { message, Col, Row } from 'antd'
import TakeMathsQuiz from './TakeMathsQuiz'
import TakeMultiQuiz from './TakeMultiQuiz'
import Greeting from '../../components/Greeting'
import moment from 'moment'

function Homework() {
   const { activeKid } = useSelector((state) => state.activeKid)
   const [error, setError] = useState(null)
   const dispatch = useDispatch()
   const pupilId = activeKid.pupilId
   // console.log('ACITVEKID ', activeKid)
   // console.log('PUPILID ', pupilId)
   const [selectedMultiId, setSelectedMultiId] = useState(null)
   const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
   const [showMultiQuiz, setShowMultiQuiz] = useState(false)
   const [selectedMathsQuizId, setSelectedMathsQuizId] = useState(null)
   const [showMathsQuiz, setShowMathsQuiz] = useState(false)
   const [noHomework, setNoHomework] = useState(false)

   const [assignments, setAssignments] = useState([])

   function startMultiQuiz(quizId, assignmentId) {
      console.log('START MULTI QUIZ CALLED')
      console.log('ASSIGNMENT ID ', assignmentId)
      setSelectedAssignmentId(assignmentId)
      setSelectedMultiId(quizId)
      setShowMultiQuiz(true)
   }

   const startMathsQuiz = (quizId, assignmentId) => {
      setSelectedAssignmentId(assignmentId)
      setSelectedMathsQuizId(quizId)
      setShowMathsQuiz(true)
   }

   const getAllAssignments = async () => {
      const pupilId2 = { pupilId }

      try {
         dispatch(ShowLoading())
         let response = await getAllAssignmentsByPupilId(pupilId2)

         if (response.success) {
            setAssignments(response.data)
            // console.log('ASSIGNMENTS ', response.data)
         } else {
            message.error(response.message)
         }

         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
         console.log(error.message)
      }
      // console.log('GET HOEMWOWRK CALLED')
   }

   function tidyUp(assignment) {
      // console.log('TIDY ASSIGNMENT ', assignment._id)
      // console.log('TIDY QUIZID ', assignment.quizId)
      // console.log('TIDY PUPILID ', pupilId)
      //
      //
      console.log('TIDY ASSIGNMENT ', assignment)
      console.log('ASSIGNMENT LENGTH ', assignment?.length)
      console.log('ASSIGNMENT QUIZ ', assignment?.quiz ? true : false)
      if (assignment?.quiz === undefined) {
         return (
            <div style={{ backgroundColor: 'lightgray' }}>
               <h3>
                  {assignment.quizType}
                  <br />
               </h3>
               <h3>MISSING HOMEWORK: </h3>

               <h3> {assignment.assignmentTitle}</h3>
               <br />
               <h3>
                  Tell Teacher: <br /> {assignment.teacher}
               </h3>
               <h4>(to delete assignment)</h4>
            </div>
         )
      } else if (assignment.quizType === 'multi') {
         return (
            <div>
               <h6 className='teacher'>From: {assignment.teacher}</h6>
               <h5>{assignment.assignmentTitle}</h5>
               <h4 className='blueFont bordered2 !important'>MULTIPLE CHOICE</h4>
               <h4 className='greenFont'>
                  <b>
                     <u>{assignment?.quiz.title}</u>
                  </b>
               </h4>

               <h4>No.Questions: {assignment?.quiz.questions.length}</h4>
               {!assignment?.quiz.useCountdown && 'No Timer'}
               {assignment?.quiz.useCountdown && (
                  <span className='useCountdown'>
                     Timer: {assignment?.quiz.countdownSeconds}s
                  </span>
               )}

               <button
                  // disabled={assignment?.quiz.questions.length == 0 ? true : false}
                  className={
                     assignment?.quiz.questions.length == 0
                        ? 'greyButton2 '
                        : 'brownButton2 '
                  }
                  onClick={() => {
                     let quizId = assignment.quizId
                     let assignmentId = assignment._id
                     console.log('ASSIGNMENT ID ', assignmentId)
                     console.log('QUIZ ID ', quizId)

                     startMultiQuiz(quizId, assignmentId)
                     console.log(error)
                  }}
               >
                  Start Quiz
               </button>
               {moment(assignment.updatedAt).fromNow()}
            </div>
            // </>
         )
      }
      if (assignment.quizType === 'multi' && !assignment.quiz.gameOptions) {
         return <div>{`No quiz found for ${assignment.assignmentTitle} quiz`}</div>
      }

      if (assignment.quizType === 'maths') {
         return (
            <div>
               <h6 className=' teacher'>From: {assignment.teacher}</h6>
               <h5>{assignment.assignmentTitle}</h5>
               <h4 className='redFont bordered2 !important'>MATHS CHOICE</h4>
               <h4 className='greenFont'>
                  <b>
                     <u>{assignment?.quiz.gameOptions.title}</u>
                  </b>
               </h4>
               <h4>No.Questions: {assignment?.quiz.gameOptions.numQuestions}</h4>
               {!assignment?.quiz.gameOptions.useCountdown && 'No Timer'}
               {assignment?.quiz.gameOptions.useCountdown && (
                  <>
                     {' '}
                     <span className='useCountdown'>
                        Timer: {assignment?.quiz.gameOptions.countdownSeconds}s
                     </span>
                     <br />
                  </>
               )}

               <button
                  className='brownButton2'
                  onClick={() => {
                     let quizId = assignment.quizId
                     let assignmentId = assignment._id
                     // console.log('ASSIGNMENT ID ', assignmentId)
                     // console.log('QUIZ ID ', quizId)
                     startMathsQuiz(quizId, assignmentId)
                     // console.log(assignment.quizId)
                  }}
               >
                  Start Quiz
               </button>
               {moment(assignment.updatedAt).fromNow()}
            </div>
            // </>
         )
      }
   }

   useEffect(() => {
      setAssignments([])
      getAllAssignments()
   }, [pupilId])

   console.log(assignments)

   if (activeKid && !assignments) {
      return <div>NO ASSIGNMENTS FOUND</div>
   }

   //    const stringAssignments = JSON.stringify(assignments)
   if (activeKid && assignments) {
      return (
         <div>
            <Greeting title='Home: Homework' />
            <h2 className='greenFont'>{activeKid && activeKid.name}</h2>
            <div className='divider'></div>
            {/* NO HOMEWORK STATE: {JSON.stringify(noHomework)}
            ASSIGNMENTS LENGTH: {JSON.stringify(assignments.length)} */}
            {assignments?.length == 0 && (
               <>
                  <br />
                  <br />
                  <div className='card3  '>
                     <br />
                     <br />
                     <h2 style={{ color: 'blue' }}>
                        {' '}
                        {activeKid.name} has no homework <br />
                        at the moment
                     </h2>
                     <br />
                     <br />
                  </div>
               </>
            )}
            {showMultiQuiz && (
               <TakeMultiQuiz
                  assignmentId={selectedAssignmentId}
                  quizId={selectedMultiId}
                  onClose={() => setShowMultiQuiz(false)}
               />
            )}
            {showMathsQuiz && (
               <TakeMathsQuiz
                  assignmentId={selectedAssignmentId}
                  quizId={selectedMathsQuizId}
                  onClose={() => setShowMathsQuiz(false)}
               />
            )}
            <Row gutter={[14, 14]}>
               {assignments.map((assignment) => (
                  <Col span={6}>
                     <div className='card2  flex flex-col gap-1 p-2'>
                        <div key={assignment._id}>{tidyUp(assignment)}</div>
                     </div>
                  </Col>
               ))}
            </Row>
         </div>
      )
   } else {
      return (
         <>
            <div>
               <h1>NO KID SELECTED</h1>
            </div>

            <div>
               <h1>{activeKid?.name}'s HOMEWORK</h1>
               <h2>ID: {pupilId}</h2>
               <button onClick={getAllAssignments}>GET HOMEWORK</button>
               {JSON.stringify(assignments)}
               <p></p>
               {/* <h1>Homework for {activeKid.name}</h1> */}
               {/* <div>{JSON.stringify(assignments)}</div> */}
            </div>
         </>
      )
   }
}

export default Homework
