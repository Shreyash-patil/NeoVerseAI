import React from 'react'

const WavyLine = () => {
  return (
<div className="my-8">
        <svg
          viewBox="0 0 1200 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-16"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="multiWaveGradientAnimated"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#07e8e4">
                <animate
                  attributeName="offset"
                  values="0;1;0"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#9d4edd">
                <animate
                  attributeName="offset"
                  values="1;0;1"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>

          <path
            d="M0,50 
               C150,0 300,100 450,50 
               C600,0 750,100 900,50 
               C1050,0 1200,100 1350,50"
            stroke="url(#multiWaveGradientAnimated)"
            strokeWidth="4"
            fill="none" // 🔥 ensures no fill, only stroke is visible
          />
        </svg>
      </div>
  )
}

export default WavyLine