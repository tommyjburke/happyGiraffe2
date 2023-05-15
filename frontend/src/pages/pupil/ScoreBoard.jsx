import React from 'react'
import { Progress, Space } from 'antd'

export default function ScoreBoard({ currentPercentage, right, wrong }) {
   return (
      <>
         <div
            className='flex flex-col items-center gap-2 greenFont'
            style={{ fontFamily: 'schoolbell' }}
         >
            {/* {currentPercentage}% */}
         </div>
         <div>
            ✅ <span className='scoreGreen'>{right}</span> :{' '}
            <span className='scoreRed'>{wrong}</span>❌
         </div>
         {/* <Space wrap> */}
         <div>
            <Progress
               // type='circle'
               percent={currentPercentage}
               // size={75}
               width={75}
               height={75}
               strokeWidth={20}
               strokeColor={{
                  '0%': 'red',
                  '100%': 'green',
               }}
            />
         </div>
         {/* </Space> */}
      </>
   )
}
//
