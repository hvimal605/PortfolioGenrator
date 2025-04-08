import React from 'react'
import Hero from '../components/core/HomePage/Hero'
import AnimatedButton from '../components/common/AnimatedButton'
import ShowCaseFeatures from '../components/core/HomePage/ShowCaseFeatures'
import StepsGuide from '../components/core/HomePage/StepsGuide'
import ResponsiveShowCase from '../components/core/HomePage/ResponsiveShowCase'
import FAQSection from '../components/core/HomePage/FAQSection'
import Navbar from '../components/common/Navbar'
import TemplateSwiper from '../components/core/HomePage/TemplateSwiper'

const Home = () => {
  localStorage.setItem("portfolioId", "678678cdc1a8de78ee8cc5a9"); 
  


  return (
    <div>
      
        <Hero/>
         <ShowCaseFeatures/>
        <TemplateSwiper/>
        <StepsGuide/>
        <ResponsiveShowCase/>
        <FAQSection/>
       
    </div>
  )
}

export default Home