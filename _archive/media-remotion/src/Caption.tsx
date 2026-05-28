import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const LINES = ["AI 도구를 활용해", "쇼츠 한 편을", "코드로 만든다"];

export const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 배경 그라데이션이 천천히 흐르는 효과
  const hue = interpolate(frame, [0, 150], [256, 280]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, hsl(${hue},80%,18%), hsl(${hue + 20},70%,8%))`,
        fontFamily: "Paperlogy, sans-serif",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 조회수 카운터 — 데이터가 코드로 반영되는 예시 */}
      <CountUp frame={frame} fps={fps} />

      <div style={{ marginTop: 80 }}>
        {LINES.map((line, i) => {
          const start = 20 + i * 18;
          const s = spring({ frame: frame - start, fps, config: { damping: 14 } });
          const y = interpolate(s, [0, 1], [60, 0]);
          return (
            <div
              key={i}
              style={{
                opacity: s,
                transform: `translateY(${y}px)`,
                fontSize: 84,
                fontWeight: 800,
                color: "#fff",
                textAlign: "center",
                lineHeight: 1.3,
                textShadow: "0 4px 24px rgba(0,0,0,0.4)",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CountUp: React.FC<{ frame: number; fps: number }> = ({ frame }) => {
  const value = Math.round(interpolate(frame, [0, 90], [0, 128400], { extrapolateRight: "clamp" }));
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 40, color: "#bba4ff", fontWeight: 700 }}>조회수</div>
      <div style={{ fontSize: 140, color: "#ffe600", fontWeight: 800, letterSpacing: -2 }}>
        {value.toLocaleString()}
      </div>
    </div>
  );
};
