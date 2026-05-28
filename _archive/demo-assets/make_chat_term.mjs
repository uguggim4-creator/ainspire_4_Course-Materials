// 위: 에이전트 대화(사용자 요청 → AI 응답), 아래: 터미널 실행 로그.
// 한 mp4 안에서 채팅이 먼저 뜨고, 이어서 터미널이 실행되는 흐름.
// 의존성 없음 — ffmpeg drawtext만. node make_chat_term.mjs <name>
import { execFileSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";

const FFMPEG = "C:\\ffmpeg-6.1-essentials_build\\bin\\ffmpeg.exe";
const FONT = "C\\:/Windows/Fonts/malgun.ttf";       // 본문(한글)
const FONT_B = "C\\:/Windows/Fonts/malgunbd.ttf";   // 굵게
const DIR = "f:\\ainspire 4기 강의\\demo-assets";

const W = 1280, H = 720, FPS = 30;
const SPLIT = 300;          // 상단 채팅영역 높이
const STEP = 0.7;           // 등장 간격(초)
const HOLD = 2.5;

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
  const p = `${DIR}\\_c_${name}_${tag}.txt`;
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
// 앱 헤더
draws.push(dt({ file: tf("hdr", "  AI 에이전트"), font: FONT_B, size: 20, color: "0x1A1530", x: 30, y: 22 }));

let t = STEP;
// 사용자 말풍선 (오른쪽 정렬 느낌, 보라 박스)
draws.push(dt({ file: tf("ulabel", "나"), size: 16, color: "0x6020FF", x: 40, y: 78, start: t }));
draws.push(dt({ file: tf("user", sc.user), size: 24, color: "0xFFFFFF", x: 60, y: 110, start: t, box: true, boxcolor: "0x6020FF", boxw: 18 }));

t += STEP * 1.6;
// AI 응답 (왼쪽, 연회색 박스)
draws.push(dt({ file: tf("alabel", "AI"), size: 16, color: "0x6020FF", x: 40, y: 188, start: t }));
draws.push(dt({ file: tf("ai", sc.ai), size: 22, color: "0x1A1530", x: 60, y: 218, start: t, box: true, boxcolor: "0xEDE5FF", boxw: 16 }));

// 터미널 영역 타이틀
t += STEP * 1.5;
draws.push(dt({ file: tf("tterm", "  ● ● ●   터미널 — " + sc.title + " 실행"), size: 18, color: "0xBBA4FF", x: 24, y: SPLIT + 22, start: t }));

// 터미널 로그 줄들
sc.term.forEach((ln, i) => {
  t += STEP;
  const y = SPLIT + 64 + i * 36;
  const color = ln.startsWith("$") ? "0xFFE600" : (ln.includes("완료") ? "0x7CFC9A" : "0xE8E2F5");
  draws.push(dt({ file: tf("t" + i, ln), size: 22, color, x: 40, y, start: t }));
});

const total = t + HOLD;
// 배경: 상단 흰색 + 하단 다크. split을 위해 두 color 소스를 overlay
const fc =
  `color=c=0xFFFFFF:s=${W}x${SPLIT}:d=${total.toFixed(2)}:r=${FPS}[top];` +
  `color=c=0x0D0420:s=${W}x${H - SPLIT}:d=${total.toFixed(2)}:r=${FPS}[bot];` +
  `color=c=0xFFFFFF:s=${W}x${H}:d=${total.toFixed(2)}:r=${FPS}[base];` +
  `[base][top]overlay=0:0[a];[a][bot]overlay=0:${SPLIT}[bg];` +
  `[bg]` + draws.join(",") + "[v]";

const out = `${DIR}\\rec-${name}-flow.mp4`;
console.log(`렌더링: rec-${name}.mp4 (${total.toFixed(1)}초)`);
execFileSync(FFMPEG, ["-y", "-filter_complex", fc, "-map", "[v]", "-pix_fmt", "yuv420p", "-c:v", "libx264", "-preset", "medium", out], { stdio: "inherit" });
tmp.forEach(f => { try { unlinkSync(f); } catch {} });
console.log("완료:", out);
