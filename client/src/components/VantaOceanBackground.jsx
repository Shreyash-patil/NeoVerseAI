// src/components/VantaBackground.jsx
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import WAVES from "vanta/dist/vanta.waves.min";

const VantaOceanBackground = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        WAVES({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x1a1a1a,      // Wave color
          shininess: 150.0,
          waveHeight: 27.5,
          waveSpeed: 1.85,
          zoom: 1.0,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} className="w-full h-screen relative">
      {/* Content goes above waves */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default VantaOceanBackground;
