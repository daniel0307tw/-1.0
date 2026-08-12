import React from 'react';
import { motion } from 'motion/react';

interface LineArtBearProps {
  isWorking: boolean;
  isPaused: boolean;
}

export const LineArtBear: React.FC<LineArtBearProps> = ({ isWorking, isPaused }) => {
  return (
    <div className="relative w-40 h-40 mx-auto flex items-center justify-center -mt-3 mb-1">
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full overflow-visible"
        style={{ strokeLinejoin: 'round', strokeLinecap: 'round' }}
      >
        <defs>
          {/* Crayon / Rough Hand-Drawn Wobbly Stroke Filter */}
          <filter id="handDrawnFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Floating Colorful Musical Notes & Doodles (Style matching the image) */}
        {!isWorking && (
          <g filter="url(#handDrawnFilter)">
            {/* Pink Note (Left) */}
            <motion.g
              animate={{ y: [0, -6, 0], rotate: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <path
                d="M 22 38 L 38 28 L 38 42 A 5 5 0 1 1 32 46 L 32 35 L 22 41 L 22 52 A 5 5 0 1 1 16 56 L 16 38 Z"
                fill="#FF9AA2"
              />
            </motion.g>

            {/* Cyan Note (Top Right) */}
            <motion.g
              animate={{ y: [0, -8, 0], rotate: [5, -10, 5] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut", delay: 0.3 }}
            >
              <path
                d="M 78 22 L 92 16 L 92 28 A 5 5 0 1 1 86 32 L 86 22 Z"
                fill="#68D8D6"
              />
            </motion.g>

            {/* Yellow Note (Right Bottom) */}
            <motion.g
              animate={{ y: [0, -5, 0], scale: [0.95, 1.1, 0.95] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 0.6 }}
            >
              <path
                d="M 102 62 A 5 5 0 1 1 96 66 L 96 52 L 102 52 Z"
                fill="#FFD166"
              />
            </motion.g>
          </g>
        )}

        {/* Working Busy Floating Notes / Sweats */}
        {isWorking && !isPaused && (
          <g filter="url(#handDrawnFilter)">
            {/* Cyan Coffee Steam Note */}
            <motion.path
              d="M 20 30 L 28 25 L 28 36 A 4 4 0 1 1 24 39 L 24 28 Z"
              fill="#68D8D6"
              animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
            {/* Pink Note */}
            <motion.path
              d="M 92 32 A 4 4 0 1 1 88 36 L 88 24 L 95 24 Z"
              fill="#FF9AA2"
              animate={{ y: [0, -6, 0], scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            />
            {/* Running Speed Lines */}
            <motion.g stroke="#1A1A1A" strokeWidth="2.5" strokeDasharray="4 6" opacity={0.6}>
              <motion.line x1="110" y1="92" x2="5" y2="92" animate={{ x: [-30, 0] }} transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }} />
              <motion.line x1="110" y1="82" x2="15" y2="82" animate={{ x: [-20, 0] }} transition={{ repeat: Infinity, duration: 0.25, ease: "linear" }} />
            </motion.g>
          </g>
        )}

        {/* Paused Sleeping Doodles */}
        {isWorking && isPaused && (
          <g filter="url(#handDrawnFilter)">
            <motion.text
              x="85"
              y="32"
              fontSize="16"
              fill="#FF9AA2"
              fontWeight="900"
              animate={{ opacity: [0, 1, 0], y: [0, -10, -20] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
            >
              Z
            </motion.text>
            <motion.text
              x="98"
              y="20"
              fontSize="12"
              fill="#68D8D6"
              fontWeight="900"
              animate={{ opacity: [0, 1, 0], y: [0, -10, -20] }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0.6 }}
            >
              z
            </motion.text>
          </g>
        )}

        {/* Main Bear Character with Wobbly Hand-Drawn Filter */}
        <motion.g
          filter="url(#handDrawnFilter)"
          animate={
            isWorking && !isPaused
              ? { y: [0, -5, 0], rotate: [-2, 2, -2] }
              : isWorking && isPaused
              ? { scaleY: [1, 0.97, 1], originY: "90px" }
              : { y: [0, -6, 0], rotate: [-3, 3, -3] }
          }
          transition={{
            repeat: Infinity,
            duration: isWorking && !isPaused ? 0.2 : isWorking && isPaused ? 2.5 : 1.8,
            ease: "easeInOut",
          }}
        >
          {/* Bear Body Outline & Fill (Hand drawn Crayon Style) */}
          <path
            d="M 42 36
               C 34 33, 28 35, 27 44
               C 26 50, 32 54, 33 58
               C 27 62, 20 68, 25 78
               C 29 86, 42 92, 58 92
               C 72 92, 85 84, 82 72
               C 79 60, 72 58, 73 52
               C 75 42, 84 37, 78 30
               C 72 24, 62 30, 58 32
               C 52 30, 48 30, 42 36 Z"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="3.8"
          />

          {/* Left Ear */}
          <path
            d="M 33 38 C 24 30, 35 22, 42 32"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="3.8"
          />

          {/* Right Ear */}
          <path
            d="M 66 32 C 75 22, 84 30, 75 38"
            fill="#FFFFFF"
            stroke="#1A1A1A"
            strokeWidth="3.8"
          />

          {/* Belly Arch Line (Distinctive in the reference picture!) */}
          <path
            d="M 44 65 C 48 70, 58 70, 62 65"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="3"
          />

          {/* Face Details */}
          {/* Eyes */}
          {isWorking && !isPaused ? (
            /* Happy Busy Eyes (^^) */
            <>
              <path d="M 43 45 Q 47 41 51 45" fill="none" stroke="#1A1A1A" strokeWidth="3" />
              <path d="M 59 45 Q 63 41 67 45" fill="none" stroke="#1A1A1A" strokeWidth="3" />
            </>
          ) : isWorking && isPaused ? (
            /* Sleeping Eyes (u u) */
            <>
              <path d="M 43 45 Q 47 48 51 45" fill="none" stroke="#1A1A1A" strokeWidth="3" />
              <path d="M 59 45 Q 63 48 67 45" fill="none" stroke="#1A1A1A" strokeWidth="3" />
            </>
          ) : (
            /* Dot Eyes like the image */
            <>
              <circle cx="47" cy="44" r="2.2" fill="#1A1A1A" />
              <circle cx="63" cy="44" r="2.2" fill="#1A1A1A" />
            </>
          )}

          {/* Nose */}
          <path
            d="M 53 47 C 53 46, 57 46, 57 47 C 57 49, 53 49, 53 47 Z"
            fill="#1A1A1A"
            stroke="#1A1A1A"
            strokeWidth="1"
          />

          {/* Mouth */}
          <g>
            {/* Open Happy Mouth with Red Tongue (Exactly like reference) */}
            <path
              d="M 48 49 C 48 56, 62 56, 62 49 Z"
              fill="#B8323D"
              stroke="#1A1A1A"
              strokeWidth="2.8"
            />
            {/* Tongue line inside */}
            <path
              d="M 51 52 C 53 54, 57 54, 59 52"
              fill="none"
              stroke="#FF8DA1"
              strokeWidth="2"
            />
          </g>

          {/* Arms / Props depending on mode */}
          {isWorking && !isPaused && (
            <g>
              {/* Apron / Work Outfit Line */}
              <path d="M 38 60 L 68 60 L 64 82 L 40 82 Z" fill="#FFFBF2" stroke="#1A1A1A" strokeWidth="2.5" />
              <path d="M 48 68 L 58 68 L 56 76 L 50 76 Z" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />

              {/* Paws carrying coffee tray */}
              <path d="M 30 58 L 42 66" stroke="#1A1A1A" strokeWidth="3.5" fill="none" />
              <path d="M 74 58 L 62 66" stroke="#1A1A1A" strokeWidth="3.5" fill="none" />
              <line x1="25" y1="66" x2="79" y2="66" stroke="#1A1A1A" strokeWidth="3.5" />

              {/* Coffee Cup */}
              <path d="M 46 65 L 44 51 L 60 51 L 58 65 Z" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2.5" />
              <path d="M 60 55 C 65 55, 65 61, 58 61" fill="none" stroke="#1A1A1A" strokeWidth="2.5" />
            </g>
          )}

          {isWorking && isPaused && (
            <g>
              {/* Paw resting on cheek */}
              <path d="M 32 58 C 36 62, 42 55, 44 52" stroke="#1A1A1A" strokeWidth="3.5" fill="none" />
              {/* Cozy Coffee Cup beside */}
              <path d="M 72 75 L 70 65 L 82 65 L 80 75 Z" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2.5" />
            </g>
          )}

          {!isWorking && (
            <g>
              {/* Dancing Paws in the Air (Exactly like reference!) */}
              <path
                d="M 31 54 C 22 48, 20 38, 28 42"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="3.8"
              />
              <path
                d="M 72 52 C 82 46, 85 38, 78 44"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="3.8"
              />
            </g>
          )}

          {/* Little Feet */}
          <path d="M 40 91 C 38 96, 46 97, 48 91" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3" />
          <path d="M 60 91 C 58 97, 66 96, 64 91" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="3" />
        </motion.g>
      </svg>
    </div>
  );
};
