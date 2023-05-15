import React, { useState } from 'react'
import Greeting from '../../components/Greeting'
import { message, Modal, Table, Tag } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { getAllMathsResultByUser } from '../../_apiCalls/apiMathsResults'
import { useEffect } from 'react'
import moment from 'moment'
import { getAllMathsResultByPupilId } from '../../_apiCalls/apiMathsResults'
import { getAllMultiResultByPupilId } from '../../_apiCalls/apiMultiResults'

export default function Completed() {
   const { activeKid } = useSelector((state) => state.activeKid)
   console.log('ACTIVE KID ', activeKid)
   const [multiResults, setMultiResults] = React.useState([])
   const [mathsResults, setMathsResults] = React.useState([])
   const [expandedRows, setExpandedRows] = useState([])
   const dispatch = useDispatch()
   const opts = ['x', '/', '+', '-']

   let multiResultsData = []
   let resultsData = []

   const pupilId = activeKid.pupilId

   const getColor = (value) => {
      if (value < 20) {
         return 'red'
      } else if (value >= 20 && value <= 69) {
         return 'yellow'
      } else {
         return 'green'
      }
   }
   const multiColumns = [
      {
         title: 'MultiChoice Title',
         dataIndex: ['stats', 'title'],
         key: 'multiName',
      },

      {
         title: 'No. Questions',
         dataIndex: 'totalQuestions',
         render: (text, record) => <>{record.stats.numQuestions}</>,
      },

      {
         title: 'Right',
         dataIndex: 'correctAnswers',
         render: (text, record) => <>{record.result.correctAnswers.length}</>,
      },

      {
         title: 'Wrong',
         dataIndex: 'wrongAnswers',
         render: (text, record) => <>{record.result.wrongAnswers.length}</>,
      },
      {
         title: 'Score',
         dataIndex: ['stats', 'score'],
         key: 'score',
         render: (text) => <Tag color={getColor(text)}>{text} %</Tag>,
      },
      {
         title: 'Date Completed',
         dataIndex: 'date',
         render: (text, record) => (
            <>{moment(record.createdAt).format('MMMM Do YYYY, h:mm a')}</>
         ),
      },
   ]

   const mathsColumns = [
      {
         title: 'Maths Title',
         dataIndex: 'stats',
         key: 'title',
         render: (title) => title.title,
      },
      {
         title: 'NO.Questions',
         dataIndex: ['stats', 'numQuestions'],
         key: 'numQuestions',
      },
      {
         title: 'Right',
         dataIndex: ['stats', 'right'],
         key: 'right',
      },
      {
         title: 'Wrong',
         dataIndex: ['stats', 'wrong'],
         key: 'wrong',
      },
      {
         title: 'Score',
         dataIndex: ['stats', 'score'],
         key: 'score',
         render: (text, record) => {
            let fontColor = 'orange'

            if (record.stats.score < 20) {
               fontColor = 'red'
            } else if (record.stats.score > 70) {
               fontColor = 'green'
            }

            return (
               <span
                  style={{
                     color: fontColor,
                     fontSize: '1.2em',
                     fontFamily: 'Caveat Brush',
                  }}
               >
                  {record.stats.score} %
               </span>
            )
         },
      },
      {
         title: 'Date Completed',
         dataIndex: 'updatedAt',
         key: 'updatedAt',
         render: (text, record) => (
            <>{moment(record.createdAt).format('MMMM Do YYYY, h:mm a')}</>
         ),
      },
   ]

   //    Math types: [
   // {mathsQuiz.gameOptions.operators
   //    .map((op) => opts[op])
   //    .join(', ')}
   // ]

   const expandedRowRender = (record) => {
      const columns = [
         { title: 'Span Values', dataIndex: 'spanValues', key: 'spanValues' },
      ]
      const data = record.children.map((child) => ({
         key: child.key,
         spanValues: child.spanValues.join(', '),
      }))
   }

   const getAllMathsResults = async () => {
      const payload = { pupilId: pupilId }
      console.log('PAYLOAD', payload)
      try {
         dispatch(ShowLoading())
         const response = await getAllMathsResultByPupilId(payload)
         if (response.success) {
            setMathsResults(response.data)
            console.log('MultiResults DATA', response.data)
         } else {
            message.error(response.message)
         }
         dispatch(HideLoading())
      } catch (error) {
         console.log(error)
         dispatch(HideLoading())
      }
   }

   const getAllMultiResults = async () => {
      const payload = { pupilId: pupilId }
      console.log('PAYLOAD', payload)
      try {
         dispatch(ShowLoading())
         const response = await getAllMultiResultByPupilId(payload)
         if (response.success) {
            setMultiResults(response.data)
            console.log('MultiResults DATA', response.data)
         } else {
            message.error(response.message)
         }
         dispatch(HideLoading())
      } catch (error) {
         console.log(error)
         dispatch(HideLoading())
      }
   }

   useEffect(() => {
      getAllMathsResults()
      getAllMultiResults()
   }, [])

   console.log('MATHS RESULTS', mathsResults)
   console.log('MULTI RESULTS', multiResults)

   const mathsResults2 = []
   const multiResults2 = []

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

   return (
      <>
         <div>
            <Greeting title='Pupil Results' />
            <h2 className='greenFont'>{activeKid && activeKid.name}</h2>
            <div className='divider'></div>
            {/* MATHS: <br />
            <div style={{ maxWidth: '100px', fontSize: '1em' }}>
               {' '}
               {JSON.stringify(resultsData)}
            </div>
            <br /> */}
            {/* {JSON.stringify(mathsResults)} */}
            <div style={{ textAlign: 'left' }}>
               <h1>MULTIPLE CHOICE</h1>
            </div>
            <Table
               rowKey={(record) => record._id}
               columns={multiColumns}
               dataSource={multiResults}
               expandable={{
                  // expandedRowKeys: expandedRows,
                  // expandIconColumnIndex: -1,
                  // expandRowByClick: true,
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
         </div>
         <br />
         <div style={{ textAlign: 'left' }}>
            <h1>MATHS</h1>
            <br />
            <Table
               rowKey={(record) => record._id}
               columns={mathsColumns}
               dataSource={mathsResults}
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
         </div>
      </>
   )
}
