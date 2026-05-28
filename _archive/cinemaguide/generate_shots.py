"""
cineguide 샷 기법 이미지 생성 스크립트
ref: dolly_in_frame_03.jpg (클로즈업 기준 인물)
모델: openai/gpt-image-2
"""

import replicate
import base64
import os
import time
import urllib.request
from pathlib import Path

# --- ref 이미지 dataUri 인코딩 ---
REF_PATH = Path(r"F:\ainspire 4기 강의\class-ainspire\cineguide\img\dolly_in_frame_03.jpg")
with open(REF_PATH, "rb") as f:
    ref_b64 = base64.b64encode(f.read()).decode()
ref_data_uri = f"data:image/jpeg;base64,{ref_b64}"

# --- 출력 폴더 ---
OUT_DIR = Path(r"F:\ainspire 4기 강의\cinemaguide\img_new")
OUT_DIR.mkdir(exist_ok=True)

# --- 공통 배경 설명 ---
BG = "bright minimal indoor space, large window with soft natural light, white wall, wooden floor, warm soft bokeh background"

# --- 샷별 프롬프트 정의 ---
SHOTS = [
    {
        "filename": "1_롱샷(와이드).png",
        "prompt": f"Full body long wide shot of a Korean woman, long wavy dark hair, ivory knit sweater, standing in a {BG}. She is small in frame, entire body visible, environment dominates the composition. Cinematic 16:9."
    },
    {
        "filename": "2_미디엄샷.png",
        "prompt": f"Medium shot of a Korean woman, long wavy dark hair, ivory knit sweater, framed from waist up, {BG}. Natural relaxed pose, looking slightly off-camera. Cinematic 16:9."
    },
    {
        "filename": "3_클로즈업.png",
        "prompt": f"Close-up shot of a Korean woman's face, long wavy dark hair, ivory knit sweater, face fills the frame, {BG} softly blurred. Calm expressive eyes, subtle natural makeup. Cinematic 16:9."
    },
    {
        "filename": "5_오버숄더샷.png",
        "prompt": f"Over-the-shoulder shot, Korean woman with long wavy dark hair and ivory knit sweater seen from behind another person's shoulder (dark jacket, back of head in foreground left), she faces the camera smiling gently, {BG}. Cinematic 16:9."
    },
    {
        "filename": "6_투샷(그룹샷).png",
        "prompt": f"Two-shot of two Korean women sitting together, one with long wavy dark hair and ivory knit sweater (main subject), another woman beside her, both in frame, {BG}. Warm friendly interaction. Cinematic 16:9."
    },
    {
        "filename": "7_탑뷰.png",
        "prompt": f"Top-down bird's eye view shot looking directly down at a Korean woman with long wavy dark hair and ivory knit sweater, sitting at a white desk, hands resting on table, face looking upward toward camera, {BG} from above. Cinematic 16:9."
    },
    {
        "filename": "10_리액션샷.png",
        "prompt": f"Reaction shot, close-medium framing of a Korean woman with long wavy dark hair and ivory knit sweater, surprised and slightly emotional expression, eyes wide, mouth slightly open, {BG}. Cinematic 16:9."
    },
    {
        "filename": "11_인서트샷.png",
        "prompt": f"Insert shot, extreme close-up of a Korean woman's hands with ivory knit sweater sleeves, holding a white ceramic coffee mug on a white table, soft natural window light, warm bokeh. Cinematic 16:9."
    },
    {
        "filename": "14_핸드핼드샷.png",
        "prompt": f"Handheld shot feel, slightly unstable framing of a Korean woman with long wavy dark hair and ivory knit sweater walking toward camera, {BG}, slight motion blur on edges, documentary-style energy. Cinematic 16:9."
    },
    {
        "filename": "21_더치틸트샷.png",
        "prompt": f"Dutch tilt shot, Korean woman with long wavy dark hair and ivory knit sweater, camera tilted at roughly 20 degrees, creating a diagonal composition, {BG}, dramatic tension in the angle. Cinematic 16:9."
    },
]

def generate_shot(shot):
    name = shot["filename"]
    print(f"[시작] {name}")
    try:
        pred = replicate.predictions.create(
            model="openai/gpt-image-2",
            input={
                "prompt": shot["prompt"],
                "aspect_ratio": "3:2",
                "quality": "medium",
                "number_of_images": 1,
                "output_format": "png",
                "input_images": [ref_data_uri],
            }
        )
        return {"filename": name, "pred": pred}
    except Exception as e:
        print(f"[오류] {name}: {e}")
        return {"filename": name, "pred": None, "error": str(e)}

# --- 병렬 시작 ---
print("=== 전체 생성 시작 ===")
jobs = [generate_shot(s) for s in SHOTS]

# --- 폴링 ---
print(f"\n=== 폴링 시작 ({len(jobs)}개) ===")
done = set()
for attempt in range(60):  # 최대 10분
    all_done = True
    for job in jobs:
        if job["filename"] in done or job["pred"] is None:
            continue
        pred = job["pred"]
        pred.reload()
        if pred.status == "succeeded":
            done.add(job["filename"])
            # 출력 URL 가져오기
            output = pred.output
            if isinstance(output, list):
                url = output[0]
                if hasattr(url, "url"):
                    url = url.url
            else:
                url = str(output)
                if hasattr(output, "url"):
                    url = output.url
            out_path = OUT_DIR / job["filename"]
            urllib.request.urlretrieve(url, out_path)
            print(f"[완료] {job['filename']} → {out_path}")
        elif pred.status == "failed":
            done.add(job["filename"])
            print(f"[실패] {job['filename']}: {pred.error}")
        else:
            all_done = False
    if all_done or len(done) == len([j for j in jobs if j["pred"] is not None]):
        break
    print(f"  대기 중... ({len(done)}/{len(jobs)}) {attempt*10}s")
    time.sleep(10)

print(f"\n=== 완료: {len(done)}/{len(jobs)}개 ===")
print(f"출력 폴더: {OUT_DIR}")
