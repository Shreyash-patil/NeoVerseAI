import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const { openSignUp } = useClerk();
  return (
    <div className="fixed top-0 left-0 z-10 w-full">
      <div
        className="relative  backdrop-blur-lg rounded-lg flex justify-between items-center py-3 px-4 sm:px-20 xl:px-10 border border-b-gray-800"

        /* before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-[px]
        before:bg-gradient-to-r before:from-[#07e8e4] before:to-[#9d4edd]
        */
      >
        <div>
          <img
            src={assets.logo}
            alt="logo"
            className="w-32 sm:w-44 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>

        <div>
          {user ? (
            <div className="p-[2px] rounded-full bg-gradient-to-r from-[#07e8e4] to-[#9d4edd]">
              <div className="rounded-full h-10 w-10 bg-black flex items-center justify-center">
                <UserButton
                  appearance={{
                    elements: {
                      rootBox: {
                        width: "100%",
                        height: "100%",
                      },
                      avatarBox: {
                        width: "100%",
                        height: "100%",
                      },
                    },
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex ">
              <button
                className="text-white px-5 cursor-pointer"
                onClick={openSignIn}
              >
                Sign in
              </button>
              <button
                onClick={openSignUp}
                className="flex items-center gap-2 rounded-full text-sm cursor-pointer border-2 border-cyan-300 text-white  px-5 py-2.5"
              >
                Get started <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
