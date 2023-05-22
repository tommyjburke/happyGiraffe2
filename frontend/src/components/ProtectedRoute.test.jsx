// import { JSDOM } from 'jsdom'

// const { window } = new JSDOM('<!doctype html><html><body></body></html>')
// global.window = window
// global.document = window.document
// global.navigator = {
//    userAgent: 'node.js',
// }
import React from 'react'
import { render, screen } from '@testing-library/react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../redux/usersSlice'
import { setKids } from '../redux/kidsSlice'
import { BrowserRouter as Router } from 'react-router-dom' // Import the Router component

import ProtectedRoute from './ProtectedRoute'
jest.mock('../_media/logo.png', () => 'logo.png')
jest.mock('react-redux') // mock image and redux
describe('ProtectedRoute component', () => {
   beforeEach(() => {
      // prepare mock values
      useDispatch.mockReturnValue(jest.fn())
      useSelector.mockReturnValue({
         user: {
            name: 'Joe Bloggs',
         },
         kids: [],
         activeKid: null,
      })
   })
   afterEach(() => {
      // clear mock values to clean state
      useDispatch.mockClear()
      useSelector.mockClear()
   })
   // testing of routing functionality.
   // simple test to check component renders without errors.
   test('renders without errors', () => {
      render(
         <Router>
            {/* Wrap the component with the Router */}
            <ProtectedRoute />
         </Router>
      )
   })
})
