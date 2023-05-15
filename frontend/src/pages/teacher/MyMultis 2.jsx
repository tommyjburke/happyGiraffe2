import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import PageTitle from '../../components/PageTitle'
import { Table } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getAllMultis, deleteMultiById } from '../../_apiCalls/apiMultis'
import { getAllMaths } from '../../_apiCalls/apiMaths'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { Radio, Tabs } from 'antd'

export default function MyQuizzes() {
   const navigate = useNavigate()
   const [multis, setMultis] = useState([])
   const [maths, setMaths] = useState([])

   const dispatch = useDispatch()

   // MUST COMPLY WITH QUIZ MODEL IN BACKEND
   const multiColumns = [
      {
         title: 'Quiz Title',
         dataIndex: 'title',
         key: 'title',
      },
      {
         title: 'Date Created',
         dataIndex: 'createdAt',
         key: 'createdAt',
         render: (createdAt) => new Date(createdAt).toLocaleDateString(),
      },

      {
         title: 'Num Questions',
         dataIndex: 'questions',
         render: (questions) => (questions ? questions.length : 0),
      },
      // {
      //    title: 'Duration',
      //    dataIndex: 'duration',
      // },
      // {
      //    title: 'Use',
      //    dataIndex: 'category',
      // },
      {
         title: 'Use Countdown',
         dataIndex: 'useCountdown',
         key: 'useCountdown',
         render: (useCountdown) => (useCountdown ? 'Yes' : 'No'),
      },
      {
         title: 'Timer',
         dataIndex: 'countdownSeconds',
         key: 'countdownSeconds',
         render: (countdownSeconds, record) =>
            record.useCountdown ? countdownSeconds + 's' : 'N/A',
      },
      {
         // delete and edit //
         title: 'Action',
         dataIndex: 'action',
         render: (text, record) => (
            <div className='flex gap-3'>
               <i
                  className='ri-edit-line'
                  onClick={() => navigate(`/teacher/quiz/edit-quiz-by-id/${record._id}`)}
               ></i>

               <i
                  className='ri-delete-bin-line'
                  onClick={() => deleteMulti(record._id)}
               ></i>
            </div>
         ),
      },
   ]

   const getMultisData = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getAllMultis()
         dispatch(HideLoading())
         if (response.success) {
            setMultis(response.data)
            console.log('MultiData: ', response.data)
         } else {
            message.error(response.message)
         }
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   const deleteMulti = async (multiId) => {
      try {
         dispatch(ShowLoading())
         const response = await deleteMultiById({
            multiId,
         })
         dispatch(HideLoading())
         if (response.success) {
            message.success(response.message)
            getMultisData()
         } else {
            message.error(response.message)
         }
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   useEffect(() => {
      getMultisData()

      // eslint-disable-next-line
   }, [])

   return (
      <div>
         <div className='flex justify-between mt-2'>
            <h1>My Multiple Choice Quizzes</h1>

            {/* <button
               className='chooseButton flex items-center'
               onClick={() => navigate('/teacher/quiz/add')}
            >
               <i className='ri-add-line'></i>MULTIPLE CHOICE
            </button>
            <button
               className='chooseButton flex items-center'
               onClick={() => navigate('/teacher/quiz/add-maths')}
            >
               +MATHS QUIZ
            </button> */}
         </div>
         <div className='divider'></div>

         <Table columns={multiColumns} dataSource={multis} />
      </div>
   )
}
