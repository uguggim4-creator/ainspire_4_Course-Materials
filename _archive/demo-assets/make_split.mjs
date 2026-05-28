// 대화 영상과 터미널 영상을 별도 mp4 2개로 분리 생성.
// 의존성 없음 — ffmpeg drawtext만. node make_split.mjs <name>
// 출력: rec-<name>-chat.mp4 (16:9), rec-<name>-term.mp4 (16:9)
import { execFileSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";

const FFMPEG = "C:\\ffmpeg-6.1-essentials_build\\bin\\ffmpeg.exe";
const FONT = "C\\:/Windows/Fonts/malgun.ttf";
const FONT_B = "C\\:/Windows/Fonts/malgunbd.ttf";
const DIR = "f:\\ainspire 4기 강의\\demo-assets";

const W = 1280, H = 720, FPS = 30;
const STEP = 0.7, HOLD = 2.4;

const SCENES = {
  ytdlp: {
    title: "yt-dlp",
    user: "yt-dlp로 이 유튜브 영상 원본이랑 음성만 따로 받아줘",
    ai: "네. yt-dlp로 영상과 오디오를 내려받겠습니다.",
    term: [
      "$ yt-dlp -f mp4 \"https://youtube.com/watch?v=...\"",
      "[download] Destination: sample.mp4",
      "[download]  48.2% of 27.20MiB at 797KiB/s",
      "[download] 100% of 27.20MiB in 00:00:34",
      "완료: sample.mp4 / sample.mp3",
    ],
  },
  ffmpeg1: {
    title: "FFmpeg",
    user: "FFmpeg로 이 영상 9:16 세로 비율로 잘라줘",
    ai: "네. 가운데를 크롭해 1080x1920으로 변환하겠습니다.",
    term: [
      "$ ffmpeg -i sample.mp4 -vf \"crop=202:360,scale=1080:1920\" out.mp4",
      "Input  #0: 640x360  16:9",
      "frame=  185 fps=55 time=00:00:09.98",
      "Output #0: 1080x1920  9:16",
      "완료: vertical_9x16.mp4",
    ],
  },
  whisper: {
    title: "Whisper",
    user: "Whisper로 이 영상 음성을 받아써서 자막 파일로 만들어줘",
    ai: "네. 음성을 인식해 자막(.srt)을 생성하겠습니다.",
    term: [
      "$ whisper narration.wav --model base --language ko",
      "Detecting language ... ko (Korean)",
      "[00:00 --> 00:02]  안녕하세요.",
      "[00:02 --> 00:10]  이번 영상에서는 AI 도구를 활용해...",
      "완료: narration.srt",
    ],
  },
  ffmpeg2: {
    title: "FFmpeg",
    user: "편집한 영상에 자막이랑 BGM 합쳐서 최종 mp4로 뽑아줘",
    ai: "네. 자막을 입히고 BGM을 믹스해 마무리하겠습니다.",
    term: [
      "$ ffmpeg -i vertical.mp4 -i bgm.mp3 -vf subtitles=ko.srt final.mp4",
      "[Parsed_subtitles] reading narration.srt ...",
      "Stream mapping: overlay subtitles + mix audio",
      "frame=  300 fps=50 Lsize=2210kB",
      "완료: final_shorts.mp4 (업로드용)",
    ],
  },
};

const name = process.argv[2];
const sc = SCENES[name];
if (!sc) { console.error("unknown:", name); process.exit(1); }

const tmp = [];
function tf(tag, text) {
  const p = `${DIR}\\_s_${name}_${tag}.txt`;
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
function render(out, bgColor, draws, total) {
  const fc = `color=c=${bgColor}:s=${W}x${H}:d=${total.toFixed(2)}:r=${FPS}[bg];[bg]` + draws.join(",") + "[v]";
  console.log(`렌더링: ${out.split("\\").pop()} (${total.toFixed(1)}초)`);
  execFileSync(FFMPEG, ["-y", "-filter_complex", fc, "-map", "[v]", "-pix_fmt", "yuv420p", "-c:v", "libx264", "-preset", "medium", out], { stdio: "inherit" });
}

// ── 1) 대화 영상 (밝은 배경) ──
{
  const d = [];
  d.push(dt({ file: tf("hdr", "  AI 에이전트"), font: FONT_B, size: 26, color: "0x1A1530", x: 48, y: 40 }));
  let t = STEP;
  d.push(dt({ file: tf("ul", "나"), size: 20, color: "0x6020FF", x: 60, y: 150, start: t }));
  d.push(dt({ file: tf("u", sc.user), size: 30, color: "0xFFFFFF", x: 90, y: 192, start: t, box: true, boxcolor: "0x6020FF", boxw: 26 }));
  t += STEP * 1.8;
  d.push(dt({ file: tf("al", "AI"), size: 20, color: "0x6020FF", x: 60, y: 330, start: t }));
  d.push(dt({ file: tf("a", sc.ai), size: 28, color: "0x1A1530", x: 90, y: 372, start: t, box: true, boxcolor: "0xEDE5FF", boxw: 24 }));
  const total = t + HOLD;
  render(`${DIR}\\rec-${name}-chat.mp4`, "0xFFFFFF", d, total);
}

// ── 2) 터미널 영상 (다크 배경) ──
{
  const d = [];
  d.push(dt({ file: tf("tt", "  ● ● ●    터미널 — " + sc.title + " 실행"), size: 24, color: "0xBBA4FF", x: 36, y: 36 }));
  let t = STEP;
  sc.term.forEach((ln, i) => {
    const y = 110 + i * 56;
    const color = ln.startsWith("$") ? "0xFFE600" : (ln.includes("완료") ? "0x7CFC9A" : "0xE8E2F5");
    d.push(dt({ file: tf("t" + i, ln), size: 26, color, x: 48, y, start: t }));
    t += STEP;
  });
  const total = t + HOLD;
  render(`${DIR}\\rec-${name}-term.mp4`, "0x0D0420", d, total);
}

tmp.forEach(f => { try { unlinkSync(f); } catch {} });
console.log("완료:", name);
