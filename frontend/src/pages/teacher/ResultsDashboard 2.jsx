import React from 'react'
import PageTitle from '../../components/PageTitle'
import { message, Table, Modal } from 'antd'
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

export default function MultiResultsDashboard() {
   const dispatch = useDispatch()
   const [multiResultsData, setMultiResultsData] = useState([])
   const [mathsResultsData, setMathsResultsData] = useState([])
   const [selectedReport, setSelectedReport] = useState(null)
   const [showResultsModal, setShowResultsModal] = useState(false)

   const handleButtonClick = () => {
      setShowResultsModal(true)
   }

   const handleModalClose = () => {
      setShowResultsModal(false)
   }

   const [filters, setFilters] = useState({
      multiName: '',
      userName: '',
   })
   const columns = [
      {
         title: 'Quiz Title',
         dataIndex: 'multiName',
         render: (text, record) => <>{record.multi.title} </>,
      },
      {
         title: 'Pupil Name',
         dataIndex: 'userName',
         render: (text, record) => <>{record.user.name}</>,
      },
      {
         title: 'Score %',
         dataIndex: 'score',
         render: (text, record) => <>{record.result.score}</>,
         defaultSortOrder: 'descend',
         sorter: (a, b) => a.score - b.score,
      },
      {
         // ACTIONS //
         title: 'Action',
         dataIndex: 'action',
         render: (text, record) => (
            <div className='flex gap-3'>
               <i
                  className='ri-list-ordered'
                  onClick={() => {
                     setSelectedReport(record)
                     handleButtonClick() // update the state variable for ResultsModal
                  }}
               ></i>

               <i
                  className='ri-delete-bin-line'
                  // onClick={() => deleteReport(record._id)}
               ></i>
            </div>
         ),
      },
   ]

   const getMathsData = async () => {
      try {
         dispatch(ShowLoading())
         console.log('GETTING MATHS DATA ')
         const response2 = await getAllMathsResult()
         if (response2.success) {
            setMathsResultsData(response2.data)

            console.log('Maths Results DATA', response2.data)
         } else {
            message.error(response2.message)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   const getMultiData = async (tempFilters) => {
      try {
         dispatch(ShowLoading())
         const response = await getAllMultiResult(tempFilters)
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
      getMultiData(filters)
      getMathsData()
   }, [])

   return (
      <div>
         <h1>RESULTS DASHBOARD</h1>

         <div className='bordered'>
            {/* <div className='text-md'>Filters</div> */}
            <div className='flex gap-2'>
               <input
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
               />

               <input
                  className='filterInput'
                  style={{ color: 'white' }}
                  type='text'
                  placeholder='Class Filter'
               />

               <i
                  onClick={() => {
                     setFilters({
                        multiName: '',
                        userName: '',
                     })
                     getMultiData({
                        multiName: '',
                        userName: '',
                     })
                  }}
                  className='ri-close-circle-fill clearIcon'
               ></i>
            </div>
         </div>
         <Table
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
         />
         {showResultsModal && (
            <ResultsModal
               visible={showResultsModal}
               onClose={handleModalClose}
               fullReport={selectedReport}
            />
         )}
      </div>
   )
}
