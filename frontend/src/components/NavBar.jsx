import React, { useState } from 'react'

import { Menu, Input, Button } from 'antd'

const { Search } = Input

function NavBar() {
   const [showSearch, setShowSearch] = useState(false)
   const handleSearchClick = () => {
      setShowSearch(!showSearch)
   }

   return (
      // <nav
      //    style={{
      //       position: 'fixed',
      //       top: 0,
      //       left: 0,
      //       right: 0,
      //       // backgroundColor: '#654321',
      //       color: '#fff',
      //       // opacity: 0.8,
      //       borderBottom: '0px solid brown',
      //       color: 'white',
      //    }}
      // >
      //    <ul
      //       className='navbarFont'
      //       style={{
      //          display: 'flex',
      //          justifyContent: 'space-around',
      //          listStyleType: 'none',
      //          padding: 0,
      //          color: 'white',
      //          color: '#fff',
      //          fontSize: '1.2rem',
      //       }}
      //    >
      //       <li>
      //          <a href='#' style={{ color: '#fff' }}>
      //             Home
      //          </a>
      //       </li>
      //       <li>
      //          <a href='#' style={{ color: '#fff' }}>
      //             About
      //          </a>
      //       </li>
      //       <li className='navbarFont !important'>
      //          <a
      //             className='navbarFont !important'
      //             href='#'
      //             style={{ color: '#fff !important' }}
      //          >
      //             Contact
      //          </a>
      //       </li>
      //    </ul>
      <Menu
         mode='horizontal'
         style={{
            backgroundColor: '#654321',
            opacity: 0.8,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '50px',
         }}
      >
         <Menu.ItemGroup
            title={<img src='logo.png' alt='logo' style={{ width: '50px' }} />}
            style={{ justifyContent: 'flex-start', display: 'flex' }}
         />
         <Menu.Item key='search'>
            <Button type='primary' onClick={handleSearchClick}>
               Search
            </Button>
            {showSearch && (
               <div style={{ marginTop: '1px', color: 'brown !important', opacity: 1 }}>
                  <Search
                     placeholder='Search'
                     inputStyle={{ color: 'brown !important' }}
                     enterButton
                  />
               </div>
            )}
         </Menu.Item>
         <Menu.Item key='home' style={{ marginLeft: 'auto' }}>
            <a className='navbarFont' href='#' style={{ color: '#fff' }}>
               Test1
            </a>
         </Menu.Item>
         <Menu.Item key='about'>
            <a className='navbarFont' href='#' style={{ color: '#fff' }}>
               Test2
            </a>
         </Menu.Item>
         <Menu.Item key='contact' style={{ marginRight: 'auto' }}>
            <a className='navbarFont' href='#' style={{ color: '#fff' }}>
               Test3
            </a>
         </Menu.Item>
      </Menu>

      // </nav>
   )
}

export default NavBar
