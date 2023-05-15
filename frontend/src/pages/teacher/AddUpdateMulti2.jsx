import { Col, Form, message, Row, Table, Tabs, Checkbox } from 'antd'

import {
   addMulti,
   // deleteMultiById,
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

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // import the styles

export default function AddUpdateQuiz() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const params = useParams()

   // SETTING STATES:
   const [multiData, setMultiData] = useState(null)
   const [showQuestionModal, setShowQuestionModal] = useState(false)
   const [selectedQuestion, setSelectedQuestion] = useState(null)
   const [title, setTitle] = useState('')
   const [useCountdown, setUseCountdown] = useState(false)
   const [countdownSeconds, setCountdownSeconds] = useState(30)
   const [notes, setNotes] = useState('')
   const [content, setContent] = useState('')

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
         dataIndex: 'name',
      },
      // {
      //    title: 'Correct Option',
      //    dataIndex: 'correctOption',
      // },
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
               <i
                  className='ri-edit-line'
                  onClick={() => {
                     setSelectedQuestion(record)
                     setShowQuestionModal(true)
                  }}
               ></i>

               <i
                  className='ri-delete-bin-line'
                  onClick={() => {
                     deleteQuestion(record._id)
                  }}
               ></i>
            </div>
         ),
      },
   ]

   function handleTitleChange(event) {
      setTitle(event.target.value)
   }

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

   // SUBMIT FUNCTION
   const onFinish = async (values) => {
      const payload = {
         title: title,
         useCountdown: useCountdown,
         countdownSeconds: countdownSeconds,
         content: content,
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
         } else {
            response = await addMulti(payload)
         }
         if (response.success) {
            message.success(response.message)
            navigate('/teacher/quiz')
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
            {params.id ? 'Update Quiz' : 'Create Quiz'}
         </div>
         <div className='divider'></div>

         {(multiData || !params.id) && (
            <Form onFinish={onFinish} initialValues={multiData}>
               <Tabs defaultActiveKey='1'>
                  <Tabs.TabPane tab='Quiz Details' key='1'>
                     {/* <Row gutter={[16, 0]}>
                        <Col className='gutter-row' span={12}>
                           <Form.Item label='Quiz Title' name='title'>
                              <input type='text' className='form-control' />
                           </Form.Item>
                        </Col> */}

                     <div className='giraffe_background'>
                        <div className='mathOptions'>
                           <h2>Multiple Choice Quiz Generator</h2>
                           <div className='optionsBordered'>
                              <label htmlFor='title'>Quiz Title: </label>
                              <Form.Item name='title'>
                                 <input
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
                                    max='100'
                                    onChange={(e) => setCountdownSeconds(e.target.value)}
                                 />{' '}
                                 seconds
                              </Form.Item>
                           </div>

                           <div className='optionsBordered'>
                              (Optional) Notes for pupil:
                              <div className='notesQuill !important'>
                                 <ReactQuill
                                    value={content}
                                    onChange={setContent}
                                    modules={options.modules}
                                    theme={options.theme}
                                    placeholder='Write any instructions for pupil(s) here.....'
                                    className='notesQuill !important'
                                 />
                              </div>
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
                           <button
                              className='brown-button'
                              type='button'
                              onClick={() => setShowQuestionModal(true)}
                           >
                              + Question
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
