import React, { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three"; // will use 0.121.1

const VantaBackground = ({ className = "" }) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE: THREE, // important: pass the same THREE instance
          // backgroundAlpha: 0.0, // transparent background
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,

          // ✨ Neon color theme
          // color: 0x00fff7, // cyan lines
          // backgroundColor: 0x0a0a0a, // dark bg
          // points: 12.0,
          // maxDistance: 22.0,
          // spacing: 18.0,

          points: 14.0,
          maxDistance: 25.0,
          spacing: 16.0,
          color: 0x07e8e4, // neon cyan
          backgroundColor: 0x0a0a0a,
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} className={className}></div>;
};

export default VantaBackground;
