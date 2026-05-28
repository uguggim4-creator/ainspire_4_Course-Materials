// Whisper 결과물(.srt 자막 파일)을 "에디터에 열린 자막 파일" 느낌의 영상으로.
// 실제 narration.srt 내용을 그대로 표시. node make_srt_result.mjs
import { execFileSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";

const FFMPEG = "C:\\ffmpeg-6.1-essentials_build\\bin\\ffmpeg.exe";
const FONT = "C\\:/Windows/Fonts/malgun.ttf";
const FONT_B = "C\\:/Windows/Fonts/malgunbd.ttf";
const DIR = "f:\\ainspire 4기 강의\\demo-assets";
const W = 1280, H = 720, FPS = 30;

// 실제 narration.srt 내용 (Whisper 출력 그대로)
const lines = [
  { t: "narration.srt", head: true },
  { t: "" },
  { t: "1", idx: true },
  { t: "00:00:00,000 --> 00:00:02,000", time: true },
  { t: "안녕하세요." },
  { t: "" },
  { t: "2", idx: true },
  { t: "00:00:02,000 --> 00:00:10,000", time: true },
  { t: "이번 영상에서는 인공지능 도구를 활용해" },
  { t: "쇼츠 한 편을 만드는 과정을 살펴보겠습니다." },
  { t: "" },
  { t: "3", idx: true },
  { t: "00:00:10,000 --> 00:00:16,000", time: true },
  { t: "영상 다운로드부터 자막 생성까지" },
  { t: "누구나 따라 할 수 있습니다." },
];

const tmp = [];
function tf(tag, text) {
  const p = `${DIR}\\_r_${tag}.txt`;
  writeFileSync(p, text, "utf8");
  tmp.push(p);
  return p.replace(/\\/g, "/").replace(/:/g, "\\:");
}
function dt({ file, font = FONT, size, color, x, y, start, box, boxcolor, boxw = 0 }) {
  let s = `drawtext=fontfile='${font}':textfile='${file}':expansion=none:fontcolor=${color}:fontsize=${size}:x=${x}:y=${y}`;
  if (box) s += `:box=1:boxcolor=${boxcolor}:boxborderw=${boxw}`;
  if (start != null) s += `:enable='gte(t\\,${start.toFixed(2)})'`;
  return s;
}

const draws = [];
// 상단 파일탭
draws.push(dt({ file: tf("tab", "  narration.srt   —   자막 파일"), font: FONT_B, size: 20, color: "0xBBA4FF", x: 30, y: 26 }));

let y = 92;
let t = 0.4;
lines.forEach((ln, i) => {
  if (ln.head) return; // 탭으로 대체
  if (ln.t === "") { y += 18; return; }
  let color = "0xE8E2F5";
  if (ln.idx) color = "0xFFE600";
  else if (ln.time) color = "0x7CFC9A";
  draws.push(dt({ file: tf(i, ln.t), size: ln.time ? 22 : 26, color, x: 48, y, start: t }));
  y += ln.time ? 38 : 42;
  t += 0.45;
});

const total = t + 2.4;
const fc = `color=c=0x0D0420:s=${W}x${H}:d=${total.toFixed(2)}:r=${FPS}[bg];[bg]` + draws.join(",") + "[v]";
const out = `${DIR}\\rec-whisper-result.mp4`;
console.log(`렌더링: rec-whisper-result.mp4 (${total.toFixed(1)}초)`);
execFileSync(FFMPEG, ["-y", "-filter_complex", fc, "-map", "[v]", "-pix_fmt", "yuv420p", "-c:v", "libx264", "-preset", "medium", out], { stdio: "inherit" });
tmp.forEach(f => { try { unlinkSync(f); } catch {} });
console.log("완료:", out);
