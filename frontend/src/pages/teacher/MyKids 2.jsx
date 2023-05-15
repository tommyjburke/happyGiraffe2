import { getUserPupils } from '../../_apiCalls/apiUsers'
import React, { useEffect, useState } from 'react'
import AddPupilForm from './AddPupilForm'
import { useDispatch, useSelector } from 'react-redux'
import { ShowLoading, HideLoading } from '../../redux/loaderSlice'
import { Modal, Box } from '@mui/material'

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

const handleDelete = async (record) => {
   console.log(record)
}

const handleAddToClass = async (record) => {
   console.log(record)
}

const userPupilColumns = [
   {
      title: '',
      dataIndex: 'checkbox',
      render: (value, record) => (
         <Checkbox onChange={(e) => (record.checked = e.target.checked)} />
      ),
   },
   {
      title: 'Username',
      dataIndex: 'username',
   },
   {
      title: 'Full Name',
      dataIndex: 'name',
   },
   {
      title: 'School',
      dataIndex: 'schoolName',
   },
   {
      title: 'Class',
      dataIndex: 'className',
   },
   {
      title: 'Action',
      dataIndex: 'action',
      render: (value, record) => (
         <>
            <Button type='link' onClick={() => handleDelete(record)}>
               Delete
            </Button>
            <Button type='link' onClick={() => handleAddToClass(record)}>
               Add to Class
            </Button>
         </>
      ),
   },
]

export default function PupilsDashboard() {
   //
   //
   //
   //
   //
   //

   const [selectedRowKeys, setSelectedRowKeys] = useState([])
   const [open, setOpen] = useState(false)
   const handleOpen = () => setOpen(true)
   const handleClose = () => setOpen(false)
   const dispatch = useDispatch()
   // const [contacts, setContacts] = useState([]) // [ { _id, username, fullName, dateOfBirth, schoolName, className }
   const [userPupils, setUserPupils] = useState([]) // [ { _id, username, fullName, dateOfBirth, schoolName, className }
   //

   const [form] = Form.useForm()
   const [data, setData] = useState(userPupils)
   const [editingKey, setEditingKey] = useState('')
   const isEditing = (record) => record.key === editingKey
   const edit = (record) => {
      form.setFieldsValue({
         username: '',
         fullname: '',
         school: '',
         class: '',
         ...record,
      })
      setEditingKey(record.key)
   }
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

   ///
   ////

   // const getContactsData = async () => {
   //    try {
   //       dispatch(ShowLoading())
   //       const response = await getUserConnections()
   //       console.log('CONNECTIONS ', response.data)
   //       dispatch(HideLoading())
   //       if (response.success) {
   //          setContacts(response.data)
   //          console.log('CONNECTIONS 2', contacts)
   //       } else {
   //          message.error('PRoBLEM ', response.message)
   //       }
   //    } catch (error) {
   //       console.log(error)
   //       dispatch(HideLoading())
   //       message.error('Something went wrong', error.message)
   //    }
   // }

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

   useEffect(() => {
      // getContactsData()
      getMyPupilsData()
   }, [])

   /////
   ///// BELOW

   const columns = [
      {
         title: 'username',
         dataIndex: 'username',
         width: '25%',
         editable: true,
      },
      {
         title: 'Full Name',
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
         title: 'operation',
         dataIndex: 'operation',
         render: (_, record) => {
            const editable = isEditing(record)
            return editable ? (
               <span>
                  <Typography.Link
                     onClick={() => save(record.key)}
                     style={{
                        marginRight: 8,
                     }}
                  >
                     Save
                  </Typography.Link>
                  <Popconfirm title='Sure to cancel?' onConfirm={cancel}>
                     <a>Cancel</a>
                  </Popconfirm>
               </span>
            ) : (
               <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                  Edit
               </Typography.Link>
            )
         },
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

   ///// ABOVE
   //////

   return (
      <div>
         {/* Blaa Blaa Blaa  */}

         {/* Blaa Blaa Blaa  */}
         <div className='alignRight !important'>
            <button onClick={handleOpen} className='buttonOnRight'>
               + Add Child
            </button>
         </div>

         <Modal
            open={open}
            onClose={handleClose}
            // aria-labelledby='modal-modal-title'
            // aria-describedby='modal-modal-description'
         >
            <Box className='pupilForm'>
               <AddPupilForm handleClose={handleClose} />
            </Box>
         </Modal>

         {/* <div className='divider'></div> */}
         <h1>My Children</h1>

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

         <Table
            dataSource={userPupils}
            rowSelection={{
               type: 'checkbox',
               selectedRowKeys: selectedRowKeys,
               onChange: (selectedRowKeys, selectedRows) => {
                  console.log('Selected Rows:', selectedRows)
                  setSelectedRowKeys(selectedRowKeys)
               },
            }}
         >
            <Column title='Username' dataIndex='username' key='username' />
            <Column title='Full Name' dataIndex='name' key='name' />
            <Column title='School' dataIndex='schoolName' key='schoolName' />
            <Column title='Class' dataIndex='className' key='className' />
            <Column
               title='Action'
               key='action'
               render={(text, record) => (
                  <Space size='middle'>
                     <a>Delete</a>
                     <a>Add to Class</a>
                  </Space>
               )}
            />
         </Table>
      </div>
   )
}
