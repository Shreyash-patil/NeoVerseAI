import React, { useState } from "react";
import { Hash, Sparkles } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const OnSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory} `;
      const token = await getToken();
      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
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
          <h1 className="text-xl font-semibold ">AI title Generator</h1>
        </div>
        <p className="mt-6 text-sm font-semibold">Keyword</p>
        {/* <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-800 text-[#07e8e4] placeholder-gray-500"
          placeholder="eg. The Rise of AI in Everyday Life."
          required
        /> */}
        <div className="relative w-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            className="w-full p-2 pr-10 px-3 mt-2 outline-none text-sm rounded-md border border-gray-800 text-[#07e8e4] placeholder-gray-500"
            placeholder="eg. The Rise of AI in Everyday Life."
            required
          />

          {input && (
            <button
              type="button"
              onClick={() => setInput("")}
              className="absolute right-3 top-7 -translate-y-1/2 flex items-center justify-center text-gray-500 hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>

        <p className="mt-4 text-sm font-medium">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {blogCategories.map((item) => (
            <span
              onClick={() => setSelectedCategory(item)}
              key={item}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategory === item
                  ? "bg-[#07e8e4] text-black"
                  : "text-gray-300 border-gray-800"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <br />

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
          <Hash className="w-5 relative z-10" />
          <span className="relative z-10">Generate title</span>
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
            <Hash className="w-5 relative z-10" />
          )}

          <span className="relative z-10">Generate title</span>
        </button>
      </form>

      {/* Right panel */}

      <div className="w-full max-w-lg p-4 bg-transparent backdrop-blur-2xl rounded-lg flex flex-col border border-gray-800 min-h-96 ">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#07e8e4]" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent">
            Generated titles
          </h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-500">
              <Hash className="w-9 h-9 " />
              <p>Enter a topic and click "Generate title" to get started.</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-gray-300">
            <div className="reset-tailwind">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
