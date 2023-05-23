import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TakeMultiQuiz from './TakeMultiQuiz'

describe('TakeMultiQuiz', () => {
   beforeEach(() => {
      render(<TakeMultiQuiz />)
   })

   test('renders the quiz title', () => {
      const titleElement = screen.getByRole('heading', { level: 2 })
      expect(titleElement).toBeInTheDocument()
   })

   test('displays the instructions by default', () => {
      const instructionsElement = screen.getByText('instructions')
      expect(instructionsElement).toBeInTheDocument()
   })

   test('allows selecting an option and clicking next', () => {
      const optionButton = screen.getByRole('button', { name: /option/i })
      userEvent.click(optionButton)

      const nextButton = screen.getByRole('button', { name: /next/i })
      userEvent.click(nextButton)

      const nextQuestionElement = screen.getByText('next question')
      expect(nextQuestionElement).toBeInTheDocument()
   })
})
