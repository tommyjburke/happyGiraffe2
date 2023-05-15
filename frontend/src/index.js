import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import 'antd/dist/reset.css'
import reportWebVitals from './reportWebVitals'
import store from './redux/store'
import { Provider } from 'react-redux'
import logo from './logo.png'
import { message } from 'antd'
import './_stylesheets/antd-styles.css'

const bottom = {
   getContainer: () => document.body,
   duration: 2, // customize the duration of the message display
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
   <Provider store={store}>
      <App />
   </Provider>
)

reportWebVitals()

// import React, { useState } from "react"
// import { render } from "react-dom"
// import { DatePicker, message } from "antd"
// import "antd/dist/reset.css"
// import "./index.css"

// const App = () => {
//   const [date, setDate] = useState(null)
//   const handleChange = (value) => {
//     message.info(
//       `Selected Date: ${value ? value.format("DD-MM-YYYY") : "None"}`
//     )
//     setDate(value)
//   }
//   return (
//     <div style={{ width: 400, margin: "100px auto" }}>
//       <DatePicker onChange={handleChange} />
//       <div style={{ marginTop: 16 }}>
//         Selected Date: {date ? date.format("DD-MM-YYYY") : "None"}
//       </div>
//     </div>
//   )
// }

// render(<App />, document.getElementById("root"))
