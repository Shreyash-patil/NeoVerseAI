import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";
import SideBar from "../components/SideBar";
import { useUser, SignIn } from "@clerk/clerk-react";

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();
  return user ? (
    <>
      <div className="flex flex-col items-start justify-start w-full h-screen">
        <nav className="w-full  min-h-14 flex items-center justify-between  backdrop-blur-lg py-3 px-4 sm:px-20 xl:px-10 border border-b-gray-800">
          <img
            src={assets.logo}
            alt="logo"
            className="w-32 sm:w-44 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          />
          {sidebar ? (
            <X
              onClick={() => setSidebar(false)}
              className="w-6 h-6 text-gray-100 sm:hidden"
            />
          ) : (
            <Menu
              onClick={() => setSidebar(true)}
              className="w-6 h-6 text-gray-100 sm:hidden  "
            />
          )}
        </nav>

        <div className="flex flex-1 w-full h-[calc(100vh-64px)]">
          <SideBar sidebarProp={sidebar} setSidebarProp={setSidebar} />

          <div className="flex-1 bg-transparent">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="flex items-center justify-center h-screen">
      
      <SignIn fallbackRedirectUrl={"/ai"} />
    </div>
  );
};

export default Layout;
