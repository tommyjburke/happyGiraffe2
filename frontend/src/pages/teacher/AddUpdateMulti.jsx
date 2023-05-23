import { Form, message, Table, Tabs, Checkbox, Input } from 'antd'

import {
   addMulti,
   deleteQuestionById,
   editMultiById,
   getMultiById,
} from '../../_apiCalls/apiMultis'
import { useNavigate, useParams } from 'react-router-dom'

import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import AddUpdateQuestion from './AddUpdateQuestion'
import moment from 'moment'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // import the quill styles

export default function AddUpdateQuiz() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const params = useParams()

   // SETTING STATES:
   const [multiData, setMultiData] = useState(null)
   const [showQuestionModal, setShowQuestionModal] = useState(false)
   const [selectedQuestion, setSelectedQuestion] = useState(null)
   const [title, setTitle] = useState('' || multiData?.title)
   const [useCountdown, setUseCountdown] = useState(multiData?.useCountdown || true)

   console.log('MULTI DATA: ', multiData)
   console.log('useCountdown: ', useCountdown)
   console.log('useCountdown: ', multiData?.useCountdown)

   const [countdownSeconds, setCountdownSeconds] = useState(
      multiData?.countdownSeconds || 30
   )

   console.log('countdownSeconds: ', countdownSeconds)
   const [notes, setNotes] = useState('' || multiData?.notes)
   const [content, setContent] = useState('' || multiData?.notes)

   const getMultiData = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getMultiById({
            multiId: params.id,
         })
         dispatch(HideLoading())
         if (response.success) {
            setMultiData(response.data)
         } else {
            message.error(response.message)
         }
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   useEffect(() => {
      if (params.id) {
         getMultiData()
      }
      // eslint-disable-next-line
   }, [])

   const deleteQuestion = async (questionId) => {
      try {
         dispatch(ShowLoading())
         const response = await deleteQuestionById({
            questionId,
            multiId: params.id,
         })
         dispatch(HideLoading())
         if (response.success) {
            message.success(response.message)
            getMultiData()
         } else {
            message.error(response.message)
         }
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   // DISPLAY QUESTIONS FROM DB TABLE
   const questionsColumns = [
      {
         title: 'Question',
         dataIndex: 'question',
      },
      {
         title: 'Correct Answer',
         dataIndex: 'correctOption',
         render: (text, record) => {
            return `${record.correctOption} : ${record.options[record.correctOption]}`
         },
      },
      {
         title: 'Optional Answers',
         dataIndex: 'options',
         render: (text, record) => {
            return (
               <div>
                  {Object.keys(record.options).map((key) => {
                     return (
                        <div key={key}>
                           {key} : {record.options[key]}
                        </div>
                     )
                  })}
               </div>
            )
         },
      },
      {
         title: 'Action',
         dataIndex: 'action',
         render: (text, record) => (
            <div className='flex gap-3'>
               <EditTwoTone
                  onClick={() => {
                     setSelectedQuestion(record)
                     setShowQuestionModal(true)
                  }}
               ></EditTwoTone>
               <DeleteTwoTone
                  onClick={() => {
                     deleteQuestion(record._id)
                  }}
               ></DeleteTwoTone>
            </div>
         ),
      },
   ]

   function handleTitleChange(event) {
      setTitle(event.target.value)
      console.log('title', title)
   }

   useEffect(() => {
      setNotes(content)
      console.log(notes)
   }, [content])

   const handleCountdownCheck = (event) => {
      setUseCountdown(event.target.checked)
   }

   const options = {
      modules: {
         toolbar: [
            ['bold', 'italic', 'underline'], // toggled buttons
            // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean'], // remove formatting button
         ],
      },
      theme: 'snow',
   }

   const onFinish = async (values) => {
      if (title === '') {
         message.error('Please enter a title')
         return
      }
      const payload = {
         title: title,
         useCountdown: useCountdown,
         countdownSeconds: countdownSeconds,
         notes: content,
      }
      console.log('Payload: ', payload)
      try {
         dispatch(ShowLoading())
         let response

         if (params.id) {
            response = await editMultiById({
               ...payload,
               multiId: params.id,
            })
            return
         } else {
            response = await addMulti(payload)
         }
         if (response.success) {
            message.success(response.message)

            // Retrieve the newly created document's ID
            const newId = response.data
            console.log('NEW ID: ', newId)

            navigate(`/teacher/edit-multi-by-id/${newId}`)
            setShowQuestionModal(true)
         } else {
            message.error(response.message)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   return (
      <>
         <div className='flex justify-between mt-2 items-end'>
            <h1>{params.id ? 'Update Quiz' : 'Create Quiz'}</h1>
         </div>
         <div className='divider'></div>
         {params?.id}

         {(multiData || !params.id) && (
            <Form onFinish={onFinish} initialValues={multiData}>
               <Tabs
                  className='ant-customTabs !important'
                  defaultActiveKey='1'
                  type='card'
                  size='large'
                  centered
                  direction='left'
                  animated
               >
                  <Tabs.TabPane tab='Quiz Details' key='1'>
                     <div className='giraffe_background'>
                        <div className='mathOptions'>
                           <h2>Multiple Choice Quiz Generator</h2>
                           <div className='optionsBordered'>
                              <label htmlFor='title'>Quiz Title: </label>
                              <Form.Item name='title'>
                                 <Input
                                    className='uiInputTitle'
                                    id='title'
                                    type='text'
                                    width={400}
                                    value={title}
                                    onChange={handleTitleChange}
                                 />
                              </Form.Item>
                           </div>

                           <div className='optionsBordered'>
                              <Form.Item name='useCountdown'>
                                 Use Countdown Timer:{' '}
                                 <Checkbox
                                    type='checkbox'
                                    checked={useCountdown}
                                    onChange={handleCountdownCheck}
                                 />
                              </Form.Item>
                              <Form.Item name='countdownSeconds'>
                                 <input
                                    className={useCountdown ? 'uiInput' : 'uiInputGrey'}
                                    disabled={!useCountdown}
                                    type='number'
                                    value={countdownSeconds}
                                    id='countdownSeconds'
                                    min='0'
                                    max='1000'
                                    onChange={(e) => setCountdownSeconds(e.target.value)}
                                 />{' '}
                                 seconds
                              </Form.Item>
                           </div>

                           <div className='optionsBordered'>
                              (Optional) Notes for pupil:
                              <div className='notesQuill !important'>
                                 <ReactQuill
                                    onChange={setContent}
                                    modules={options.modules}
                                    theme={options.theme}
                                    placeholder='Write any instructions for pupil(s) here.....'
                                    className='notesQuill !important'
                                    value={content}
                                 />
                              </div>
                              {/* {multiData.notes} */}
                           </div>
                        </div>

                        <div className='flex justify-end'>
                           <button
                              type='button'
                              className='secondary-contained-btn mt-10 w-10'
                              onClick={() => navigate('/teacher/quiz')}
                           >
                              Cancel
                           </button>
                        </div>
                        <div className='flex justify-end'>
                           <button type='submit' className='brown-button mt-10 w-10 '>
                              {params.id ? 'Update' : 'Create'}
                           </button>
                        </div>
                     </div>
                  </Tabs.TabPane>

                  {/* ONLY SHOW BELOW TAB IF PARAMS_ID IS PRESENT */}
                  {params.id && (
                     <Tabs.TabPane tab='Quiz Questions' key='2'>
                        <div className='flex justify-between'>
                           <h2>{multiData.title}</h2>
                           <button
                              className='yellowRedButton'
                              type='button'
                              onClick={() => setShowQuestionModal(true)}
                           >
                              + Add Question
                           </button>
                        </div>
                        <Table
                           columns={questionsColumns}
                           dataSource={multiData?.questions || []}
                        />
                     </Tabs.TabPane>
                  )}
               </Tabs>
            </Form>
         )}
         {showQuestionModal && (
            <AddUpdateQuestion
               setShowQuestionModal={setShowQuestionModal}
               showQuestionModal={showQuestionModal}
               multiId={params.id}
               refreshData={getMultiData}
               selectedQuestion={selectedQuestion}
               setSelectedQuestion={setSelectedQuestion}
               deleteQuestion={deleteQuestion}
            />
         )}
      </>
   )
}
