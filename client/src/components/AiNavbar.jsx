import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const AiNavbar = () => {
  const navigate = useNavigate;
  const [sidebar, setSidebar] = useState(false);
  return (
    <div className="flex flex-col items-start justify-start h-screen">
      <nav className="relative  backdrop-blur-lg rounded-lg flex justify-between items-center py-3 px-4 sm:px-20 xl:px-10">
        <img
          src={assets.logo}
          alt="logo"
          onClick={() => {
            navigate("/");
          }}
        />
        {sidebar ? (
          <X className="w-6 h-6 text-gray-600 sm:hidden" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600 sm:hidden  " />
        )}
      </nav>
    </div>
  );
};

export default AiNavbar;
