import React, { useState } from "react";
import Markdown from "react-markdown";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState();

  const downloadImage = (e, url, prompt) => {
    e.stopPropagation(); // 🚀 prevents expand toggle

    try {
      const downloadUrl = url.replace("/upload/", "/upload/fl_attachment/");

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${prompt?.slice(0, 20) || "creation"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast.error("Download failed");
    }
  };

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl text-sm bg-transparent backdrop-blur-2xl border border-gray-800 rounded-b-lg cursor-pointer hover:bg-gray-800/40"
    >
     <div className="flex justify-between items-center gap-4">
        {/* Left Content */}
        <div>
          <h2 className="bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent">
            {item.prompt}
          </h2>
          <p className="text-gray-400">
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="bg-[#07e8e4] border border-gray-800 text-black px-4 py-1 rounded-full">
            {item.type}
          </button>

          {item.type === "image" && (
            <Download
              onClick={(e) => downloadImage(e, item.content, item.prompt)}
              className="w-5 h-5 cursor-pointer text-white hover:text-cyan-400 transition hover:scale-110"
            />
          )}
        </div>
      </div>

      {/* Recent creation content */}
      <div>
        {expanded && (
          <div>
            {item.type === "image" ? (
              <div>
                <img
                  src={item.content}
                  alt="image"
                  className="mt-3 w-full max-w-md"
                />
              </div>
            ) : (
              <div className="mt-3 h-full overflow-y-scroll text-sm text-gray-300">
                <div className="reset-tailwind">
                  <Markdown>{item.content}</Markdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreationItem;
