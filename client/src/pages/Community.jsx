import React, { useEffect, useState } from "react";
import { useUser, SignIn, useAuth } from "@clerk/clerk-react";
import { dummyPublishedCreationData } from "../assets/assets";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();

  const fetchCreations = async () => {
    // setCreations(dummyPublishedCreationData);
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Unexpected error"
      );
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/user/toggle-like-creations",
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCreations();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Unexpected error"
      );
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return !loading?(
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <div className="flex justify-between items-center w-33 px-3 py-3  bg-transparent backdrop-blur-2xl border border-gray-800 rounded-2xl">
        <h1 className="bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent text-2xl">
          Creations
        </h1>
      </div>

      <div className="bg-transparent backdrop-blur-2xl px-1 py-1 w-full rounded-xl overflow-y-scroll">
        {creations.map((creation, index) => (
          <div
            key={index}
            className="relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3"
          >
            <img
              src={creation.content}
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-baseline p-3 group-hover:bg-gradient-to-b from-transparent to black/80 text-white rounded-lg">
              <p className="text-sm hidden group-hover:block">
                {creation.prompt}
              </p>
              <div className="flex gap-1 items-center">
                <p>{creation.likes.length}</p>
                {/* <Heart
                  onClick={()=>imageLikeToggle(creation.id)}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                    creation.likes.includes(user.id)
                      ? "fill-red-500 text-red-600"
                      : "text-white"
                  }`}
                /> */}
                <Heart
                  onClick={() => imageLikeToggle(creation.id)}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                    (creation.likes || []).includes(user.id) // ✅ safe check
                      ? "fill-red-500 text-red-600"
                      : "text-white"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) :(
    <div className="flex justify-center items-center h-full">
      <span className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></span>
    </div>
  );
};

export default Community;
