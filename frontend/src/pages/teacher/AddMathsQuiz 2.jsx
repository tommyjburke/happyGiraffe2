import React, { useState, useRef, useEffect } from 'react'
import Form from 'antd/es/form/Form'
import { Modal, Checkbox, Item, Slider, Button } from 'antd'
import moment from 'moment'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // import the styles

import BuildBoard from './BuildBoard'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import hiddenAnswerDemo from '../../_media/hiddenanswer.png'

export default function AddMathsQuiz() {
   //  ;<>{moment(record.createdAt).format('DD-MM-YYYY hh:mm:ss')}</>

   const [title, setTitle] = useState(
      moment(new Date().toDateString()).format('LL') + ' Maths Quiz'
   )
   const { Item } = Form
   const [numQuestions, setNumQuestions] = useState(8)
   const [userHiddenOption, setUserHiddenOption] = useState('3')
   const [operators, setOperators] = useState([])
   const [aValue, setAValue] = useState([2, 12])
   const [bValue, setBValue] = useState([1, 10])

   const [useCountdown, setUseCountdown] = useState(false)
   const [countdownSeconds, setCountdownSeconds] = useState(30)
   const [notes, setNotes] = useState('')
   const [gameOptions, setGameOptions] = useState(null)
   const [showBuildBoardModal, setShowBuildBoardModal] = useState(false)
   const [checkboxes, setCheckboxes] = useState([0, 2, 3])

   const [content, setContent] = useState('')

   const options = {
      modules: {
         toolbar: [
            ['bold', 'italic', 'underline'], // toggled buttons

            // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }],

            ['clean'], // remove formatting button
         ],
      },
      theme: 'snow',
   }

   function handleTitleChange(event) {
      setTitle(event.target.value)
   }

   const handleCheckboxChange = (event) => {
      const value = parseInt(event.target.value)
      const isChecked = event.target.checked
      if (isChecked) {
         setCheckboxes([...checkboxes, value])
         setOperators([...checkboxes, value])
      } else {
         setCheckboxes(checkboxes.filter((item) => item !== value))
         setOperators(checkboxes.filter((item) => item !== value))
      }
   }

   useEffect(() => {
      setOperators(checkboxes)
   }, [checkboxes])

   useEffect(() => {
      setNotes(content)
      console.log(notes)
   }, [content])

   const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
         event.preventDefault()
         setNotes(notes + '\n')
      }
   }

   const handleCountdownCheck = (event) => {
      setUseCountdown(event.target.checked)
   }

   function buildMathsBoard(event) {
      event.preventDefault()

      if (operators.length === 0) {
         alert('Please select at least one operator')
         return
      }
      setGameOptions({
         title,
         numQuestions,
         userHiddenOption,
         operators,
         useCountdown,
         countdownSeconds,
         notes,
         aValue,
         bValue,
      })
      console.log('gameOptions: ', gameOptions)
      const myJSON = JSON.stringify(operators)
      console.log('OPERATORS: ', myJSON)
      setShowBuildBoardModal(true)
   }

   // create useEffect to set checkboxes to default values
   useEffect(() => {
      setCheckboxes([0, 2, 3])
   }, [])

   // useEffect(() => {
   //    setCheckboxes([0, 2, 3])
   // }, [])

   return (
      <>
         <Form>
            <div className='giraffe_background'>
               <div className='mathOptions'>
                  <h2>Arithmetic Quiz Generator</h2>
                  <div className='optionsBordered'>
                     <label htmlFor='title'>Title: </label>
                     <input
                        className='uiInputTitle'
                        id='title'
                        type='text'
                        width={400}
                        value={title}
                        onChange={handleTitleChange}
                     />
                     <br />
                     Number of Questions:{' '}
                     <input
                        className='uiInput'
                        type='number'
                        value={numQuestions}
                        id='numQuestions'
                        min='0'
                        max='100'
                        onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                     />
                  </div>

                  <div className='optionsBordered'>
                     Where would you like the hidden answer to be?
                     <br />
                     <img src={hiddenAnswerDemo} height='80px' width='170px' />
                     <br />
                     <select
                        className='uiSelect'
                        id='userHiddenOption'
                        value={userHiddenOption}
                        onChange={(e) => {
                           setUserHiddenOption(e.target.value)
                           console.log(userHiddenOption)
                        }}
                     >
                        <option value='0'> A: [?] + 2 = 4 </option>
                        <option value='1'> B: 2 + [?] = 4 </option>
                        <option value='2'> C: 2 + 2 = [?] </option>
                        <option value='3'>RANDOM</option>
                     </select>
                  </div>

                  <div className='optionsBordered'>
                     <td
                        style={{
                           width: '150px',
                           padding: '2px 5.4px 2px 5.4px',
                           borderRight: '1px dashed brown',
                        }}
                     >
                        Select Arithmetic Operators:
                     </td>
                     <td
                        style={{
                           width: '260px',
                           padding: '5px 5.4px 2px 40px',
                           textAlign: 'left',
                           marginLeft: '50px',
                        }}
                     >
                        <div>Array: [{checkboxes.join(', ')}]</div>
                        <label className='myCheckBoxes'>
                           <Checkbox
                              type='checkbox'
                              value='0'
                              checked={checkboxes.includes(0)}
                              onChange={handleCheckboxChange}
                              defaultChecked={true}
                           />
                           {'  '}[x] Multiplication
                        </label>

                        <label className='myCheckBoxes'>
                           <Checkbox
                              disabled={true}
                              type='checkbox'
                              value='1'
                              checked={checkboxes.includes(1)}
                              onChange={handleCheckboxChange}
                              defaultChecked={false}
                           />{' '}
                           [/] Division [BETA]
                        </label>

                        <label className='myCheckBoxes'>
                           <Checkbox
                              type='checkbox'
                              value='2'
                              checked={checkboxes.includes(2)}
                              onChange={handleCheckboxChange}
                              defaultChecked={true}
                           />{' '}
                           [+] Addition
                        </label>

                        <label className='myCheckBoxes'>
                           <Checkbox
                              type='checkbox'
                              value='3'
                              checked={checkboxes.includes(3)}
                              onChange={handleCheckboxChange}
                              defaultChecked={true}
                           />{' '}
                           [-] Subtraction
                        </label>
                     </td>
                  </div>

                  <div className='optionsBordered'>
                     Select Min/Max Range for 1st & 2nd Operands:
                     <br />
                     <span
                        style={{
                           display: 'inline-block',
                           width: 200,
                           height: 100,
                           // marginLeft: 35,
                           // marginRight: 35,
                           // paddingRight: 35,
                           borderRight: '2px dotted brown',
                           textAlign: 'left',
                           width: '150px',
                           padding: '2px 10px 2px 10px',
                           margin: ' 0px 6px 0px 06px',
                        }}
                     >
                        A max: [ {aValue[1]} ]
                        <Slider
                           horizontal
                           range
                           step={1}
                           min={1}
                           max={50}
                           defaultValue={[2, 12]}
                           trackStyle={{ backgroundColor: 'lightgreen' }}
                           railStyle={{ backgroundColor: '#654321' }}
                           onChange={(value) => {
                              setAValue(value)
                           }}
                        />
                        A min: [ {aValue[0]} ]
                     </span>
                     <span
                        style={{
                           display: 'inline-block',
                           width: 200,
                           height: 100,
                           // marginLeft: 35,

                           textAlign: 'right',
                           width: '150px',
                           padding: '2px 10px 2px 10px',
                           margin: ' 0px 06px 0px 6px',
                        }}
                     >
                        B max: [{bValue[1]}]
                        <Slider
                           range
                           step={1}
                           min={1}
                           max={50}
                           defaultValue={[1, 10]}
                           onChange={(value) => {
                              setBValue(value)
                           }}
                           trackStyle={{ backgroundColor: 'orangered' }}
                           railStyle={{ backgroundColor: '#654321' }}
                        />
                        B min: [ {bValue[0]} ]
                     </span>
                     <div>
                        <br />
                     </div>
                  </div>

                  {/* CLOSE ALL TAGS */}

                  <div className='optionsBordered'>
                     Use Countdown Timer:{' '}
                     <Checkbox
                        type='checkbox'
                        checked={useCountdown}
                        onChange={handleCountdownCheck}
                     />
                     <br />
                     <input
                        className={useCountdown ? 'uiInput' : 'uiInputGrey'}
                        disabled={!useCountdown}
                        type='number'
                        value={countdownSeconds}
                        id='countdownSeconds'
                        min='0'
                        max='100'
                        onChange={(e) => setCountdownSeconds(e.target.value)}
                     />{' '}
                     seconds
                  </div>
                  {/* <div className='optionsBordered'>
                     (Optional) Notes for pupil:
                     <br />
                     <TextareaAutosize
                        aria-label='empty textarea'
                        style={{ width: '95%' }}
                        className='notes'
                        placeholder='Write any instructions for pupil(s) here.....'
                        value={notes}
                        onKeyDown={handleKeyDown}
                        id='notes'
                        onChange={(e) => setNotes(e.target.value)}
                     />
                  </div> */}

                  <div className='optionsBordered'>
                     (Optional) Notes for pupil:
                     <div className='notesQuill !important'>
                        <ReactQuill
                           value={content}
                           onChange={setContent}
                           modules={options.modules}
                           theme={options.theme}
                           placeholder='Write any instructions for pupil(s) here.....'
                           className='notesQuill !important'
                        />
                     </div>
                  </div>
               </div>

               {/* <img src='https://happygiraffe.co.uk/mygifs/26.gif' alt='mario' /> */}
               <div className='startButton'>
                  <button onClick={buildMathsBoard} className='myBtn'>
                     Build Maths Game
                  </button>
                  <br />
               </div>
            </div>
         </Form>

         {showBuildBoardModal && (
            <BuildBoard
               gameOptions={gameOptions}
               setGameOptions={setGameOptions}
               setShowBuildBoardModal={setShowBuildBoardModal}
               showBuildBoardModal={showBuildBoardModal}
            />
         )}
      </>
   )
}
