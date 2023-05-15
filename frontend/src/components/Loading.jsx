import loading from './_img/giraffe_loading7.gif'

function Loading() {
   return (
      <div>
         <div className='loader-parent'>
            <div className='card2 w-20 p-3 mt-4'>
               <h4>Please wait</h4>
               <h2>LOADING... </h2>
               <p className='text-white'>
                  {' '}
                  <img src={loading} alt='loading' width='200px' />
               </p>
            </div>

            {/* <div className='loader'></div> */}
         </div>
      </div>
   )
}

export default Loading
