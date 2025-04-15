import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Signup from './Pages/Signup'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'; 
import StrongPassword from './Pages/Try';
import Login from './Pages/Login';
import TemplatesPage from './Pages/TemplatesPage';
import DeveloperUpload from './Pages/DevloperUpload';
import './App.css'
import DeveloperDashboard from './Pages/DeveloperDashboard';
import PortfolioCreatePage from './Pages/PortfolioCreatePage';
import UploadDetailsPage from './Pages/UploadDetailsPage';
import DeployPage from './Pages/DeployPage';
import CustomizeTemplate from './Pages/CustomizeTemplate';
import PortfolioDashboardData from './components/core/PorfolioCreation/PorttfolioDashboardData/PortfolioDashboardData';
import MessagingInsights from './components/core/UserDashboard/MessagingInsights.jsx';
import PageViewCounter from './Pages/PageViews.jsx';
import MyPortfolios from './components/core/UserDashboard/MyPortfolios.jsx';
import UserDashboard from './Pages/UserDashboard.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import VerifyEmail from './Pages/VerifyEmail.jsx';
// import GoogleLoginComponent from './Pages/GoogleLogin';


const App = () => {

  return (
    <div className=''>

        <Routes>
       <Route path='/' element={<Home/>}/>
       <Route path='/signup' element={<Signup/>}/>
       <Route path='/login' element={<Login/>}/>
       <Route path='/VerifyEmail' element={<VerifyEmail/>}/>
       <Route path='/templates' element={<TemplatesPage/>}/>
       <Route path='/developer' element={<DeveloperUpload/>}/>
       <Route path='/developerDas' element={<DeveloperDashboard/>}/>
       <Route path='/UserDas' element={<UserDashboard/>}/>
       <Route path='/AdminDas' element={<AdminDashboard/>}/>
       <Route path='/portfolioCreate' element={<PortfolioCreatePage/>}/>
       <Route path='/PortfolioCreate/UploadDetails' element={<UploadDetailsPage/>}/>
       <Route path='/portfolio/deploy' element={<DeployPage/>}/>
       <Route path='/portfolio/customize' element={<CustomizeTemplate/>}/>
       <Route path='/portfolio/DashboardData' element={<PortfolioDashboardData/>}/>
       
       <Route path='/user/das/Message' element={<MessagingInsights/>}/>
       
       <Route path='/user/das/Portfolios' element={<MyPortfolios/>}/>
       
       <Route path='/try' element={<StrongPassword/>}/>
       
       <Route path='/try1' element={<PageViewCounter/>}/>
       
        </Routes>
      
    </div>
  )
}

export default App