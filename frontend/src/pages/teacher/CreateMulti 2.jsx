import { useState } from 'react'

import { PlusOutlined } from '@ant-design/icons'
import {
   Button,
   Cascader,
   Checkbox,
   DatePicker,
   Form,
   Input,
   InputNumber,
   Radio,
   Select,
   Switch,
   TreeSelect,
   Upload,
} from 'antd'
import PageTitle from '../../components/PageTitle'

function CreateMulti() {
   const [numQuestions, setNumQuestions] = useState(0)
   const [numOptions, setNumOptions] = useState(0)
   const [showForm, setShowForm] = useState(false)
   const [questions, setQuestions] = useState([])

   const handleNumQuestionsChange = (event) => {
      setNumQuestions(parseInt(event.target.value))
   }

   const handleNumOptionsChange = (event) => {
      setNumOptions(parseInt(event.target.value))
   }

   const handleSubmit = (event) => {
      event.preventDefault()
      setShowForm(true)
      setQuestions(
         Array.from({ length: numQuestions }, () => ({
            options: Array.from({ length: numOptions }, () => ''),
            correctOption: null,
         }))
      )
   }

   const handleOptionChange = (questionIndex, optionIndex, event) => {
      const newQuestions = [...questions]
      newQuestions[questionIndex].options[optionIndex] = event.target.value
      setQuestions(newQuestions)
   }

   const handleCorrectOptionChange = (questionIndex, optionIndex) => {
      const newQuestions = [...questions]
      newQuestions[questionIndex].correctOption = optionIndex
      setQuestions(newQuestions)
   }

   return (
      <div>
         {!showForm && (
            <form onSubmit={handleSubmit}>
               <label htmlFor='numQuestions'>Number of Questions:</label>
               <select
                  id='numQuestions'
                  value={numQuestions}
                  onChange={handleNumQuestionsChange}
               >
                  {[...Array(10)].map((_, i) => (
                     <option key={i} value={i + 1}>
                        {i + 1}
                     </option>
                  ))}
               </select>
               <br />
               <label htmlFor='numOptions'>Number of Options:</label>
               <select
                  id='numOptions'
                  value={numOptions}
                  onChange={handleNumOptionsChange}
               >
                  {[...Array(6)].map((_, i) => (
                     <option key={i} value={i + 2}>
                        {i + 2}
                     </option>
                  ))}
               </select>
               <br />
               <button type='submit'>Submit</button>
            </form>
         )}
         {showForm && (
            <Form>
               {[...Array(numQuestions)].map((_, questionIndex) => (
                  <div key={questionIndex} className='card-wide'>
                     <label htmlFor={`question${questionIndex}`}>
                        Question {questionIndex + 1}:
                     </label>
                     <input id={`question${questionIndex}`} type='text' required />
                     {[...Array(numOptions)].map((_, optionIndex) => (
                        <div key={optionIndex}>
                           <label
                              htmlFor={`question${questionIndex}-option${optionIndex}`}
                           >
                              Option {String.fromCharCode(optionIndex + 65)}:
                           </label>
                           <input
                              id={`question${questionIndex}-option${optionIndex}`}
                              type='text'
                              value={questions[questionIndex].options[optionIndex]}
                              onChange={(event) =>
                                 handleOptionChange(questionIndex, optionIndex, event)
                              }
                              required
                           />
                           <input
                              type='radio'
                              name={`question${questionIndex}-correctOption`}
                              value={optionIndex}
                              checked={
                                 questions[questionIndex].correctOption === optionIndex
                              }
                              onChange={() =>
                                 handleCorrectOptionChange(questionIndex, optionIndex)
                              }
                              required
                           />
                        </div>
                     ))}
                  </div>
               ))}
            </Form>
         )}
      </div>
   )
}

export default CreateMulti
