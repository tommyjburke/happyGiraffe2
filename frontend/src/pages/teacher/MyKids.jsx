import { Table, Input, Form, message, InputNumber, Popconfirm } from 'antd'
import { getUserPupils } from '../../_apiCalls/apiUsers'
import React, { useEffect, useState } from 'react'
import AddPupilForm from './AddChildForm'
import { useDispatch, useSelector } from 'react-redux'
import { ShowLoading, HideLoading } from '../../redux/loaderSlice'
import { Modal, Box } from '@mui/material'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'

export default function MyKids() {
   const [open, setOpen] = useState(false)
   const handleOpen = () => setOpen(true)
   const handleClose = () => setOpen(false)
   const getMyPupilsData = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getUserPupils()
         console.log('USER PUPILS ', response.data)
         dispatch(HideLoading())
         if (response.success) {
            setUserPupils(response.data)
            console.log('USERPUPILS 2', userPupils)
         } else {
            message.error('PRoBLEM ', response.message)
         }
      } catch (error) {
         console.log(error)
         dispatch(HideLoading())
         message.error('Something went wrong', error.message)
      }
   }

   useEffect(() => {
      // getContactsData()
      getMyPupilsData()
      console.log(userPupils)
   }, [])

   const dispatch = useDispatch()
   const [userPupils, setUserPupils] = useState([]) // [ { _id, username, fullName, dateOfBirth, schoolName, className }
   //
   //

   const handleDelete = async (record) => {
      console.log(record)
   }

   const EditableCell = ({
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
   }) => {
      const inputNode = inputType === 'number' ? <InputNumber /> : <Input />
      return (
         <td {...restProps}>
            {editing ? (
               <Form.Item
                  name={dataIndex}
                  style={{
                     margin: 0,
                  }}
                  rules={[
                     {
                        required: true,
                        message: `Please enter ${title}!`,
                     },
                  ]}
               >
                  {inputNode}
               </Form.Item>
            ) : (
               children
            )}
         </td>
      )
   }

   const [form] = Form.useForm()
   const [editingKey, setEditingKey] = useState('')

   const isEditing = (record) => record.username === editingKey

   const edit = (record) => {
      form.setFieldsValue({ ...record })
      setEditingKey(record.username)
   }

   const cancel = () => {
      setEditingKey('')
   }

   const save = async (payload) => {
      try {
         const row = await form.validateFields()
         // Here you can make an API call to update the row in MongoDB
         console.log('Updated Row:', row)
         setEditingKey('')
      } catch (errInfo) {
         console.log('Validate Failed:', errInfo)
      }
   }

   const columns = [
      {
         title: 'Username',
         dataIndex: 'username',
         editable: false,
      },
      {
         title: 'Name',
         dataIndex: 'name',
         width: '25%',
         editable: true,
      },
      {
         title: 'school name',
         dataIndex: 'schoolName',
         width: '20%',
         editable: true,
      },
      {
         title: 'Class',
         dataIndex: 'className',
         width: '5%',
         editable: true,
      },
      {
         title: '',
         dataIndex: 'edit',
         width: '5%',
         render: (_, record) => {
            const editable = isEditing(record)
            return editable ? (
               <span>
                  <a
                     href='#'
                     onClick={() => save(record)}
                     style={{
                        marginRight: 8,
                     }}
                  >
                     Save
                  </a>
                  <a onClick={cancel}>Cancel</a>
               </span>
            ) : (
               <a disabled={editingKey !== ''} onClick={() => edit(record)}>
                  <EditTwoTone />
               </a>
            )
         },
      },
      {
         title: '',
         dataIndex: 'delete',
         width: '5%',
         render: (value, record) => (
            <Popconfirm title='confirm deletion?' onConfirm={() => handleDelete(record)}>
               <DeleteTwoTone onClick={() => console.log(record.pupilId)} />
            </Popconfirm>
         ),
      },
   ]

   const mergedColumns = columns.map((col) => {
      if (!col.editable) {
         return col
      }
      return {
         ...col,
         onCell: (record) => ({
            record,
            inputType: col.dataIndex === 'age' ? 'number' : 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
         }),
      }
   })

   return (
      <>
         <div className='alignRight !important'>
            <button onClick={handleOpen} className='buttonOnRight'>
               + Add Child
            </button>
         </div>

         <Modal open={open} onClose={handleClose}>
            <Box className='pupilForm'>
               <AddPupilForm
                  handleClose={handleClose}
                  getMyPupilsData={getMyPupilsData}
               />
            </Box>
         </Modal>

         <h1 style={{ textAlign: 'left' }}>My Kids</h1>
         <Form form={form} component={false}>
            <Table
               components={{
                  body: {
                     cell: EditableCell,
                  },
               }}
               bordered
               dataSource={userPupils}
               columns={mergedColumns}
               rowClassName='editable-row'
               pagination={{
                  onChange: cancel,
               }}
            />
         </Form>
      </>
   )
}
