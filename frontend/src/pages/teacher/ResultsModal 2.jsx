// ResultsModal.jsx
import React from 'react'
import { Modal } from 'antd'
import moment from 'moment'

function ResultsModal({ visible, onClose, fullReport }) {
   console.log(fullReport)
   // console.log(fullReport.user.name)
   const myFullReport = JSON.stringify(fullReport)

   // const multiName = fullReport.multi.name
   // const userName = fullReport.user.name
   // const correctOption = fullReport.result.correctAnswers[0][0].correctOption
   // const userChose = fullReport.result.correctAnswers[0][0].userChose
   // const options = fullReport.result.correctAnswers[0][0].options

   if (!fullReport) {
      return <div>No result found</div>
   } else {
      return (
         <Modal className='card2' visible={visible} onCancel={onClose} onOk={onClose}>
            <div>
               <h2>Quiz Name: {fullReport.multi.name}</h2>
               <p>User Name: {fullReport.user.name}</p>
               <p>Date: {fullReport.createdAt}</p>
               <p>Score: {fullReport.result.score}%</p>
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
                     {fullReport.result.correctAnswers.map((answer) => (
                        <tr key={answer._id}>
                           <td>{answer.name}</td>
                           <td>{answer.options.A}</td>
                           <td>{answer.options.B}</td>
                           <td>{answer.options.C}</td>
                           <td>{answer.options.D}</td>
                           <td>{answer.correctOption}</td>
                           <td>{answer.userChose}</td>
                           <td>
                              {answer.userChose === answer.correctOption ? '✓' : 'X'}
                           </td>
                        </tr>
                     ))}
                     {fullReport.result.wrongAnswers.map((answer) => (
                        <tr key={answer._id}>
                           <td>{answer.name}</td>
                           <td>{answer.options.A}</td>
                           <td>{answer.options.B}</td>
                           <td>{answer.options.C}</td>
                           <td>{answer.options.D}</td>
                           <td>{answer.correctOption}</td>
                           <td>{answer.userChose}</td>
                           <td>
                              {answer.userChose === answer.correctOption ? '✓' : 'X'}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Modal>
      )
   }
}
export default ResultsModal
