import React from "react";

interface DynamicSVGProps {
  fillColorRect?: string; // Color del rectángulo
  fillColorCircle?: string; // Color del círculo
  strokeColor?: string; // Color del borde
  size?: number; // Tamaño del SVG (ancho y alto)
}

const PCLogoSVG: React.FC<DynamicSVGProps> = ({
  fillColorRect = "#02204C",
  fillColorCircle = "#063381",
  strokeColor = "#E00613",
  size = 300,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width={`${size}px`}
      height={`${size}px`}
      viewBox="-0 -0 700 700" // Extiende el área visible para incluir sombras
    >
      {/* Definir el filtro para la sombra */}
      <defs>
        <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset result="offOut" in="SourceAlpha" dx="4" dy="4" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>
      {/* Fondo del SVG 
      <rect width="100%" height="100%" fill={"#d8c5c5"} />
*/}
      {/* Aplicar la sombra al grupo principal */}
      <g
        id="Capa_1"
        filter="url(#dropShadow)"
        transform={`translate(${-size / 5}, ${size / 1.5}) scale(1.2)`}
      >
        <g>
          <rect x="126.9" y="125.5" fill={fillColorRect} width="48.8" height="188.2" />
          <path
            fill={fillColorCircle}
            d="M248.9,244c-67.3,0-122-54.7-122-122S181.6,0,248.9,0s122,54.7,122,122S316.2,244,248.9,244z M248.9,48.8
            c-40.4,0-73.2,32.8-73.2,73.2s32.8,73.2,73.2,73.2s73.2-32.8,73.2-73.2S289.2,48.8,248.9,48.8z"
          />
          <g>
            <g>
              <g>
                <path
                  fill={strokeColor}
                  d="M383.7,74.6v0.2c9.2-10.9,21.5-19.1,35.7-23.2c3-0.9,6.1-1.5,9.3-2c0.3,0,0.6-0.1,0.9-0.1
                  c0.5-0.1,1.1-0.1,1.6-0.2c0.4,0,0.9-0.1,1.3-0.1c0.5,0,0.9-0.1,1.4-0.1c0.6,0,1.1-0.1,1.7-0.1c0.4,0,0.7,0,1.1-0.1
                  c0.9,0,1.9-0.1,2.8-0.1c36.1,0,66.2,26.3,72.1,60.7l38.6-38.6C530.8,29.1,488.5,0,439.5,0c-1.6,0-3.1,0-4.7,0.1
                  c-0.7,0-1.3,0.1-2,0.1c-0.9,0-1.7,0.1-2.6,0.2c-0.9,0.1-1.7,0.1-2.6,0.2c-0.6,0.1-1.1,0.1-1.7,0.2c-1.1,0.1-2.1,0.2-3.2,0.4
                  c-0.2,0-0.5,0.1-0.7,0.1c-21,3-40.6,11.3-57.6,24.5c-4.3,3.4-8.4,7-12.1,10.9c11.3,13.4,20,28.9,25.4,46
                  C379.5,79.8,381.5,77.1,383.7,74.6z"
                />
              </g>
              <g>
                <path
                  fill={strokeColor}
                  d="M439.5,195.2c-0.9,0-1.9,0-2.8-0.1c-0.4,0-0.7,0-1.1-0.1c-0.6,0-1.1-0.1-1.7-0.1
                  c-0.5,0-0.9-0.1-1.4-0.1c-0.4,0-0.9-0.1-1.3-0.1c-0.5-0.1-1.1-0.1-1.6-0.2c-0.3,0-0.6-0.1-0.9-0.1c-3.1-0.5-6.2-1.1-9.3-2
                  c-14.3-4.1-26.6-12.3-35.7-23.2v0.2c-2.2-2.6-4.2-5.2-6-8c-5.3,17.1-14.1,32.6-25.4,46c3.8,3.8,7.8,7.5,12.1,10.9
                  c17,13.2,36.7,21.6,57.6,24.5c0.2,0,0.4,0.1,0.7,0.1c1.1,0.1,2.1,0.3,3.2,0.4c0.6,0.1,1.1,0.1,1.7,0.2c0.9,0.1,1.7,0.2,2.6,0.2
                  c0.9,0.1,1.7,0.1,2.6,0.2c0.7,0,1.3,0.1,2,0.1c1.6,0.1,3.1,0.1,4.7,0.1c45.6,0,85.5-25.2,106.4-62.4L509,144.7
                  C499.5,174,471.9,195.2,439.5,195.2z"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default PCLogoSVG;
