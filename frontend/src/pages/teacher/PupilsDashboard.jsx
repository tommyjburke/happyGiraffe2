import { getUserConnections, getUserPupils } from '../../_apiCalls/apiUsers'
import { useEffect, useState } from 'react'
import AddPupilForm from './AddChildForm'
import { useDispatch } from 'react-redux'
import { ShowLoading, HideLoading } from '../../redux/loaderSlice'
import { Radio, Tabs } from 'antd'
import MyKids from './MyKids'
import MyPupils from './MyPupils'
import MyClasses from './MyClasses'

export default function PupilsDashboard() {
   // const [size, setSize] = useState('small')
   // const onChange = (e) => {
   //    setSize(e.target.value)
   // }
   const tabs = [
      {
         key: '1',
         label: `My Children`,
         children: <MyKids />,
      },
      {
         key: '2',
         label: `All My Pupils`,
         children: <MyPupils />,
      },
      {
         key: '3',
         label: `My Classes`,
         children: <MyClasses />,
      },
   ]

   return (
      <div className='container'>
         <h1>Pupils Dashboard</h1>
         <div className='divider'></div>
         <div>
            <Tabs
               className='ant-customTabs !important'
               defaultActiveKey='1'
               type='card'
               size='large'
               items={tabs}
               centered
               direction='left'
               animated
            />
         </div>

         {/* <MyKids /> */}
      </div>
   )
}
