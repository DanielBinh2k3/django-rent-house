import {BrowserRouter as Router, Route, Routes} from 'react-router-dom' 
import "./App.css"
import Home from "./components/home/Home"
import About from "./components/about/About"
import Blog from "./components/blog/Blog"
import Pricing from "./components/pricing/Pricing"
import Contact from "./components/contact/Contact"
import Header from './components/common/header/Header'
import Footer from './components/common/footer/Footer'
import Services from './components/services/Services'
import ButtonToTop from './components/ButtonToTop'
import LoginScreen from './components/auth/LoginScreen'
import RegisterScreen from './components/auth/RegisterScreen'
import PropertyScreen from './components/property/PropertyScreen'
import ProfileScreen from './components/profile/ProfileScreen'
import InformationProfileScreen from './components/profile/InformationPersonal'
import ResetPassword from './components/profile/ResetPassword'

function App() {
  return (
    <>
    <Router>
      <Header/>
      <div id="google-signin-prompt" className="google-signin-prompt"/>
        <Routes>
          <Route exact path='/' element={<Home/>} />
          <Route exact path='/about' element={<About/>} />
          <Route exact path='/services' element={<Services/>} />
          <Route exact path='/blog' element={<Blog/>} />
          <Route exact path='/pricing' element={<Pricing/>} />
          <Route exact path='/contact' element={<Contact/>} />
          <Route path='/login' element={<LoginScreen/>} />
          <Route path='/register' element={<RegisterScreen/>} />
          <Route path='/property' element={<PropertyScreen/>} />
          <Route path='/profile' element={<ProfileScreen/>} />
          <Route path='/profile/personal-infomation' element={<InformationProfileScreen/>} />
          <Route path='profile/reset-password' element={<ResetPassword/>} />
        </Routes>
      <ButtonToTop/>
      <Footer/>
    </Router>
    </>
  )
}

export default App
