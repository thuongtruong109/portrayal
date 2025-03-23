import { useEffect, useRef, useState } from "react";

export default function Stone({ imageUrl }: { imageUrl: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [vector, setVector] = useState([0, 0]);
  const [useBackground, setUseBackground] = useState(true);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const element = svgRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      setVector([event.x - rect.left, event.y - rect.top]);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <svg
      ref={svgRef}
      width="1000"
      height="1000"
      className="max-w-screen"
      onClick={() => {
        setUseBackground((prev) => !prev);
      }}
    >
      <defs>
        <filter id="spotlight">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.1"
            numOctaves="4"
            result="noise"
          />
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              1 1 1 0.2 0"
            result="alpha_map"
          />

          <feComposite
            in="alpha_map"
            in2="noise"
            operator="arithmetic"
            result="alpha_map_with_noise"
            k2="1"
            k3="-0.2"
          />
          <feDiffuseLighting
            in="alpha_map_with_noise"
            result="light"
            lightingColor="rgba(250,250,250,1)"
            diffuseConstant={1}
          >
            <fePointLight x={vector[0]} y={vector[1]} z="30" />
          </feDiffuseLighting>

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.1"
            numOctaves="4"
            result="turbulence"
          />
          <feDisplacementMap
            in2="turbulence"
            in="SourceGraphic"
            result="source_with_displacement"
            scale="50"
            xChannelSelector="R"
            yChannelSelector="G"
          />

          <feComposite
            in="SourceGraphic"
            in2="light"
            operator="arithmetic"
            result="out1"
            k1="1"
          />

          <feDropShadow
            dx={(-vector[0] * 12) / 1000}
            dy={(-vector[1] * 12) / 1000}
            stdDeviation="15"
            floodColor="black"
            floodOpacity="1"
          />
        </filter>
      </defs>

      <g filter="url(#spotlight)">
        {useBackground && (
          <rect
            x="10%"
            y="10%"
            width="80%"
            height="80%"
            rx="20"
            stroke="0"
            style={{
              fill: "gray",
            }}
          />
        )}
        <image
          href={imageUrl}
          x="10%"
          y="10%"
          width="80%"
          height="80%"
          className="object-cover"
        />
      </g>
    </svg>
  );
}
