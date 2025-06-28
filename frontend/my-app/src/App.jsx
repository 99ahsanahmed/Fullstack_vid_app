import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Register from './pages/register'
import Home2 from './pages/home2'
import UploadVideo from './pages/UploadVid'
import LoginPage from './pages/login'
import UserProfile from './pages/User'
import VideoDetail from "./pages/VideoDetail";
import Instructorprofile from "./pages/Instructorprofile"
import ProtectedRoute from "./utils/protectedroutes";
import UpdatePass from './pages/UpdatePass'
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LoginPage />} />

        {/*PROTECTED ROUTES*/}
        <Route element={<ProtectedRoute />}>
          <Route path="/Userprofile" element={<UserProfile />} />
          <Route
            path="/Instructorprofile/:instructor"
            element={<Instructorprofile />}
          />
          <Route path="/home" element={<Home2 />} />
          <Route path="/video/:videoId" element={<VideoDetail />} />
          <Route path="/UploadVideo" element={<UploadVideo />} />
          <Route path="/UpdatePass" element={<UpdatePass />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
