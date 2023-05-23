import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import Home from './Home'
import { getAllMultis, getAllMaths } from '../_apiCalls/apiCalls'
import { ShowLoading, HideLoading } from '../redux/loaderSlice'
import Greeting from '../components/Greeting'
import TakeMathsQuiz from './pupil/TakeMathsQuiz'
import TakeMultiQuiz from './pupil/TakeMultiQuiz'

jest.mock('react-redux', () => ({
   useDispatch: jest.fn(),
   useSelector: jest.fn(),
}))
jest.mock('react-router-dom', () => ({
   useNavigate: jest.fn(),
}))
jest.mock('../_apiCalls/apiCalls', () => ({
   getAllMultis: jest.fn(),
   getAllMaths: jest.fn(),
}))
jest.mock('moment', () =>
   jest.fn(() => ({
      fromNow: jest.fn(() => '2 hours ago'),
   }))
)

describe('Home', () => {
   beforeEach(() => {
      useDispatch.mockClear()
      useSelector.mockClear()
      useNavigate.mockClear()
      getAllMultis.mockClear()
      getAllMaths.mockClear()
      moment.mockClear()
   })

   test('renders Greeting component and shows multis and maths quizzes', async () => {
      const dispatchMock = jest.fn()
      useDispatch.mockReturnValue(dispatchMock)

      useSelector.mockImplementation((selector) =>
         selector({
            activeKid: { activeKid: 'someActiveKid' },
            users: { user: { name: 'John' } },
         })
      )

      const multisData = [
         {
            _id: '1',
            type: 'MULTIPLE CHOICE',
            title: 'Multiple Choice Quiz',
            questions: [{ id: '1', text: 'Question 1' }],
            useCountdown: true,
            countdownSeconds: 60,
            updatedAt: '2023-05-21T10:00:00.000Z',
         },
      ]
      getAllMultis.mockResolvedValue({ success: true, data: multisData })

      const mathsQuizzesData = [
         {
            _id: '2',
            type: 'MATHS',
            gameOptions: {
               title: 'Maths Quiz',
               numQuestions: 5,
               useCountdown: false,
               operators: [0, 1, 2],
            },
            updatedAt: '2023-05-20T08:00:00.000Z',
         },
      ]
      getAllMaths.mockResolvedValue({ success: true, data: mathsQuizzesData })

      render(<Home />)

      await waitFor(() => {
         expect(screen.getByText('Home: Homework')).toBeInTheDocument()
         expect(screen.getByText('MULTIPLE CHOICE')).toBeInTheDocument()
         expect(screen.getByText('Multiple Choice Quiz')).toBeInTheDocument()
         expect(screen.getByText('Questions: 1')).toBeInTheDocument()
         expect(screen.getByText('Timer: 60')).toBeInTheDocument()
         expect(screen.getByText('Start Quiz')).toBeInTheDocument()
         expect(screen.getByText('MATHS')).toBeInTheDocument()
         expect(screen.getByText('Maths Quiz')).toBeInTheDocument()
         expect(screen.getByText('Questions: 5')).toBeInTheDocument()
         expect(screen.getByText('No Timer')).toBeInTheDocument()
         expect(screen.getByText('Math types: [x, /, +]')).toBeInTheDocument()
         expect(screen.getByText('Start Quiz')).toBeInTheDocument()
         expect(screen.getByText('2 hours ago')).toBeInTheDocument()
      })

      expect(dispatchMock).toHaveBeenCalledWith(ShowLoading())
      expect(getAllMultis).toHaveBeenCalled()
      expect(getAllMaths).toHaveBeenCalled()
      expect(dispatchMock).toHaveBeenCalledWith(HideLoading())
   })

   test('navigates to /pupil/homework when activeKid is true', () => {
      useSelector.mockImplementation((selector) =>
         selector({
            activeKid: { activeKid: true },
            users: { user: { name: 'John' } },
         })
      )

      const navigateMock = jest.fn()
      useNavigate.mockReturnValue(navigateMock)

      render(<Home />)

      expect(navigateMock).toHaveBeenCalledWith('/pupil/homework')
   })

   test('starts maths quiz when Start Quiz button is clicked', async () => {
      const dispatchMock = jest.fn()
      useDispatch.mockReturnValue(dispatchMock)

      useSelector.mockImplementation((selector) =>
         selector({
            activeKid: { activeKid: 'someActiveKid' },
            users: { user: { name: 'John' } },
         })
      )

      const mathsQuizzesData = [
         {
            _id: '2',
            type: 'MATHS',
            gameOptions: {
               title: 'Maths Quiz',
               numQuestions: 5,
               useCountdown: false,
               operators: [0, 1, 2],
            },
            updatedAt: '2023-05-20T08:00:00.000Z',
         },
      ]
      getAllMaths.mockResolvedValue({ success: true, data: mathsQuizzesData })

      render(<Home />)

      await waitFor(() => {
         expect(screen.getByText('Start Quiz')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Start Quiz'))

      expect(screen.getByText('Maths Quiz')).toBeInTheDocument()
      expect(screen.getByText('2 hours ago')).toBeInTheDocument()
      expect(dispatchMock).toHaveBeenCalledWith(ShowLoading())
      expect(dispatchMock).toHaveBeenCalledWith(HideLoading())
   })

   test('starts multiple choice quiz when Start Quiz button is clicked', async () => {
      const dispatchMock = jest.fn()
      useDispatch.mockReturnValue(dispatchMock)

      useSelector.mockImplementation((selector) =>
         selector({
            activeKid: { activeKid: 'someActiveKid' },
            users: { user: { name: 'John' } },
         })
      )

      const multisData = [
         {
            _id: '1',
            type: 'MULTIPLE CHOICE',
            title: 'Multiple Choice Quiz',
            questions: [{ id: '1', text: 'Question 1' }],
            useCountdown: true,
            countdownSeconds: 60,
            updatedAt: '2023-05-21T10:00:00.000Z',
         },
      ]
      getAllMultis.mockResolvedValue({ success: true, data: multisData })

      render(<Home />)

      await waitFor(() => {
         expect(screen.getByText('Start Quiz')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Start Quiz'))

      expect(screen.getByText('Multiple Choice Quiz')).toBeInTheDocument()
      expect(screen.getByText('2 hours ago')).toBeInTheDocument()
      expect(dispatchMock).toHaveBeenCalledWith(ShowLoading())
      expect(dispatchMock).toHaveBeenCalledWith(HideLoading())
   })

   test('renders message for signed out user and navigation buttons', () => {
      useSelector.mockImplementation((selector) =>
         selector({
            activeKid: { activeKid: null },
            users: { user: null },
         })
      )

      const navigateMock = jest.fn()
      useNavigate.mockReturnValue(navigateMock)

      render(<Home />)

      expect(screen.getByText('You have not signed in.')).toBeInTheDocument()
      expect(screen.getByText('+ CREATE MATHS QUIZ')).toBeInTheDocument()
      expect(screen.getByText('+ CREATE MULTIPLE CHOICE')).toBeInTheDocument()

      fireEvent.click(screen.getByText('+ CREATE MATHS QUIZ'))
      expect(navigateMock).toHaveBeenCalledWith('/teacher/add-maths')

      fireEvent.click(screen.getByText('+ CREATE MULTIPLE CHOICE'))
      expect(navigateMock).toHaveBeenCalledWith('/teacher/add-multi')
   })
})
