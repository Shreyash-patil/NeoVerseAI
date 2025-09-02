import React, { useState } from "react";
import { Eraser, Sparkles } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("No file chosen");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const OnSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", input);
      const token = await getToken();
      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setContent(data.content);
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

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-gray-300">
      {/* Left panel */}
      <form
        onSubmit={OnSubmitHandler}
        className="w-full max-w-lg p-4 bg-transparent backdrop-blur-2xl rounded-lg border border-gray-800"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-b from-violet-600 to-cyan-400  text-transparent flex justify-center items-center">
            <Sparkles className="w-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold ">Background remover</h1>
        </div>
        <p className="mt-6 text-sm font-semibold">Upload image</p>
        {/* File Handler  */}
        <div className="w-[60%] mt-2">
          <div className="flex items-center w-full rounded-md border border-gray-800 overflow-hidden">
            {/* Choose File Button */}
            <label
              htmlFor="file-upload"
              className="px-4 py-2 text-sm bg-[#07e8e4] text-black cursor-pointer hover:opacity-90 transition"
            >
              Choose File
            </label>

            {/* Hidden Input */}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  setFileName(e.target.files[0].name);
                  setInput(e.target.files[0]); 
                } else {
                  setFileName("No file chosen");
                  setInput(null);
                }
              }}
              className="hidden"
              required
            />

            {/* File Name */}
            <span className="px-3 py-2 text-sm text-gray-400 truncate flex-1">
              {fileName}
            </span>

            {/* Remove File Button (only if file chosen) */}
            {fileName !== "No file chosen" && (
              <button
                type="button"
                onClick={() => {
                  setFileName("No file chosen");
                  document.getElementById("file-upload").value = "";
                }}
                className="px-3 py-2 font-semibold text-gray-500 hover:text-gray-300 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <p className="text-xs  text-gray-400 font-light mt-1 mb-10">
          Supports JPG, PNG, and other image formats
        </p>

        {/* <button
          className="w-full flex justify-center items-center gap-2 relative overflow-hidden 
             rounded-full text-sm cursor-pointer px-5 py-2.5 
             border-2 border-[#07e8e4] text-white 
             transition-all duration-300 ease-in-out
             before:absolute before:inset-0 
             before:bg-gradient-to-r before:from-[#07e8e4] before:to-[#9d4edd] 
             before:translate-x-[-100%] before:transition-transform before:duration-300 before:rounded-full
             hover:before:translate-x-0 hover:before:opacity-90
             active:scale-95"
        >
          <Eraser className="w-5 relative z-10" />
          <span className="relative z-10">Remove background</span>
        </button> */}
        <button
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 relative overflow-hidden 
             rounded-full text-sm cursor-pointer px-5 py-2.5 
             border-2 border-[#07e8e4] text-white 
             transition-all duration-300 ease-in-out
             before:absolute before:inset-0 
             before:bg-gradient-to-r before:from-[#07e8e4] before:to-[#9d4edd] 
             before:translate-x-[-100%] before:transition-transform before:duration-300 before:rounded-full
             hover:before:translate-x-0 hover:before:opacity-90
             active:scale-95
                 ${
                   loading
                     ? "cursor-not-allowed border-gray-600 text-gray-400 before:hidden"
                     : "cursor-pointer border-[#07e8e4] before:bg-gradient-to-r before:from-[#07e8e4] before:to-[#9d4edd] before:translate-x-[-100%] before:transition-transform before:duration-300 hover:before:translate-x-0 hover:before:opacity-90 active:scale-95"
                 }
             `}
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Eraser className="w-5 relative z-10" />
          )}

          <span className="relative z-10">Remove background</span>
        </button>
      </form>

      {/* Right panel */}

      <div className="w-full max-w-lg p-4 bg-transparent backdrop-blur-2xl rounded-lg flex flex-col border border-gray-800 min-h-96 ">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#07e8e4]" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent">
            Background removed image
          </h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-500">
              <Eraser className="w-9 h-9 " />
              <p>
                Upload an image and click "Remove background" to get started.
              </p>
            </div>
          </div>
        ) : (
          <img src={content} alt="image" className="mt-3 w-full h-full" />
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
