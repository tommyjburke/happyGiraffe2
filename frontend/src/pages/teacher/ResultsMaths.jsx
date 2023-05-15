import { message, Button, Table, Modal, Input, Space, Tag, Tabs } from 'antd'
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { getAllMultiResults } from '../../_apiCalls/apiMultiResults'
import { useEffect } from 'react'
import moment from 'moment'
import { useState } from 'react'
import ResultsModal from './ResultsModal'
import { deleteReportById } from '../../_apiCalls/apiMultiResults'
import {
   getAllMathsResult,
   getAllMathsResultByUser,
   deleteMathsResultById,
} from '../../_apiCalls/apiMathsResults'
import { getAllMultiResult } from '../../_apiCalls/apiMultiResults'
import { getAllMultiResultByAssignmentIdViaTeacherId } from '../../_apiCalls/apiMultiResults'
// import { use } from '../../../../server/routes/assignmentRoute'
import { getAllMathsResultByAssignmentIdViaTeacherId } from '../../_apiCalls/apiMathsResults'

export default function ResultsMaths() {
   const dispatch = useDispatch()

   const [mathsResultsData, setMathsResultsData] = useState([])

   const [showResultsModal, setShowResultsModal] = useState(false)
   const [expandedRows, setExpandedRows] = useState([])

   const opts = ['x', '/', '+', '-']

   const toggleRowExpansion = (record) => {
      const expandedRowKeys = [...expandedRows]
      const index = expandedRowKeys.indexOf(record.key)

      if (index > -1) {
         expandedRowKeys.splice(index, 1)
      } else {
         expandedRowKeys.push(record.key)
      }

      setExpandedRows(expandedRowKeys)
   }

   const isRowExpanded = (record) => {
      return expandedRows.includes(record.key)
   }

   const handleButtonClick = () => {
      setShowResultsModal(true)
   }

   const handleModalClose = () => {
      setShowResultsModal(false)
   }

   const getColor = (value) => {
      if (value < 20) {
         return 'red'
      } else if (value >= 20 && value <= 69) {
         return 'yellow'
      } else {
         return 'green'
      }
   }

   // const [filters, setFilters] = useState({
   //    mathsName: '',
   //    userName: '',
   // })
   // const columns = [
   //    {
   //       title: 'Quiz Title',
   //       dataIndex: 'mathsName',
   //       render: (text, record) => <>{record.maths.title} </>,
   //    },
   //    {
   //       title: 'Pupil Name',
   //       dataIndex: 'userName',
   //       render: (text, record) => <>{record.user.name}</>,
   //    },
   //    {
   //       title: 'Score %',
   //       dataIndex: 'score',
   //       render: (text, record) => <>{record.result.score}</>,
   //       defaultSortOrder: 'descend',
   //       sorter: (a, b) => a.score - b.score,
   //    },
   //    {
   //       // ACTIONS //
   //       title: 'Action',
   //       dataIndex: 'action',
   //       render: (text, record) => (
   //          <div className='flex gap-3'>
   //             <i
   //                className='ri-list-ordered'
   //                onClick={() => {
   //                   setSelectedReport(record)
   //                   handleButtonClick() // update the state variable for ResultsModal
   //                }}
   //             ></i>

   //             <i
   //                className='ri-delete-bin-line'
   //                // onClick={() => deleteReport(record._id)}
   //             ></i>
   //          </div>
   //       ),
   //    },
   // ]

   const [filteredInfo, setFilteredInfo] = useState({})
   const [sortedInfo, setSortedInfo] = useState({})
   const handleChange = (pagination, filters, sorter) => {
      console.log('Various parameters', pagination, filters, sorter)
      setFilteredInfo(filters)
      setSortedInfo(sorter)
   }
   const clearFilters = () => {
      setFilteredInfo({})
   }
   const clearAll = () => {
      setFilteredInfo({})
      setSortedInfo({})
   }
   const setScoreSort = () => {
      setSortedInfo({
         order: 'descend',
         columnKey: 'score',
      })
   }

   const [sortConfig, setSortConfig] = useState({
      field: '',
      order: '',
   })

   const handleTableChange = (pagination, filters, sorter) => {
      setSortConfig({
         field: sorter.field,
         order: sorter.order,
      })
   }
   const mathsColumns = [
      {
         title: 'Pupil Name',
         dataIndex: 'pupilName',
         key: 'pupilName',
         sorter: true,
         sortOrder: sortConfig.key == 'pupilName' && sortConfig.sortOrder,
      },
      {
         title: 'Assignment Title',
         dataIndex: ['assignmentId', 'assignmentTitle'],
         key: 'assignmentTitle',
         sorter: true,
         sortOrder: sortConfig.key == 'assignmentTitle' && sortConfig.sortOrder,
         filters: [
            // {
            //    text: { assignmentTitle },
            //    value: { assignmentTitle },
            // },
            {
               text: 'Jim',
               value: 'Jim',
            },
         ],
      },
      {
         title: 'Score',
         dataIndex: ['stats', 'score'],
         key: 'score',
         render: (text) => <Tag color={getColor(text)}>{text} %</Tag>,
         sorter: true,
         sortOrder: sortConfig.key == 'score' && sortConfig.sortOrder,

         sorter: (a, b) => a.score - b.score,
         sortOrder: sortedInfo.columnKey === 'score' ? sortedInfo.order : null,
         ellipsis: true,
      },

      {
         title: 'Date Completed',
         dataIndex: 'createdAt',
         render: (text, record) => (
            <>{moment(record.createdAt).format('MMMM Do YYYY, h:mm a')}</>
         ),
         sorter: true,
         sortOrder: sortConfig.key === 'createdAt' && sortConfig.sortOrder,
      },
      {
         title: 'Actions',
         key: 'actions',
         render: (_, record) => (
            <Space>
               <InfoCircleOutlined style={{ color: 'blue' }} />
               <DeleteOutlined style={{ color: 'red' }} />
            </Space>
         ),
      },
   ]

   const getMathsData = async (tempFilters) => {
      try {
         dispatch(ShowLoading())
         const response = await getAllMathsResultByAssignmentIdViaTeacherId()
         if (response.success) {
            setMathsResultsData(response.data)
         } else {
            message.error(response.message)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   useEffect(() => {
      getMathsData()
   }, [])

   return (
      <div>
         <h1
            className='redFont'
            style={{ backgroundColor: 'yellow', borderRadius: '25px' }}
         >
            MATHS RESULTS
         </h1>
         <br />

         <Table
            rowKey={(record) => record._id}
            columns={mathsColumns}
            dataSource={mathsResultsData}
            expandable={{
               expandedRowRender: (record) => {
                  return (
                     <div>
                        <table>
                           <thead>
                              <tr>
                                 <th>
                                    <u>Question</u>
                                 </th>
                                 <th>
                                    <u>User Answer</u>
                                 </th>
                                 <th>
                                    <u>Result</u>
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              {record.divsData.map((answer) => (
                                 <tr key={answer._id}>
                                    <td>
                                       {answer.spanValues[0]} {answer.spanValues[3]}
                                       {answer.spanValues[2]} = {answer.spanValues[2]}
                                       {/* {answer.spanValues.map((value, index) => (
                                          <span key={index}>{value} </span>
                                       ))} */}
                                    </td>
                                    <td>{answer.inputValue}</td>
                                    <td>{answer.buttonLabel}</td>
                                 </tr>
                              ))}

                              {/* {resultsData.map((item) => (
                                    <tr key={item._id}>
                                       <td>
                                          {item.divsData[item._id].spanValues[0]}{' '}
                                          {item.divsData[item._id].spanValues[3]}{' '}
                                          {item.divsData[item._id].spanValues[2]}
                                       </td>
                                       <td>{item.divsData[item._id].inputValue}</td>
                                       <td>{item.divsData[item._id].buttonLabel}</td>
                                    </tr>
                                 ))} */}
                           </tbody>
                        </table>
                     </div>
                  )
               },
               rowExpandable: (record) => record,
            }}
         />
         {/* <p>{JSON.stringify(mathsResultsData)}</p> */}
      </div>
   )
}
