import { getUserPupils } from '../../_apiCalls/apiUsers'
import React, { useEffect, useState } from 'react'
import AddPupilForm from './AddChildForm'
import { useDispatch, useSelector } from 'react-redux'
import { ShowLoading, HideLoading } from '../../redux/loaderSlice'

import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'

import { DownOutlined, UserOutlined } from '@ant-design/icons'
import {
   Form,
   InputNumber,
   Popconfirm,
   Table,
   Typography,
   Checkbox,
   Button,
   message,
   Space,
   Input,
   Dropdown,
   Tooltip,
} from 'antd'
const { Column } = Table

export default function PupilsDashboard() {
   const [selectedRowKeys, setSelectedRowKeys] = useState([])
   const [open, setOpen] = useState(false)
   const handleOpen = () => setOpen(true)
   const handleClose = () => setOpen(false)
   const dispatch = useDispatch()
   // const [contacts, setContacts] = useState([]) // [ { _id, username, fullName, dateOfBirth, schoolName, className }
   const [userPupils, setUserPupils] = useState([]) // [ { _id, username, fullName, dateOfBirth, schoolName, className }
   //
   const handleDelete = async (record) => {
      console.log(record)
   }

   const [form] = Form.useForm()
   const [editingKey, setEditingKey] = useState('')

   const isEditing = (record) => record.key === editingKey

   const editRow = (record) => {
      form.setFieldsValue({ ...record })
      setEditingKey(record._id)
   }

   const edit = (record) => {
      form.setFieldsValue({
         fullname: '',
         school: '',
         class: '',
         ...record,
      })
      setEditingKey(record.key)
   }

   const cancelEdit = () => {
      setEditingKey('')
   }

   const saveRow = async (record) => {
      try {
         const values = await form.validateFields()
         // Perform save logic here using the values object

         setEditingKey('')
      } catch (errorInfo) {
         console.log('Validation failed:', errorInfo)
      }
   }

   const [data, setData] = useState(userPupils)

   const cancel = () => {
      setEditingKey('')
   }
   const save = async (key) => {
      try {
         const row = await form.validateFields()
         const newData = [...data]
         const index = newData.findIndex((item) => key === item.key)
         if (index > -1) {
            const item = newData[index]
            newData.splice(index, 1, {
               ...item,
               ...row,
            })
            setData(newData)
            setEditingKey('')
         } else {
            newData.push(row)
            setData(newData)
            setEditingKey('')
         }
      } catch (errInfo) {
         console.log('Validate Failed:', errInfo)
      }
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
                        message: `Please Input ${title}!`,
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

   /////
   ///// BELOW

   const columns = [
      {
         title: 'username',
         dataIndex: 'username',
         width: '25%',
         // editable: true,
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
         width: '10%',
         editable: true,
      },
      {
         title: 'Edit',
         dataIndex: 'operation',
         render: (_, record) => {
            const isRowEditing = isEditing(record)
            return isRowEditing ? (
               <span>
                  <Typography.Link
                     onClick={() => save(record.key)}
                     style={{
                        marginRight: 8,
                     }}
                  >
                     Save
                  </Typography.Link>
                  {/* <Popconfirm title='Sure to cancel?' onConfirm={cancel}> */}
                  <a onClick={cancel}>Cancel</a>
                  {/* </Popconfirm> */}
               </span>
            ) : (
               <Typography.Link
                  disabled={editingKey !== ''}
                  onClick={() => editRow(record)}
               >
                  <EditTwoTone />
               </Typography.Link>
            )
         },
      },
      {
         title: 'Delete',
         dataIndex: 'action',
         render: (value, record) => (
            <Popconfirm title='are you sure?' onConfirm={() => handleDelete(record)}>
               <DeleteTwoTone onClick={() => handleDelete(record)} />
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
            editing: isEditing(record), // Pass the editing value
         }),
      }
   })

   return (
      <div>
         {/* Blaa Blaa Blaa  */}

         {/* Blaa Blaa Blaa  */}
         <div className='alignRight !important'>
            <button onClick={handleOpen} className='buttonOnRight'>
               + Add Child
            </button>
         </div>

         <Modal open={open} onClose={handleClose}>
            <Box className='pupilForm'>
               <AddPupilForm handleClose={handleClose} />
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
               rowClassName={(record) => (isEditing(record) ? 'editable-row' : '')}
               rowKey={(record) => record._id}
               pagination={{
                  onChange: cancel,
               }}
            />
         </Form>
      </div>
   )
}
