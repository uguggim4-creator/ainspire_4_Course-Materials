// 실제 도구 출력 로그를 "터미널처럼 한 줄씩 나타나는" mp4로 렌더링.
// 의존성 없음 — ffmpeg drawtext 필터만 사용. node make_term_video.mjs <name>
import { execFileSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";

const FFMPEG = "C:\\ffmpeg-6.1-essentials_build\\bin\\ffmpeg.exe";
const FONT = "C\\:/Windows/Fonts/malgun.ttf"; // 한글+영문 지원, ffmpeg filter용 escape
const W = 1280, H = 720, FPS = 30;
const LINE_DELAY = 0.55;   // 줄당 등장 간격(초)
const HOLD = 2.2;          // 마지막 줄 후 정지(초)
const PAD_X = 48, PAD_TOP = 70, LH = 34, FS = 22;

const SCENES = {
  "ytdlp": {
    title: "yt-dlp — 영상 다운로드",
    lines: [
      "$ yt-dlp -f mp4 \"https://youtube.com/watch?v=...\"",
      "[youtube] Extracting URL ...",
      "[youtube] Downloading webpage",
      "[info] Downloading 1 format(s): 18",
      "[download] Destination: sample.mp4",
      "[download]  12.3% of 27.20MiB at 798KiB/s ETA 00:30",
      "[download]  48.2% of 27.20MiB at 797KiB/s ETA 00:18",
      "[download]  87.0% of 27.20MiB at 798KiB/s ETA 00:04",
      "[download] 100% of 27.20MiB in 00:00:34",
      "$ _",
    ],
  },
  "ffmpeg1": {
    title: "FFmpeg — 9:16 세로 변환",
    lines: [
      "$ ffmpeg -i sample.mp4 -vf \"crop=202:360:219:0,scale=1080:1920\" out.mp4",
      "Input  #0: 640x360  h264  16:9",
      "Stream mapping: h264 (native) -> h264 (libx264)",
      "Output #0: 1080x1920  h264  9:16",
      "frame=   41 fps=39 q=29.0 time=00:00:04.85",
      "frame=  121 fps=53 q=29.0 time=00:00:07.66",
      "frame=  185 fps=55 q=29.0 time=00:00:09.98",
      "frame=  300 fps=54 Lsize=1142kB  bitrate=937kbits/s",
      "변환 완료: vertical_9x16.mp4 (1080x1920)",
      "$ _",
    ],
  },
  "whisper": {
    title: "Whisper — 자막 자동 생성",
    lines: [
      "$ whisper narration.wav --model base --language ko --output_format srt",
      "Detecting language ... ko (Korean)",
      "[00:00.000 --> 00:02.000]  안녕하세요.",
      "[00:02.000 --> 00:10.000]  이번 영상에서는 AI 도구를 활용해",
      "                          쇼츠 한 편을 만드는 과정을 살펴보겠습니다.",
      "[00:10.000 --> 00:16.000]  영상 다운로드부터 자막 생성까지",
      "                          누구나 따라 할 수 있습니다.",
      "자막 생성 완료: narration.srt",
      "$ _",
    ],
  },
  "ffmpeg2": {
    title: "FFmpeg — 자막·BGM 합치기",
    lines: [
      "$ ffmpeg -i vertical.mp4 -i bgm.mp3 -vf subtitles=narration.srt final.mp4",
      "Input #0: vertical.mp4  (video)",
      "Input #1: bgm.mp3       (audio)",
      "[Parsed_subtitles] reading narration.srt ...",
      "Stream mapping: overlay subtitles + mix audio",
      "frame=  160 fps=48 q=28.0 time=00:00:05.3",
      "frame=  300 fps=50 Lsize=2210kB  bitrate=1.7Mbit/s",
      "최종 영상 완성: final_shorts.mp4 (업로드용)",
      "$ _",
    ],
  },
};

const name = process.argv[2];
const scene = SCENES[name];
if (!scene) { console.error("unknown scene:", name); process.exit(1); }

// 한글/특수문자를 drawtext가 textfile로 안전하게 읽도록 줄마다 임시 파일 사용
function esc(p) { return p.replace(/\\/g, "/").replace(/:/g, "\\:"); }

const tmpFiles = [];
const draws = [];
scene.lines.forEach((ln, i) => {
  const tf = `f:\\ainspire 4기 강의\\demo-assets\\_line_${name}_${i}.txt`;
  writeFileSync(tf, ln, "utf8");
  tmpFiles.push(tf);
  const y = PAD_TOP + i * LH;
  const start = (i + 1) * LINE_DELAY;
  const color = ln.startsWith("$") ? "0xFFE600" : (ln.includes("완료") || ln.includes("100%") ? "0x7CFC9A" : "0xE8E2F5");
  draws.push(
    `drawtext=fontfile='${FONT}':textfile='${esc(tf)}':expansion=none:fontcolor=${color}:fontsize=${FS}:x=${PAD_X}:y=${y}:enable='gte(t\\,${start.toFixed(2)})'`
  );
});

// 상단 타이틀바
const titleTf = `f:\\ainspire 4기 강의\\demo-assets\\_title_${name}.txt`;
writeFileSync(titleTf, "  ● ● ●    " + scene.title, "utf8");
tmpFiles.push(titleTf);
draws.unshift(
  `drawtext=fontfile='${FONT}':textfile='${esc(titleTf)}':expansion=none:fontcolor=0xBBA4FF:fontsize=20:x=24:y=24`
);

const total = (scene.lines.length + 1) * LINE_DELAY + HOLD;
const filter = `color=c=0x0D0420:s=${W}x${H}:d=${total.toFixed(2)}:r=${FPS}[bg];[bg]` + draws.join(",") + "[v]";
const out = `f:\\ainspire 4기 강의\\demo-assets\\rec-${name}.mp4`;

console.log(`렌더링: rec-${name}.mp4  (${total.toFixed(1)}초)`);
execFileSync(FFMPEG, [
  "-y",
  "-filter_complex", filter,
  "-map", "[v]",
  "-pix_fmt", "yuv420p",
  "-c:v", "libx264",
  "-preset", "medium",
  out,
], { stdio: "inherit" });

tmpFiles.forEach(f => { try { unlinkSync(f); } catch {} });
console.log("완료:", out);
