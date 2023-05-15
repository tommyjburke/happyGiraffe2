import { useNavigate } from 'react-router-dom'

export function ProtectedRouteMenuBasic() {
   const navigate = useNavigate()
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
}
export function ProtectedRouteMenuPupil() {
   const navigate = useNavigate()
   const pupilMenu = [
      {
         title: 'My Homework',
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
         title: 'My Results',
         paths: ['/pupil/myresults'],
         icon: <i className='ri-bar-chart-line'></i>,
         onClick: () => navigate('/pupil/myresults'),
      },
      {
         title: 'Exit Pupil Profile',
      },
   ]
}

export function ProtectedRouteMenuUser() {
   const navigate = useNavigate()
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
         // icon: <i className='ri-bar-chart-line'></i>,
         onClick: () => navigate('/pupil/myresults'),
      },
      {
         title: 'Pupil Profile',
         paths: ['/profile'],
         // icon: <i className='ri-user-line'></i>,
         onClick: () => navigate('/profile'),
      },
      {
         title: 'Logout',
         paths: ['/logout'],
         // icon: <i className='ri-logout-box-line'></i>,
         onClick: () => {
            localStorage.removeItem('token')
            navigate('/login')
         },
      },
   ]
}
export function ProtectedRouteMenuTeacher() {
   const navigate = useNavigate()
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
         // icon: <i class='ri-dashboard-line'></i>,
         onClick: () => navigate('/teacher/quiz'),
      },
      {
         title: 'Class Results',
         paths: ['/teacher/results'],
         // icon: <i className='ri-bar-chart-line'></i>,
         onClick: () => navigate('/teacher/results'),
      },
      {
         title: 'My Kids/Pupils',
         paths: ['/pupils'],
         // icon: <i className='ri-graduation-cap-line'></i>,
         onClick: () => navigate('/pupils'),
      },
      {
         title: 'My Profile',
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
}
