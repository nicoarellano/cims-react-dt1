//this will be the 
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

const api = axios.create({ //listing on port 5000 or process.env.PORT
  baseURL: 'http://localhost:5000'
})

function Form() {
  const [form, setform] = useState({
    name: '',
    mobile: '',
    email: '',
    dropdown: '',
    order: ''
  })

  const inputHandler = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }

  const submitButton = (e) => {
    e.preventDefault()
    console.log(form)

    if (form.name === '' || form.mobile === '' || form.email === '' || form.dropdown === '' || form.order === '') {
      alert('Please fill all the fields')
    }
    else {
      const request = {
        ...form
      }

      const db_request = await api.get('/createdb')
      console.log(db_request)
      const table_request = await api.get('/createtable')
      console.log(table_request)
      const response = await api.post('/insert', request)
      console.log(response)
      resetButton()
    }
  }

  const resetButton = (e) => {
    setform({
      name: '',
      mobile: '',
      email: '',
      dropdown: '',
      order: ''
    })
  }

  return (
    <>
      <div className="container mt-3 mb-3">
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">Name</label>
          <input type="name" name="name" className="form-control" value={form.name}
            onChange={inputHandler} id="exampleFormControlInput1" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">Mobile</label>
          <input type="mobile" value={form.mobile} onChange={inputHandler}
            name="mobile" className="form-control" id="exampleFormControlInput1" />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
          <input type="email" value={form.email} onChange={inputHandler}
            name="email" className="form-control" id="exampleFormControlInput1"
            placeholder="name@example.com" />
        </div>
        <div className="mb-3">
          <label htmlFor="sel1">Menu</label>
          <select name="dropdown" value={form.dropdown} className="form-control" id="sel1" onChange={inputHandler}>
            <option value="Select">Select</option>
            <option value="Veg Biryani">Veg Biryani</option>
            <option value="BBQ Chicken Wings">BBQ Chicsken Wings</option>
            <option value="Rasmalai">Rasmlai</option>
            <option value="Beer">Beer</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleFormControlTextarea1" className="form-label">Order Details</label>
          <textarea name="order" value={form.order} onChange={inputHandler}
            className="form-control" id="exampleFormControlTextarea1"
            rows="3"></textarea>
        </div>
        <div className="mb-3">
          <button type='submit' onClick={submitButton} className="btn btn-success">Submit</button>
          <button type='reset' onClick={resetButton} className="btn btn-danger">Cancel</button>
        </div>
      </div>
    </>
  )
}
export default Form;
