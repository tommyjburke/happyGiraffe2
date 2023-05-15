import { Modal, Form, Radio, message, Space, Input, Button } from 'antd'
import { Select } from 'antd'

import { useState } from 'react'
import { addQuestionToMulti, editQuestionById } from '../../_apiCalls/apiMultis'

import { useDispatch } from 'react-redux'
import { ShowLoading, HideLoading } from '../../redux/loaderSlice'

export default function AddUpdateQuestion({
   showQuestionModal,
   setShowQuestionModal,
   refreshData,
   multiData,
   multiId,
   selectedQuestion,
   setSelectedQuestion,
}) {
   const dispatch = useDispatch()
   const [question, setQuestion] = useState('')
   const [correctOption, setCorrectOption] = useState('')
   const [A, setA] = useState('')
   const [B, setB] = useState('')
   const [C, setC] = useState('')
   const [D, setD] = useState('')

   const [form] = Form.useForm()

   const onReset = () => {
      form.resetFields()
   }

   const onSubmit = async (values) => {
      console.log('QuestionData: ', values)
      if (
         !values.question ||
         !values.correctOption ||
         !values.A ||
         !values.B ||
         !values.C ||
         !values.D
      ) {
         message.error('Please fill all the fields')
         return
      }

      try {
         dispatch(ShowLoading())
         const requiredPayload = {
            question: values.question,
            correctOption: values.correctOption,
            options: {
               A: values.A,
               B: values.B,
               C: values.C,
               D: values.D,
            },
            multi: multiId,
         }

         let response
         if (selectedQuestion) {
            response = await editQuestionById({
               questionId: selectedQuestion._id,
               ...requiredPayload,
            })
         } else {
            response = await addQuestionToMulti(requiredPayload)
         }

         if (response.success) {
            message.success(response.message)
            refreshData()
            // setShowQuestionModal(false)
            // resetForm()
            // form.resetFields() // reset form fields
            // resetForm()
            onReset()
         } else {
            message.error(response.message)
         }
         setSelectedQuestion(null)
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }
   const [radioButton, setRadioButton] = useState('B')
   const onChange = (e) => {
      setRadioButton(e.target.value)
      console.log('radio checked', e.target.value)

      console.log(radioButton)
   }
   return (
      <Modal
         className='card'
         title={selectedQuestion ? 'Update Question' : 'Add New Question'}
         open={showQuestionModal}
         footer={null}
         onCancel={() => {
            setShowQuestionModal(false)
            setSelectedQuestion(null)
         }}
      >
         <Form
            className='modalStyle2'
            form={form}
            layout='vertical'
            onFinish={onSubmit}
            initialValues={{
               question: selectedQuestion?.question,
               correctOption: selectedQuestion?.correctOption,
               A: selectedQuestion?.options?.A,
               B: selectedQuestion?.options?.B,
               C: selectedQuestion?.options?.C,
               D: selectedQuestion?.options?.D,
            }}
         >
            <Form.Item name='question' label='Enter Question:'>
               <Input type='text' />
            </Form.Item>
            <div className='bordered '>
               <Form.Item name='correctOption' label='Correct Answer :'>
                  <Radio.Group onChange={onChange} value={'B'}>
                     <Space size={20}>
                        <Radio value={'A'}>A</Radio>
                        <Radio value={'B'}>B</Radio>
                        <Radio value={'C'}>C</Radio>
                        <Radio value={'D'}>D</Radio>
                     </Space>
                  </Radio.Group>
               </Form.Item>
            </div>

            {/* <Form.Item
               name='correctOption'
               label='Correct Option'
            >
               <Input type='text' />
            </Form.Item> */}

            <div className='flex gap-1'>
               <Form.Item name='A' label='Answer A'>
                  <Input type='text' />
               </Form.Item>
               <Form.Item name='B' label='Answer B'>
                  <Input type='text' />
               </Form.Item>
            </div>
            <div className='flex gap-1'>
               <Form.Item name='C' label='Answer C'>
                  <Input type='text' />
               </Form.Item>
               <Form.Item name='D' label='Answer D'>
                  <Input type='text' />
               </Form.Item>
            </div>

            <div className='flex justify-end mt-1 gap-1'>
               {/* <button
                  className='primary-outlined-btn'
                  type='button'
                  onClick={() =>
                     setShowQuestionModal(false)
                  }
               >
                  Cancel
               </button> */}
               <button
                  onClick={() => {
                     setShowQuestionModal(false)
                  }}
                  className='grey-button'
               >
                  Exit{' '}
               </button>
               {/* <button
                  onClick={() => {
                     onSubmit()
                     setShowQuestionModal(false)
                  }}
                  className='brown-button'
               >
                  Finish
               </button> */}
               <button
                  onClick={() => {
                     onSubmit()
                  }}
                  className='brown-button'
               >
                  Next
               </button>
               {/* <Button htmlType='button' onClick={onReset}>
                  Reset
               </Button> */}
            </div>
         </Form>
      </Modal>
   )
}
