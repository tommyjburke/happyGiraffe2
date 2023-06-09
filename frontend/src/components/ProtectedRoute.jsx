import { useEffect, useState } from 'react'
import { useRef } from 'react'

import { getUserInfo, getUserPupils } from '../_apiCalls/apiUsers'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../redux/usersSlice.js'

import { setKids } from '../redux/kidsSlice.js'
import { setActiveKid } from '../redux/activeKidSlice.js'
import { useNavigate } from 'react-router-dom'
import logo from '../_media/logo.png'
import { HideLoading, ShowLoading } from '../redux/loaderSlice'
import { DownOutlined, UserOutlined, StopTwoTone } from '@ant-design/icons'
import { Menu, Button, message, Space, Input, Dropdown } from 'antd'

const { Search } = Input

export default function ProtectedRoute({ children }) {
   const [showSearch, setShowSearch] = useState(false)
   const [userData, setUserData] = useState({})
   const [userPupils, setUserPupils] = useState([])
   const [userRole, setUserRole] = useState()
   const [showButton, setShowButton] = useState(false)
   const [profileColour, setProfileColour] = useState('teacherProfile')
   const [currentUser, setCurrentUser] = useState('')
   const [navClass, setNavClass] = useState('')
   const { user } = useSelector((state) => state.users)
   let mainUser = user?.name
   const { kids } = useSelector((state) => state.kids)
   const { activeKid } = useSelector((state) => state.activeKid)
   const [menu, setMenu] = useState([])
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const basicMenu = [
      {
         title: 'Create Maths Quiz',
         paths: ['/createmaths'],
         icon: <i className='ri-parentheses-line'></i>,
         onClick: () => navigate('/createmaths'),
      },
      // {
      //    title: 'Create MultiChoice Quiz',
      //    paths: ['/createmulti'],
      //    icon: <i className='ri-checkbox-multiple-line'></i>,
      //    onClick: () => navigate('/createmulti'),
      // },
      {
         title: 'Sign In',
         paths: ['/login'],
         icon: <i className='ri-login-circle-line'></i>,
         onClick: () => navigate('/login'),
      },
   ]

   const kidMenu = [
      {
         index: 1,
         title: 'My Homework',
         paths: ['/pupil/homework'],
         onClick: () => navigate('/pupil/homework'),
      },
      {
         index: 3,
         title: 'My Results',
         paths: ['/pupil/myresults'],
         onClick: () => navigate('/pupil/myresults'),
      },
      {
         index: 4,
         title: 'Find Teacher',
         paths: ['/pupil/find-teacher'],
         onClick: () => navigate('/pupil/find-teacher'),
      },

      {
         index: 5,
         title: 'Logout',
         paths: ['/logout'],
         onClick: () => {
            localStorage.removeItem('token')
            localStorage.removeItem('activeKid')
            navigate('/login')
         },
      },
   ]

   const teacherMenu = [
      {
         title: 'All Quizzes',
         paths: ['/'],
         // icon: <i className='ri-home-4-line'></i>,
         onClick: () => navigate('/'),
      },
      // {
      //    title: 'Search User',
      //    paths: ['/search'],
      //    icon: <i className='ri-search-line'></i>,
      //    onClick: () => navigate('/search'),
      // },
      {
         title: 'Assignments',
         paths: ['/teacher/assignments'],
         onClick: () => navigate('/teacher/assignments'),
      },
      {
         title: 'Quizzes',
         paths: ['/teacher/quiz', '/teacher/quiz/add'],
         onClick: () => navigate('/teacher/quiz'),
      },

      {
         title: 'Results',
         paths: ['/teacher/results'],
         onClick: () => navigate('/teacher/results'),
      },
      {
         title: 'Kids/Pupils',
         paths: ['/teacher/pupils-dashboard'],
         onClick: () => navigate('/teacher/pupils-dashboard'),
      },
      {
         title: 'Profile',
         paths: ['/teacher/profile'],
         onClick: () => navigate('/teacher/profile'),
      },
      {
         title: 'Logout',
         paths: ['/logout'],
         onClick: () => {
            localStorage.removeItem('token')
            localStorage.removeItem('activeKid')
            navigate('/login')
         },
      },
   ]

   const getMyPupilsData = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getUserPupils()
         dispatch(HideLoading())
         if (response.success) {
            dispatch(setKids(response.data))
            setUserPupils(response.data)
            // console.log('_______USERPUPILS SET_________', userPupils)
         } else {
            message.error('PRoBLEM ', response.message)
         }
      } catch (error) {
         console.log(error)
         dispatch(HideLoading())
         message.error('Something went wrong', error.message)
      }
   }

   const getUserData = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getUserInfo()
         dispatch(HideLoading())
         if (response.success) {
            message.success('Logged In', [0.9])

            // use redux to set user in redux state
            dispatch(setUser(response.data))
            setUserData(response.data)
            // console.log(response.data)
         } else {
            message.warning(response.message)
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
         getMyPupilsData()
      } else {
         navigate('/')
         setMenu(basicMenu)
      }
      // eslint-disable-next-line
   }, [!userData])

   useEffect(() => {
      // Retrieve activeKid from localStorage

      const storedActiveKid = JSON.parse(localStorage.getItem('activeKid'))
      // const storedActiveKid = localStorage.getItem('activeKid')
      // console.log('storedActiveKid', storedActiveKid)

      if (storedActiveKid) {
         message.success('Child: ' + JSON.stringify(storedActiveKid.name))
         setNavClass('childNavBar')
         // Dispatch activeKid to Redux
         // dispatch(setActiveKid(JSON.parse(storedActiveKid)))
         setMenu(kidMenu)
         setProfileColour('childProfile')
         // console.log('KIDDDDDDD MEWNUUUUUU')

         dispatch(setActiveKid(storedActiveKid))
         setCurrentUser(storedActiveKid.name)

         // dispatch(setActivePupil(selectedPupil))

         setShowButton(true)
         // message.info('Child: ' + JSON.stringify(storedActiveKid.name))
      } else if (user) {
         setCurrentUser(user.name)
         setMenu(teacherMenu)
         setProfileColour('teacherProfile')
      } else {
         setMenu(basicMenu)
         setProfileColour('teacherProfile')
      }
   }, [userData])

   const activeRoute = window.location.pathname

   const getIsActiveOrNot = (paths) => {
      if (
         paths.includes(activeRoute) ||
         (activeRoute.includes('/teacher/quiz/edit-exam-by-id') &&
            paths.includes('/teacher/quiz')) ||
         (activeRoute.includes('/user/multi-quiz') && paths.includes('/user/multi-quiz'))
      ) {
         return true
      } else {
         return false
      }
   }

   // function clearActiveKid() {
   //    localStorage.removeItem('activeKid')
   // }

   function exitKidMode() {
      dispatch(setActiveKid(null))
      setNavClass(' ')
      setCurrentUser(user.name)
      localStorage.removeItem('activeKid')
      setMenu(teacherMenu)
      setShowButton(false)
      navigate('/')
      setProfileColour('teacherProfile')
   }

   const selectKidClick = (e) => {
      setNavClass('childNavBar')
      console.log('click', e)
      const selectedPupil = userPupils.find((pupil) => pupil.pupilId === e.key)
      console.log('selectedPupil', selectedPupil)

      dispatch(setActiveKid(selectedPupil))
      setCurrentUser(selectedPupil.name)
      console.log('****____selectedpupil___******', selectedPupil)
      message.success('Selected: ' + JSON.stringify(selectedPupil.name))
      // dispatch(setActivePupil(selectedPupil))
      setMenu(kidMenu)
      setProfileColour('childProfile')
      setShowButton(true)
      navigate('/pupil/homework')
   }

   const items = userPupils.map(({ pupilId, name }) => ({
      key: pupilId,
      label: name,
      icon: <UserOutlined />,
   }))

   const menuProps = {
      items,
      onClick: selectKidClick,
   }

   let profileType
   const handleSearchClick = () => {
      setShowSearch(!showSearch)
   }

   return (
      <>
         <Menu mode='horizontal' className={`${profileColour} space-between`}>
            <Menu.ItemGroup
               className='transparent !important'
               title={
                  <img
                     src={logo}
                     height='55px'
                     alt='logo'
                     className='transparent !important'
                  />
               }
               style={{ justifyContent: 'flex-start', display: 'flex' }}
            />

            {/* <Menu.Item className='menu-item'>
               {user?.name}
               {'   '} [{userRole}]
            </Menu.Item> */}

            <Space
               wrap
               style={{
                  backgroundColor: 'transparent',
                  position: 'relative !important',
                  top: '-0.3em !important',
               }}
            >
               {user && (
                  <Dropdown
                     menu={menuProps}
                     style={{
                        position: 'relative !important',
                        top: '-0.3em !important',
                     }}
                  >
                     <Button style={{ fontSize: '1.2em', fontFamily: 'schoolbell' }}>
                        <Space
                           style={{
                              fontSize: '1.2em',
                              fontFamily: 'schoolbell',
                              position: 'relative',
                              top: '-0.3em',
                           }}
                        >
                           User: {currentUser}
                           {/* CHILD */}
                           {/* {activePupil.username || 'Select Child'} */}
                           <DownOutlined />
                        </Space>
                     </Button>
                  </Dropdown>
               )}
               {showButton && (
                  <Space wrap>
                     <Button
                        type='primary'
                        style={{
                           gap: '0.1px',
                           top: '-0.3em',
                           // fontSize: '1.4em',
                           // fontFamily: 'Gaegu , cursive !important',
                        }}
                        onClick={() => exitKidMode()}
                     >
                        Grown-Up
                     </Button>
                  </Space>
               )}
            </Space>

            {menu.map((item, index) => {
               return (
                  <Space wrap style={{ backgroundColor: 'transparent' }}>
                     <Menu.Item
                        className={`menu-item  ${
                           getIsActiveOrNot(item.paths) && 'active-menu-item'
                        }`}
                        key={index}
                        style={{
                           backgroundColor: 'transparent',
                           // fontFamily: 'schoolbell',
                           fontSize: '1.0em !important',
                        }}
                        onClick={item.onClick}
                     >
                        {item.icon}
                        <>{item.title}</>
                     </Menu.Item>
                  </Space>
               )
            })}
         </Menu>

         <div className='layout'>
            <div>{children}</div>
         </div>
      </>
   )
}
