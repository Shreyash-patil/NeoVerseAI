import React from "react";
import {  useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { assets } from "../assets/assets";

const Hero = () => {
  const navigate = useNavigate();
  const { openSignUp } = useClerk();
  const { user } = useUser();
  return (
    <>
      <div className="z-5 px-4 mt-50 mb-20 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center ">
        <div className="text-center mb-6 text-white ">
          <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2] text-cyan-100">
            A New universe of <br />{" "}
            <span className="bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent">
              Creation
            </span>
          </h1>
          <p className="mt-4 max-w-sm sm:max-w-lg 2xl:max-w-lg m-auto max-sm:text-xs  text-gray-300">
            Transform your content creation with our premium AI tools. Write
            article, generate images and enhance workflow.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs text-white">
          <button
            onClick={() => {
              if (user) {
                navigate("/ai");
              } else {
                openSignUp({ redirectUrl: "/ai" });
              }
            }}
            className="relative overflow-hidden rounded-full text-sm cursor-pointer px-5 py-2.5 
                   border-2 border-[#07e8e4]
                    text-white transition-all duration-500
                   before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#07e8e4] before:to-[#9d4edd] 
                   before:translate-x-[-100%] before:transition-transform before:duration-500 before:rounded-full
                   hover:before:translate-x-0 hover:bg-right hover:scale-110 active:scale-90"
          >
            <span className="relative z-10">Start creating now</span>
          </button>
          <button
            className="rounded-full text-sm cursor-pointer  text-white px-5 py-2.5 
             bg-gradient-to-l from-[#07e8e4] to-[#9d4edd] 
             bg-[length:200%_100%] bg-left transition-all duration-500
             hover:bg-right hover:scale-110 active:scale-90"
          >
            Watch demo
          </button>
        </div>

        <div className="flex items-center gap-4 mt-5 mx-auto text-gray-500">
          <img src= {assets.user_group} alt="user_group" className="h-6"/> Trusted by 10k+ users
        </div>














      </div>
    </>
  );
};

export default Hero;
