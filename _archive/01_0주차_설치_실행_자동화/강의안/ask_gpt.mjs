// gpt-5.5-pro (CometAPI /v1/responses) 호출 헬퍼 — 강의 세부내용 작성/검증용
//
// 사용 예:
//   node ask_gpt.mjs --prompt "질문 텍스트" --out 결과.md
//   node ask_gpt.mjs --prompt-file 프롬프트.md --out 결과.md
//   node ask_gpt.mjs --prompt "이어서 질문" --prev resp_xxx        (세션 이어가기)
//   node ask_gpt.mjs --prompt "..." --system-file 작업지시서.md    (형식 고정용 system)
//   node ask_gpt.mjs --prompt "..." --effort high                 (medium|high|xhigh)
//
// 키: 환경변수 COMETAPI_KEY 우선, 없으면 아래 폴백 사용.
// 출력: --out 지정 시 .md 저장. 항상 마지막 줄에 [RESP_ID] resp_xxx 출력(세션 연결용).

import { readFile, writeFile } from "node:fs/promises";
import { request } from "node:https";

const BASE_URL = "https://api.cometapi.com/v1/responses";
const KEY =
  process.env.COMETAPI_KEY ||
  "sk-QZQmyVBr7qu8LDnCmW5iD6oQyPYyOTCxRfartatp3LD3ZK36";

// --- 인자 파싱 (--key value 형태) ---
const args = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith("--")) {
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      args[key] = next;
      i++;
    } else {
      args[key] = true;
    }
  }
}

function fail(msg) {
  console.error("ERROR:", msg);
  process.exit(1);
}

// --- 프롬프트 확보 ---
let prompt = args.prompt;
if (args["prompt-file"]) {
  prompt = await readFile(args["prompt-file"], "utf8");
}
if (!prompt) fail("--prompt 또는 --prompt-file 필요");

// --- system (선택) ---
let system = args.system;
if (args["system-file"]) {
  system = await readFile(args["system-file"], "utf8");
}

const effort = args.effort || "medium"; // medium | high | xhigh
const model = args.model || "gpt-5.5-pro";

// --- responses 입력 구성 ---
// system이 있으면 input을 메시지 배열로, 없으면 단순 문자열로.
let input;
if (system) {
  input = [
    { role: "system", content: system },
    { role: "user", content: prompt },
  ];
} else {
  input = prompt;
}

const body = {
  model,
  input,
  reasoning: { effort },
  store: true,
};
if (args.prev) body.previous_response_id = args.prev;

// --- 호출 ---
// high effort 응답은 첫 헤더까지 오래 걸려 내장 fetch의 헤더 타임아웃(약 5분)을 넘긴다.
// node:https로 직접 호출해 타임아웃을 20분으로 제어한다.
const payload = JSON.stringify(body);
const data = await new Promise((resolve, reject) => {
  const req = request(
    BASE_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
      timeout: 20 * 60 * 1000,
    },
    (res) => {
      let buf = "";
      res.setEncoding("utf8");
      res.on("data", (c) => (buf += c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(buf));
        } catch (e) {
          reject(new Error("JSON 파싱 실패: " + buf.slice(0, 500)));
        }
      });
    }
  );
  req.on("error", reject);
  req.on("timeout", () => {
    req.destroy(new Error("요청 타임아웃 (20분 초과)"));
  });
  req.write(payload);
  req.end();
});

if (data.error) {
  fail(JSON.stringify(data.error, null, 2));
}

// --- 응답 텍스트 추출 ---
const text = (data.output || [])
  .filter((o) => o.type === "message")
  .flatMap((o) => (o.content || []).filter((c) => c.type === "output_text"))
  .map((c) => c.text)
  .join("\n")
  .trim();

if (!text) {
  console.error("경고: 응답 텍스트가 비어있음. 원본:");
  console.error(JSON.stringify(data, null, 2).slice(0, 2000));
}

if (args.out) {
  await writeFile(args.out, text, "utf8");
  console.error(`저장 완료: ${args.out} (${text.length}자)`);
} else {
  console.log(text);
}

// 토큰 사용량 + 세션 id (세션 이어가기용)
const u = data.usage || {};
console.error(
  `[USAGE] in=${u.input_tokens ?? "?"} out=${u.output_tokens ?? "?"} reasoning=${u.output_tokens_details?.reasoning_tokens ?? "?"}`
);
console.error(`[RESP_ID] ${data.id}`);
