import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
const Instructorprofile = () => {
  const [foundTutor , setFoundTutor] = useState();
  const {instructor} = useParams(null);

 
  const getTutors = async ()=>{
    try {
      const res = await axios.get("http://localhost:8000/api/v1/users/getAllTutors", 
      {
        withCredentials: true,
      });
      console.log(res.data.data)
      const tutors = res.data.data;
      const tempt = tutors.find((t) => t.username == instructor);
      setFoundTutor(tempt);
    } catch (error) {
      console.log('error fetching tutor')
    }
  }

   useEffect(() => {
     getTutors();
   }, []);



  return (
    <div>
      <h1>hello</h1>
      <h1>{foundTutor?.username}</h1>
      <h1>{foundTutor?.city}</h1>
      <h1>{foundTutor?.company}</h1>
      <h1>{foundTutor?.fullname}</h1>
      <h1>{foundTutor?.fullname}</h1>
    </div>
  );
}

export default Instructorprofile