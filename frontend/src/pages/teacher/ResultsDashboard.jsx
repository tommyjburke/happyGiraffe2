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
import ResultsMaths from './ResultsMaths'
import ResultsMulti from './ResultsMulti'
// import { use } from '../../../../server/routes/assignmentRoute'

export default function MultiResultsDashboard() {
   const dispatch = useDispatch()
   const [multiResultsData, setMultiResultsData] = useState([])
   const [mathsResultsData, setMathsResultsData] = useState([])
   const [selectedReport, setSelectedReport] = useState(null)
   const [showResultsModal, setShowResultsModal] = useState(false)
   const [expandedRows, setExpandedRows] = useState([])

   const tabs = [
      {
         key: '2',
         label: `Maths Results`,
         children: <ResultsMaths />,
      },
      {
         key: '1',
         label: `Multiple Choice Results`,
         children: <ResultsMulti />,
         render: <span style={{ color: 'blue' }}>MULTI</span>,
      },
   ]

   const opts = ['x', '/', '+', '-']

   return (
      <div>
         <h1>RESULTS DASHBOARD</h1>

         <Tabs
            className='ant-customTabs !important'
            defaultActiveKey='1'
            type='card'
            size='large'
            items={tabs}
            centered
            direction='left'
            // animated
         />
      </div>
   )
}
