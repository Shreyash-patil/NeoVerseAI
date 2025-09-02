import React, { useState } from "react";
import Markdown from "react-markdown";

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState();

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl text-sm bg-transparent backdrop-blur-2xl border border-gray-800 rounded-b-lg cursor-pointer hover:bg-gray-800/40"
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent">
            {item.prompt}
          </h2>
          <p className="text-gray-400">
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        <button className="bg-[#07e8e4] border border-gray-800 text-black px-4 py-1 rounded-full">
          {item.type}
        </button>
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
