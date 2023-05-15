import { useEffect, useState } from 'react'
import { message } from 'antd'
import { getUserInfo } from '../apiCalls/apiUsers'
import { useDispatch, useSelector } from 'react-redux'
import { SetUser } from '../redux/usersSlice.js'
import { useNavigate } from 'react-router-dom'
import logo from '../_media/logo.png'
import { HideLoading, ShowLoading } from '../redux/loaderSlice'

import { Menu, Input, Button } from 'antd'

const { Search } = Input

export default function ProtectedRoute({ children }) {
   const [showSearch, setShowSearch] = useState(false)
   const handleSearchClick = () => {
      setShowSearch(!showSearch)
   }
   const { user } = useSelector((state) => state.users)
   const [menu, setMenu] = useState([])
   // const [collapsed, setCollapsed] = useState(false)

   const dispatch = useDispatch()
   const navigate = useNavigate()

   // console.log(user?.role)

   const basicMenu = [
      {
         title: 'Sign In',
         paths: ['/login'],
         icon: <i className='ri-login-circle-line'></i>,
         onClick: () => navigate('/login'),
      },
      {
         title: 'Create Maths Quiz',
         paths: ['/createmaths'],
         icon: <i className='ri-parentheses-line'></i>,
         onClick: () => navigate('/createmaths'),
      },
      {
         title: 'Create MultiChoice Quiz',
         paths: ['/createmulti'],
         icon: <i className='ri-checkbox-multiple-line'></i>,
         onClick: () => navigate('/createmulti'),
      },
   ]

   const userMenu = [
      {
         title: 'Home',
         paths: ['/', '/pupil/multi-quiz'],
         icon: <i className='ri-home-line'></i>,
         onClick: () => navigate('/'),
      },
      {
         title: 'Search User',
         paths: ['/search'],
         icon: <i className='ri-search-line'></i>,
         onClick: () => navigate('/search'),
      },
      {
         title: 'My Results',
         paths: ['/pupil/myresults'],
         icon: <i className='ri-bar-chart-line'></i>,
         onClick: () => navigate('/pupil/myresults'),
      },
      {
         title: 'Pupil Profile',
         paths: ['/profile'],
         icon: <i className='ri-user-line'></i>,
         onClick: () => navigate('/profile'),
      },
      {
         title: 'Logout',
         paths: ['/logout'],
         icon: <i className='ri-logout-box-line'></i>,
         onClick: () => {
            localStorage.removeItem('token')
            navigate('/login')
         },
      },
   ]

   const teacherMenu = [
      {
         title: 'All Quizzes',
         paths: ['/', '/pupil/multi-quiz'],
         icon: <i className='ri-home-4-line'></i>,
         onClick: () => navigate('/'),
      },
      {
         title: 'Search User',
         paths: ['/search'],
         icon: <i className='ri-search-line'></i>,
         onClick: () => navigate('/search'),
      },
      {
         title: 'My Quizzes',
         paths: ['/teacher/quiz', '/teacher/quiz/add'],
         icon: <i class='ri-dashboard-line'></i>,
         onClick: () => navigate('/teacher/quiz'),
      },
      {
         title: 'Class Results',
         paths: ['/teacher/results'],
         icon: <i className='ri-bar-chart-line'></i>,
         onClick: () => navigate('/teacher/results'),
      },
      {
         title: 'Pupils',
         paths: ['/pupils'],
         icon: <i className='ri-graduation-cap-line'></i>,
         onClick: () => navigate('/pupils'),
      },
      {
         title: 'Teacher Profile',
         paths: ['/profile'],
         icon: <i className='ri-user-line'></i>,
         onClick: () => navigate('/profile'),
      },
      {
         title: 'Logout',
         paths: ['/logout'],
         icon: <i className='ri-logout-box-line'></i>,
         onClick: () => {
            localStorage.removeItem('token')
            navigate('/login')
         },
      },
   ]
   //test
   const getUserData = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getUserInfo()
         dispatch(HideLoading())
         if (response.success) {
            message.success(response.message)
            // use redux to set user in state
            dispatch(SetUser(response.data))
            if (response.data.role === 2) {
               setMenu(teacherMenu)
            } else if (response.data.role === 1) {
               setMenu(teacherMenu)
            } else if (response.data.role === 0) {
               setMenu(userMenu)
            }
         } else {
            message.error(response.message)
            setMenu(basicMenu)
         }
      } catch (error) {
         // navigate('/login')
         dispatch(HideLoading())
         message.error(error.message)
         setMenu(basicMenu)
      }
   }

   useEffect(() => {
      if (localStorage.getItem('token')) {
         getUserData()
      } else {
         navigate('/')
         setMenu(basicMenu)
      }
      // eslint-disable-next-line
   }, [])

   const activeRoute = window.location.pathname

   const getIsActiveOrNot = (paths) => {
      if (
         paths.includes(activeRoute) ||
         (activeRoute.includes('/teacher/edit-multi-by-id') &&
            paths.includes('/teacher/quiz')) ||
         (activeRoute.includes('/pupil/multi-quiz') &&
            paths.includes('/pupil/multi-quiz'))
      ) {
         return true
      } else {
         return false
      }
   }

   let userRole
   let userRoleInt = user?.role
   if (userRoleInt === 2) {
      userRole = 'ADMIN'
   } else if (userRoleInt === 1) {
      userRole = 'TEACHER'
   } else if (userRoleInt === 0) {
      userRole = 'GUARDIAN/PUPIL'
   } else {
      userRole = 'NotLoggedIn'
   }

   return (
      <>
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
               marginBottom: '100px',
            }}
         >
            <Menu.ItemGroup
               title={
                  <img src={logo} width='240px' alt='logo' style={{ width: '200px' }} />
               }
               style={{ justifyContent: 'flex-start', display: 'flex' }}
            />
            {userRoleInt && (
               <Menu.Item key='search'>
                  <Button type='primary' onClick={handleSearchClick}>
                     Search
                  </Button>
                  {showSearch && (
                     <div
                        style={{
                           marginTop: '1px',
                           color: 'brown !important',
                           opacity: 1,
                        }}
                     >
                        <Search
                           placeholder='Search'
                           inputStyle={{ color: 'brown !important' }}
                           enterButton
                        />
                     </div>
                  )}
               </Menu.Item>
            )}
            <Menu.Item className='menu-item'>
               {user?.name}
               {'   '} [{userRole}]
            </Menu.Item>
            {/* <Menu.Item key='home' style={{ marginLeft: 'auto' }}>
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
            </Menu.Item> */}
            {menu.map((item, index) => {
               return (
                  <Menu.Item
                     className={`menu-item ${
                        getIsActiveOrNot(item.paths) && 'active-menu-item'
                     }`}
                     key={index}
                     onClick={item.onClick}
                  >
                     {item.icon}
                     <span>{item.title}</span>
                  </Menu.Item>
               )
            })}
         </Menu>

         <div className='layout'>
            {/* <div className='flex gap-2 w-full h-full h-100'> */}
            {/* <div className='sidebar'> */}
            {/* <div className='menu'> */}
            {/* {menu.map((item, index) => {
                        return (
                           <div
                              className={`menu-item ${
                                 getIsActiveOrNot(item.paths) && 'active-menu-item'
                              }`}
                              key={index}
                              onClick={item.onClick}
                           >
                              {item.icon}
                              {!collapsed && <span>{item.title}</span>}
                           </div>
                        )
                     })} */}
            {/* </div> */}
            {/* </div> */}

            {/* <div className='body'> */}
            {/* <div className='header flex justify-between'> */}
            {/* {!collapsed && (
                        <i
                           className='ri-close-line'
                           onClick={() => setCollapsed(true)}
                        ></i>
                     )} */}
            {/* {collapsed && (
                        <i
                           className='ri-menu-line'
                           onClick={() => setCollapsed(false)}
                        ></i>
                     )} */}
            {/* <h1 className='text-2xl text-white'>
                        <img src={logo} alt='Logo' width='240px' />
                     </h1> */}
            {/* <div>
                        <div className='flex gap-1 items-center'>
                           <h1 className='text-md text-white'>{user?.name}</h1>
                        </div>
                        <span></span>
                     </div> */}
            {/* </div> */}
            <div className='content'>{children}</div>
         </div>
         {/* </div> */}
         {/* </div> */}
      </>
   )
}
