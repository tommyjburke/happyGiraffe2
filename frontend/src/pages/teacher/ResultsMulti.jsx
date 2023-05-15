import { message, Button, Table, Modal, Input, Space, Tag, Tabs } from 'antd'
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'

import { useEffect } from 'react'
import moment from 'moment'
import { useState } from 'react'
import ResultsModal from './ResultsModal'
import { deleteReportById } from '../../_apiCalls/apiMultiResults'

import { getAllMultiResultByAssignmentIdViaTeacherId } from '../../_apiCalls/apiMultiResults'
// import { use } from '../../../../server/routes/assignmentRoute'

export default function ResultsMulti() {
   const dispatch = useDispatch()
   const [multiResultsData, setMultiResultsData] = useState([])
   const [mathsResultsData, setMathsResultsData] = useState([])
   const [selectedReport, setSelectedReport] = useState(null)
   const [showResultsModal, setShowResultsModal] = useState(false)
   const [expandedRows, setExpandedRows] = useState([])
   const [filters, setFilters] = useState({})

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

   const getScoreColour = (score) => {
      if (score < 25) {
         console.log('RED')
         return 'red'
      } else if (score >= 25 && score <= 49) {
         console.log('YELLOW')
         return 'orange'
      } else if (score >= 50 && score <= 69) {
         console.log('BLUE')
         return 'blue'
      } else {
         console.log('GREEN')
         return 'green'
      }
   }

   const [filteredInfo, setFilteredInfo] = useState({})
   const [sortedInfo, setSortedInfo] = useState({})
   const handleChange = (pagination, filters, sorter) => {
      console.log('Various parameters', pagination, filters, sorter)
      setFilteredInfo(filters)
      setSortedInfo(sorter)
   }
   const clearFilters = () => {
      setFilteredInfo(null)
   }
   const clearAll = () => {
      setFilteredInfo({})
      setSortedInfo()
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

   const assignmentTitles = multiResultsData.map(
      (title) => title.assignmentId.assignmentTitle
   )
   const uniqueAssignmentTitles = assignmentTitles.filter(
      (title, index) => assignmentTitles.indexOf(title) === index
   )

   const titleOptions = uniqueAssignmentTitles.map((title) => ({
      text: title,
      value: title,
   }))
   console.log('TITLE OPTIONS', titleOptions)

   const pupilNames = multiResultsData.map((name) => name.pupilName)
   const uniquePupilNames = pupilNames.filter(
      (name, index) => pupilNames.indexOf(name) === index
   )

   const pupilOptions = uniquePupilNames.map((title) => ({
      text: title,
      value: title,
   }))

   const multiColumns = [
      {
         title: 'Pupil Name',
         dataIndex: 'pupilName',
         key: 'pupilName',
         sorter: true,
         sortOrder: sortConfig.key == 'pupilName' && sortConfig.sortOrder,
         filters: pupilOptions,
         onFilter: (value, record) => record.pupilName.includes(value),
      },
      {
         title: 'Assignment Title',
         dataIndex: ['assignmentId', 'assignmentTitle'],
         key: 'assignmentTitle',
         sorter: true,
         sortOrder: sortConfig.key == 'assignmentTitle' && sortConfig.sortOrder,
         filters: titleOptions,
         onFilter: (value, record) => record.assignmentId.assignmentTitle.includes(value),
      },
      {
         title: 'Score',
         dataIndex: ['stats', 'score'],
         key: 'score',
         render: (text) => <Tag color={getScoreColour(parseInt(text))}>{text} %</Tag>,
         //  render: (text) => <Tag color='red'>{text} %</Tag>,
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
         title: 'Delete',
         key: 'actions',
         render: (_, record) => (
            <Space>
               {/* <InfoCircleOutlined style={{ color: 'blue' }} /> */}
               <DeleteOutlined
                  style={{ color: 'red' }}
                  onClick={() => {
                     console.log(record._id)
                  }}
               />
            </Space>
         ),
      },
   ]

   const getMultiData = async (tempFilters) => {
      try {
         dispatch(ShowLoading())
         const response = await getAllMultiResultByAssignmentIdViaTeacherId()
         if (response.success) {
            setMultiResultsData(response.data)
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
      getMultiData()
   }, [])

   return (
      <div>
         <h1
            className='blueFont'
            style={{
               backgroundColor: 'yellow',
               borderRadius: '25px',
            }}
         >
            MULTIPLE CHOICE RESULTS
         </h1>
         <br />
         <Button onClick={setScoreSort}>Sort score</Button>

         <Table
            rowKey={(record) => record._id}
            columns={multiColumns}
            dataSource={multiResultsData}
            expandable={{
               expandedRowRender: (record) => {
                  return (
                     <div>
                        <table>
                           <thead>
                              <tr>
                                 <th>Multi Question</th>
                                 <th>Option A</th>
                                 <th>Option B</th>
                                 <th>Option C</th>
                                 <th>Option D</th>
                                 <th>Correct Answer</th>
                                 <th>User Chose</th>
                                 <th>Result</th>
                              </tr>
                           </thead>

                           <tbody>
                              {record.result.correctAnswers.map((answer) => (
                                 <tr key={answer._id}>
                                    <td>{answer.question}</td>
                                    <td>{answer.options.A}</td>
                                    <td>{answer.options.B}</td>
                                    <td>{answer.options.C}</td>
                                    <td>{answer.options.D}</td>
                                    <td>{answer.correctOption}</td>
                                    <td>{answer.userChose}</td>
                                    <td>
                                       {answer.userChose === answer.correctOption
                                          ? '✅'
                                          : '❌'}
                                    </td>
                                 </tr>
                              ))}
                              {record.result.wrongAnswers.map((answer) => (
                                 <tr key={answer._id}>
                                    <td>{answer.question}</td>
                                    <td>{answer.options.A}</td>
                                    <td>{answer.options.B}</td>
                                    <td>{answer.options.C}</td>
                                    <td>{answer.options.D}</td>
                                    <td>{answer.correctOption}</td>
                                    <td>{answer.userChose}</td>
                                    <td>
                                       {answer.userChose === answer.correctOption
                                          ? '✅'
                                          : '❌'}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )
               },
               onExpand: (expanded, record) => {
                  toggleRowExpansion(record)
               },
            }}
         ></Table>

         <div key={multiResultsData._id}>
            <div className='flex gap-2'>
               <div className='text-md'>Filters</div>
               <input
                  className='filterInput'
                  style={{ color: 'white' }}
                  type='text'
                  placeholder='Quiz Title Filter'
                  value={filters.multiName}
                  onChange={(e) =>
                     setFilters({
                        ...filters,
                        multiName: e.target.value.toLowerCase(),
                     })
                  }
               />
               <input
                  className='filterInput !important'
                  style={{ color: 'white' }}
                  type='text'
                  placeholder='Pupil Name Filter'
                  value={filters.userName}
                  onChange={(e) =>
                     setFilters({
                        ...filters,
                        userName: e.target.value.toLowerCase(),
                     })
                  }
               />
               <input
                  className='filterInput'
                  style={{ color: 'white' }}
                  type='text'
                  placeholder='Class Filter'
               />
               <input
                  className='filterInput'
                  style={{ color: 'white' }}
                  type='text'
                  placeholder='Date Filter'
               />
               <i
                  onClick={() => {
                     setFilters({
                        multiName: '',
                        userName: '',
                        className: '',
                        date: '',
                     })
                  }}
                  className='fas fa-times-circle'
                  style={{ color: 'red', cursor: 'pointer' }}
               ></i>
            </div>
            <div className='flex gap-2'>
               <div className='text-md'>Sort</div>
               <select
                  className='filterInput'
                  style={{ color: 'white' }}
                  value={sortConfig.key}
                  onChange={(e) => {
                     setSortConfig({
                        key: e.target.value,
                        direction: 'ascending',
                     })
                  }}
               >
                  <option value=''>Sort By</option>
                  <option value='multiName'>Quiz Title</option>
                  <option value='userName'>Pupil Name</option>
                  <option value='className'>Class</option>
                  <option value='date'>Date</option>
               </select>
               <select
                  className='filterInput'
                  style={{ color: 'white' }}
                  value={sortConfig.direction}
                  onChange={(e) => {
                     setSortConfig({
                        ...sortConfig,
                        direction: e.target.value,
                     })
                  }}
               >
                  <option value='ascending'>Ascending</option>
                  <option value='descending'>Descending</option>
               </select>
               <i
                  onClick={() => {
                     setSortConfig({ key: '', direction: '' })
                  }}
                  className='fas fa-times-circle'
                  style={{ color: 'red', cursor: 'pointer' }}
               ></i>
            </div>
         </div>

         <div className='bordered'>
            {/* <div className='text-md'>Filters</div> */}
            <div className='flex gap-2'>
               {/* <input
                  className='filterInput'
                  style={{ color: 'white' }}
                  type='text'
                  placeholder='Quiz Title Filter'
                  value={filters.multiName}
                  onChange={(e) =>
                     setFilters({ ...filters, multiName: e.target.value.toLowerCase() })
                  }
               />

               <input
                  className='filterInput !important'
                  style={{ color: 'white' }}
                  type='text'
                  placeholder='Pupil Name Filter'
                  value={filters.userName}
                  onChange={(e) =>
                     setFilters({ ...filters, userName: e.target.value.toLowerCase() })
                  }
               /> */}

               <input
                  className='filterInput'
                  style={{ color: 'white' }}
                  type='text'
                  placeholder='Class Filter'
               />

               <i
                  // onClick={() => {
                  //    setFilters({
                  //       multiName: '',
                  //       userName: '',
                  //    })
                  //    getMultiData({
                  //       multiName: '',
                  //       userName: '',
                  //    })
                  // }}
                  className='ri-close-circle-fill clearIcon'
               ></i>
            </div>
         </div>
         {/* <Table
            columns={columns}
            dataSource={multiResultsData.filter((report) => {
               const multiName = report.multi.name.toLowerCase()
               const userName = report.user.name.toLowerCase()
               return (
                  multiName.includes(filters.multiName) &&
                  userName.includes(filters.userName)
               )
            })}
            className='mt-1'
         /> */}
         {/* {JSON.stringify(multiResultsData)}
         {showResultsModal && (
            <ResultsModal
               visible={showResultsModal}
               onClose={handleModalClose}
               fullReport={selectedReport}
            />
         )} */}

         {/* {JSON.stringify(multiResultsData)} */}

         {/* {multisResultData.assignmentTitle.map((title) => (
                     <div>{title.assignmentTitle} */}
      </div>
   )
}
