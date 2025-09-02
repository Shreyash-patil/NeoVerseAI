import React, { useState } from "react";
import { Image, Sparkles } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyles = [
    "Realistic",
    "Ghibli",
    "Anime",
    "Cartoon",
    "Fantasy",
    "3D",
    "Portrait",
  ];

  const [selectedImageStyles, setSelectedImageStyles] = useState(
    imageStyles[0]
  );
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const OnSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const prompt = `Generate an image of ${input} in the style ${selectedImageStyles}`;
      const token = await getToken();
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt,publish },
        {
          headers: { Authorization: `Bearer ${token}` },
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

    setLoading(false)
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
          <h1 className="text-xl font-semibold ">AI image Generator</h1>
        </div>
        <p className="mt-6 text-sm font-semibold">Describe your image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-800 text-[#07e8e4] placeholder-gray-500"
          placeholder="eg. A sci-fi robot exploring Mars."
          required
        />

        <p className="mt-4 text-sm font-medium">Styles</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {imageStyles.map((item) => (
            <span
              onClick={() => setSelectedImageStyles(item)}
              key={item}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedImageStyles === item
                  ? "bg-[#07e8e4] text-black"
                  : "text-gray-300 border-gray-800"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => {
                setPublish(e.target.checked);
              }}
              checked={publish}
              className="sr-only peer "
            />

            <div className="w-9 h-5 bg-transparent rounded-full peer-checked:bg-[#07e8e4] transition border border-gray-800 "></div>

            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm">Make this image public</p>
        </div>

        {/* <br /> */}

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
          <Image className="w-5 relative z-10" />
          <span className="relative z-10">Generate image</span>
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
            <Image className="w-5 relative z-10" />
          )}

          <span className="relative z-10">Generate image</span>
        </button>
      </form>

      {/* Right panel */}

      <div className="w-full max-w-lg p-4 bg-transparent backdrop-blur-2xl rounded-lg flex flex-col border border-gray-800 min-h-96 ">
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#07e8e4]" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent">
            Generated images
          </h1>
        </div>

          {!content ?(<div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-500">
            <Image className="w-9 h-9 " />
            <p>
              Describe your image and click "Generate image" to get started.
            </p>
          </div>
        </div>):(
          <div className="h-full mt-3">
            <img src={content} alt="image" className="w-full h-full"/>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default GenerateImages;
