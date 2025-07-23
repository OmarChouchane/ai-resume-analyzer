import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
  const [pathLength, setPathLength] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  const percentage = score / 100;

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  useEffect(() => {
    let start: number | null = null;
    const duration = 2200; // ms
    // Ease-out cubic: f(t) = 1 - (1 - t)^3
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const rawProgress = Math.min((timestamp - start) / duration, 1);
      const easedProgress = easeOutCubic(rawProgress);
      setAnimatedPercent(easedProgress * percentage);
      setAnimatedScore(Math.round(easedProgress * score));
      if (rawProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedPercent(percentage);
        setAnimatedScore(score);
      }
    };
    requestAnimationFrame(animate);
    // Reset on score change
    return () => {
      setAnimatedPercent(0);
      setAnimatedScore(0);
    };
  }, [score, percentage]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <defs>
            <linearGradient
              id="gaugeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#fca5a5" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Foreground arc with rounded ends */}
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - animatedPercent)}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="text-xl font-semibold pt-4">{animatedScore}/100</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
