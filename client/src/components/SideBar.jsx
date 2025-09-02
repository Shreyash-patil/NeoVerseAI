// import { useClerk, useUser } from "@clerk/clerk-react";
// import { Eraser, FileText, Hash, Home, Scissors, SquarePen, Users } from "lucide-react";
// import React from "react";
// import { NavLink } from "react-router-dom";

// const navItems = [
//   {
//     to: "/ai",
//     label: "Dashboard",
//     Icon: Home,
//   },
//   {
//     to: "/ai/write-article",
//     label: "Write Article",
//     Icon: SquarePen,
//   },
//   {
//     to: "/ai/blog-titles",
//     label: "Blog Titles",
//     Icon: Hash,
//   },
//   {
//     to: "/ai/generate-images",
//     label: "Generate Images",
//     Icon: Image,
//   },
//   {
//     to: "/ai/remove-background",
//     label: "Remove Background",
//     Icon: Eraser,
//   },
//   {
//     to: "/ai/remove-object",
//     label: "Remove Object",
//     Icon: Scissors,
//   },
//   {
//     to: "/ai/review-resume",
//     label: "Review Resume",
//     Icon: FileText,
//   },
//   {
//     to: "/ai/community",
//     label: "Community",
//     Icon: Users,
//   },
// ];

// const SideBar = ({ sidebarProp, setSidebarProp }) => {
//   const { isSignedIn, user } = useUser();
//   const { signOut, openUserProfile } = useClerk();
//   return (
//     <>
//       <div
//         className={`w-60 bg-transparent backdrop-blur-lg border-r border-gray-800  flex flex-col justify-between items-center max-sm:absolute top-15 bottom-0 ${
//           sidebarProp ? "translate-x-0" : "max-sm:-translate-x-full"
//         } transition-all duration-300 ease-in-out`}
//       >
//         <div className="my-7 w-full ">
//           {isSignedIn && user ? (
//             <>
//               <img
//                 src={user.imageUrl}
//                 alt="user avatar"
//                 className="w-13 rounded-full mx-auto"
//               />
//               <h1 className="mt-1 text-center text-gray-300">
//                 {user.fullName}
//               </h1>

//               <div>
//                 {navItems.map(({to, label,Icon})=>(
//                     <NavLink key={to} to={to} end={to=='/ai'} onClick={()=>setSidebarProp(false)} className={({isActive})=>`px-3.5 py-2.5 flex items-center gap-3 rounded ${isActive ? 'bg-gradient-to-r from-[#07e8e4] to-[#9d4edd] text-white':'bg-transparent text-gray-300'}`}>

//                         {({isActive})=>{
//                             <>
//                             <Icon className={`w-4 h-4 ${isActive? 'text-white': ''}`} />
//                             {label}
//                             </>
//                         }}

//                 </NavLink>
//                 ))}

//               </div>
//             </>
//           ) : (
//             <p className="text-center text-gray-500">Loading...</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SideBar;

import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  Home,
  Scissors,
  SquarePen,
  Users,
  Image,
  LogOut,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: Home },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const SideBar = ({ sidebarProp, setSidebarProp }) => {
  const { isSignedIn, user,isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();
  
  
    if (!isLoaded) {
      return <p className="text-gray-400">Loading...</p>;
    }
    // read plan from Clerk privateMetadata
    const plan = (user?.publicMetadata?.plan || "free").toLowerCase();
  
    

  return (
    <div
      className={`w-60 bg-transparent backdrop-blur-lg border-r border-gray-800 flex flex-col justify-between items-center max-sm:absolute top-15 bottom-0 ${
        sidebarProp ? "translate-x-0" : "max-sm:-translate-x-full"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="my-7 w-full">
        {isSignedIn && user ? (
          <>
            {/* User Info */}
            <img
              src={user.imageUrl}
              alt="user avatar"
              className="w-14 h-14 rounded-full mx-auto"
            />
            <h1 className="mt-2 text-center text-gray-300 font-medium">
              {user.fullName}
            </h1>

            {/* Nav Items */}
            <div className="mt-6 flex flex-col gap-2">
              {navItems.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/ai"}
                  onClick={() => setSidebarProp(false)}
                  className={({ isActive }) =>
                    `px-4 py-2.5 flex items-center gap-3 rounded-md transition ${
                      isActive
                        ? "bg-gradient-to-r from-[#07e8e4] to-[#9d4edd] text-white"
                        : "bg-transparent text-gray-300 hover:text-white hover:bg-gray-800/40"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Loading...</p>
        )}
      </div>

      {/* SiderBar Bottom */}
      <div className="w-full border-t-gray-800 p-4 flex items-center justify-between hover:text-white hover:bg-gray-800/40">
        {/* Profile name and plan details */}
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={openUserProfile}
        >
          <img
            src={user.imageUrl}
            className="w-8 rounded-full "
            alt="user avatar"
          />
          <div className="">
            <h1 className="text-sm font-semibold text-gray-300 ">{user.fullName}</h1>
            <p className="text-xs text-gray-400">
              {/* <Protect plan="Premium" fallback="Free">Plan</Protect> */}
              {plan === "premium" ? "Premium" : "Free"}
            </p>
          </div>
        </div>

        <LogOut
          onClick={signOut}
          className="w-4.5 text-gray-400 hover:text-gray-300 transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SideBar;
