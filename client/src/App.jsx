import React,{ useEffect } from "react";
import VantaBackground from "./components/VantaBackground";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import {Toaster} from "react-hot-toast"

// Pages
import Home from "./pages/Home.jsx";
import Layout from "./pages/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import WriteArticle from "./pages/WriteArticle.jsx";
import BlogTitles from "./pages/BlogTitles.jsx";
import GenerateImages from "./pages/GenerateImages.jsx";
import ReviewResume from "./pages/ReviewResume.jsx";
import RemoveBackground from "./pages/RemoveBackground.jsx";
import RemoveObject from "./pages/RemoveObject.jsx";
import Community from "./pages/Community.jsx";



function App() {
  const {getToken} = useAuth()
  useEffect(()=>{
    getToken().then((token)=>console.log(token))
  },[])
  return (
    <>
      <Toaster/>
      <VantaBackground className="fixed top-0 left-0 w-full h-full -z-10" />
      <div
        className="fixed top-0 left-0 w-full h-full -z-10 backdrop-blur-xs"
      />

      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="write-article" element={<WriteArticle />} />
            <Route path="blog-titles" element={<BlogTitles />} />
            <Route path="generate-images" element={<GenerateImages />} />
            <Route path="remove-background" element={<RemoveBackground />} />
            <Route path="remove-object" element={<RemoveObject />} />
            <Route path="review-resume" element={<ReviewResume />} />
            <Route path="community" element={<Community />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
