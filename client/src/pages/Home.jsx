import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AiTools from "../components/AiTools";
import WavyLine from "../components/WavyLine";
import Testimonials from "../components/Testimonials";

import Plans from "../components/Plans";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
    <Navbar/>
    <Hero/>
     <WavyLine/>
    <AiTools/>
    <Testimonials/>
    <Plans/>
    <Footer/>
    </>
  );
};

export default Home;
