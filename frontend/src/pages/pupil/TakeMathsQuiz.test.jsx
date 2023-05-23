import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { useDispatch, useSelector } from 'react-redux'
import TakeMathsQuiz from './TakeMathsQuiz'

jest.mock('react-redux', () => ({
   useDispatch: jest.fn(),
   useSelector: jest.fn(),
}))

describe('TakeMathsQuiz', () => {
   let dispatchMock

   beforeEach(() => {
      dispatchMock = jest.fn()
      useDispatch.mockReturnValue(dispatchMock)
      useSelector.mockReturnValue({
         user: { name: 'John' },
         activeKid: { pupilId: '123', name: 'Tom' },
      })
   })

   afterEach(() => {
      jest.clearAllMocks()
   })

   it('renders without errors', () => {
      render(<TakeMathsQuiz quizId='1' onClose={jest.fn()} assignmentId='2' />)
   })

   it('displays the title', () => {
      const { getByText } = render(
         <TakeMathsQuiz quizId='1' onClose={jest.fn()} assignmentId='2' />
      )
      expect(getByText('')).toBeInTheDocument() // Add the expected title inside the getByText function
   })

   it('triggers the close function when cancel button is clicked', () => {
      const onCloseMock = jest.fn()
      const { getByText } = render(
         <TakeMathsQuiz quizId='1' onClose={onCloseMock} assignmentId='2' />
      )

      fireEvent.click(getByText('CANCEL'))

      expect(onCloseMock).toHaveBeenCalledTimes(1)
   })
})
