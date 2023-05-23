import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useDispatch, useSelector } from 'react-redux'
import Homework from './Homework'

// Mock the react-redux hooks
jest.mock('react-redux', () => ({
   useDispatch: jest.fn(),
   useSelector: jest.fn(),
}))

describe('Homework', () => {
   beforeEach(() => {
      jest.clearAllMocks()
   })

   test('renders Homework component', () => {
      render(<Homework />)

      // Assert the rendering of the component
      expect(screen.getByText('NO KID SELECTED')).toBeInTheDocument()
      expect(screen.getByText('HOMEWORK')).toBeInTheDocument()
      expect(screen.getByText('GET HOMEWORK')).toBeInTheDocument()
   })

   test('fetches assignments on button click', async () => {
      const mockDispatch = jest.fn()
      const mockSelector = jest.fn()

      useDispatch.mockReturnValue(mockDispatch)
      useSelector.mockReturnValueOnce(null).mockReturnValueOnce([])

      render(<Homework />)

      userEvent.click(screen.getByText('GET HOMEWORK'))

      await waitFor(() => {
         expect(mockDispatch).toHaveBeenCalledTimes(2)
         expect(screen.getByText('NO ASSIGNMENTS FOUND')).toBeInTheDocument()
      })
   })
})
