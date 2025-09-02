import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser,useClerk } from "@clerk/clerk-react";

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignUp } = useClerk();
  return (
    <>
      <div className="px-4 sm:px-20 xl:px-32 my-20 text-gray-300">
        <div className="text-center">
          <h2 className=" text-[42px] font-semibold">Powerfull AI tools</h2>
          <p className="text-gray-300 max-w-lg mx-auto">
            Everything you need to create, enhance, and optimize your content
            with cutting-edge AI technology{" "}
          </p>
        </div>

        <div className="flex flex-wrap mt-10 justify-center">
          {AiToolsData.map((tool, index) => (
            <div
              key={index}
              className="p-8 m-4 max-w-xs  rounded-lg bg-transparent shadow-lg border border-gray-800 hover:translate-y-1 transition-all duration-300 cursor-pointer backdrop-blur-lg"
              onClick={() => {user ? navigate(tool.path): openSignUp({ redirectUrl:tool.path });}}>
              
              <tool.Icon className="w-12 h-12 p-3 text-white rounded-xl " style={{background:`linear-gradient(to bottom, ${tool.bg.from},${tool.bg.to})`}}/>
            <h3 className="mt-6 mb-3 text-lg font-semibold">
              {tool.title}
            </h3>
            <p className="text-gray-400 text-sm max-w-[95%]">
              {tool.description}
            </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AiTools;
