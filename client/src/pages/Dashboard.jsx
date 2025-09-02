import React, { useEffect, useState } from "react";
import { dummyCreationData } from "../assets/assets";
import { Crown, Gem, Sparkles } from "lucide-react";
import { Protect, useAuth ,useUser} from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <p className="text-gray-400">Loading...</p>;
  }
  // read plan from Clerk privateMetadata
  const plan = (user?.publicMetadata?.plan || "free").toLowerCase();

  console.log("User metadata:", user.publicMetadata);

  

  const getDashBoardData = async () => {
    // setCreations(dummyCreationData);
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-user-creations", {
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

  useEffect(() => {
    getDashBoardData();
  }, []);
  return (
    <>
      <div className="h-full overflow-y-scroll p-6 ">
        <div className="flex justify-start gap-4 flex-wrap ">
          {/* Total creation card */}
          <div className="flex justify-between items-center w-72 p-4 px-6 bg-transparent backdrop-blur-2xl rounded-xl border border-gray-800">
            <div>
              <p className="bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent text-lg">
                Total Creations
              </p>
              <h2 className="text-gray-300 text-2xl font-semibold">
                {creations.length}
              </h2>
            </div>

            <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-violet-600 to-cyan-400  text-transparent flex justify-center items-center">
              <Sparkles className="w-5 text-white" />
            </div>
          </div>

          {/* Active Plan Card */}
          <div className="flex justify-between items-center w-72 p-4 px-6 bg-transparent backdrop-blur-2xl rounded-xl border border-gray-800">
            <div>
              <p className="text-gray-500 text-lg">Active Plan</p>
              <h2 className="text-gray-300 text-2xl font-semibold">
                {/* <Protect plan="Premium" fallback="Free">
                  Premium
                </Protect> */}
              {plan === "premium" ? "Premium" : "Free"}
              </h2>
            </div>

            <div className=" rounded-lg  flex justify-center items-center">
              <Gem size={30} className="w-10 text-amber-300 " />
            </div>
          </div>
        </div>

        {/* Recent Creations */}
        {loading ? (
          <div className="flex justify-center items-center h-3/4">
            <div className="animate-spin rounded-full h-11 w-11 border-3 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-3 ">
            <p className="mt-6 mb-4 text-gray-300 ">Recent Creations</p>
            {creations.map((item) => (
              <CreationItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
