import React from 'react';

const HomiesLoader: React.FC = () => {
  return (
    <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
      {/* Background Layer */}
      <rect width="100%" height="100%" fill="none" />

      {/* Icon Layer */}
      <g id="icon" transform="translate(40, 40)">
        {/* Shadow */}
        <circle cx="0" cy="0" r="21" fill="rgba(0, 0, 0, 0.3)" />

        {/* Circle representing the community */}
        <circle cx="0" cy="0" r="20" fill="none" stroke="white" strokeWidth="4" />

        {/* Abstract human figures */}
        <g id="figures">
          <g id="figure1" transform="rotate(0)">
            <circle cx="-10" cy="-15" r="5" fill="white" />
            <rect x="-11.5" y="-10" width="3" height="10" fill="white" />
          </g>
          <g id="figure2" transform="rotate(120)">
            <circle cx="-10" cy="-15" r="5" fill="white" />
            <rect x="-11.5" y="-10" width="3" height="10" fill="white" />
          </g>
          <g id="figure3" transform="rotate(-120)">
            <circle cx="-10" cy="-15" r="5" fill="white" />
            <rect x="-11.5" y="-10" width="3" height="10" fill="white" />
          </g>
        </g>
      </g>

      <style>
        {`
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          #figures {
            animation: rotate 2s linear infinite;
            transform-origin: center;
          }

          #figure1, #figure2, #figure3 {
            animation: bounce 1s ease-in-out infinite;
          }

          #figure1 {
            animation-delay: 0s;
          }

          #figure2 {
            animation-delay: 0.33s;
          }

          #figure3 {
            animation-delay: 0.66s;
          }
        `}
      </style>
    </svg>
  );
};

export default HomiesLoader;
