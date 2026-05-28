"""
cineguide 샷 기법 영상 생성 스크립트
first_frame: img_new/*.png (각 샷별 생성 이미지)
모델: bytedance/seedance-2.0
"""

import replicate
import base64
import os
import time
import urllib.request
from pathlib import Path

IMG_DIR = Path(r"F:\ainspire 4기 강의\cinemaguide\img_new")
OUT_DIR = Path(r"F:\ainspire 4기 강의\cinemaguide\video_new")
OUT_DIR.mkdir(exist_ok=True)

def img_to_data_uri(path: Path) -> str:
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    return f"data:image/png;base64,{b64}"

SHOTS = [
    {
        "filename": "1_롱샷(와이드).mp4",
        "image":    "1_롱샷(와이드).png",
        "prompt":   "Wide long shot. The woman stands still in the bright minimal room, camera slowly pulls back revealing the full environment. Gentle natural light, soft ambient atmosphere. Static elegant movement.",
    },
    {
        "filename": "2_미디엄샷.mp4",
        "image":    "2_미디엄샷.png",
        "prompt":   "Medium shot. The woman turns her head slightly toward the camera with a calm smile, soft hair movement from gentle breeze. Natural breathing, subtle body sway. Warm window light.",
    },
    {
        "filename": "3_클로즈업.mp4",
        "image":    "3_클로즈업.png",
        "prompt":   "Close-up shot. Slow subtle camera push toward the woman's face, eyes blink gently, soft expression shift from neutral to slight smile. Bokeh background stays soft.",
    },
    {
        "filename": "5_오버숄더샷.mp4",
        "image":    "5_오버숄더샷.png",
        "prompt":   "Over-the-shoulder shot. The woman looks at the person in front of her, slight head nod, gentle smile. Camera stays locked over the foreground shoulder. Soft natural light.",
    },
    {
        "filename": "6_투샷(그룹샷).mp4",
        "image":    "6_투샷(그룹샷).png",
        "prompt":   "Two-shot. Both women laugh softly together, natural interaction, slight body movement. Camera remains static, warm intimate framing.",
    },
    {
        "filename": "7_탑뷰.mp4",
        "image":    "7_탑뷰.png",
        "prompt":   "High angle top-down shot. The woman looks up toward the camera from below, slow subtle rotation of camera overhead. Minimal desk surface visible, soft natural light from above.",
    },
    {
        "filename": "10_리액션샷.mp4",
        "image":    "10_리액션샷.png",
        "prompt":   "Reaction shot. The woman reacts with surprise — eyes widen, hand moves slightly to chest, lips part. Natural emotional micro-expression. Tight framing holds steady.",
    },
    {
        "filename": "11_인서트샷.mp4",
        "image":    "11_인서트샷.png",
        "prompt":   "Insert shot. Hands gently lift the white ceramic mug, slight steam rises, fingers wrap around the cup. Extreme close-up, soft bokeh background, no camera movement.",
    },
    {
        "filename": "14_핸드핼드샷.mp4",
        "image":    "14_핸드핼드샷.png",
        "prompt":   "Handheld shot. Slight natural camera shake as the woman walks toward the lens, natural unstable documentary movement, slight zoom drift. Energetic but intimate feel.",
    },
    {
        "filename": "21_더치틸트샷.mp4",
        "image":    "21_더치틸트샷.png",
        "prompt":   "Dutch tilt shot. Camera holds the tilted diagonal composition, woman glances slightly to the side with a contemplative expression. Subtle camera sway enhancing tension.",
    },
]

print("=== 영상 생성 시작 ===")
jobs = []
for shot in SHOTS:
    img_path = IMG_DIR / shot["image"]
    if not img_path.exists():
        print(f"[스킵] {shot['image']} 없음")
        continue
    data_uri = img_to_data_uri(img_path)
    print(f"[시작] {shot['filename']}")
    try:
        pred = replicate.predictions.create(
            model="kwaivgi/kling-v3-video",
            input={
                "prompt": shot["prompt"],
                "duration": 5,
                "mode": "standard",
                "start_image": data_uri,
            }
        )
        jobs.append({"filename": shot["filename"], "pred": pred})
    except Exception as e:
        print(f"[오류] {shot['filename']}: {e}")

print(f"\n=== 폴링 시작 ({len(jobs)}개) ===")
done = set()
for attempt in range(120):  # 최대 20분
    for job in jobs:
        if job["filename"] in done:
            continue
        pred = job["pred"]
        pred.reload()
        if pred.status == "succeeded":
            done.add(job["filename"])
            output = pred.output
            if isinstance(output, list):
                url = output[0]
            else:
                url = output
            if hasattr(url, "url"):
                url = url.url
            url = str(url)
            out_path = OUT_DIR / job["filename"]
            urllib.request.urlretrieve(url, out_path)
            print(f"[완료] {job['filename']} → {out_path}")
        elif pred.status == "failed":
            done.add(job["filename"])
            print(f"[실패] {job['filename']}: {pred.error}")

    if len(done) >= len(jobs):
        break
    remaining = len(jobs) - len(done)
    print(f"  대기 중... ({len(done)}/{len(jobs)}, 남은 {remaining}개) {attempt*10}s")
    time.sleep(10)

print(f"\n=== 완료: {len(done)}/{len(jobs)}개 ===")
print(f"출력 폴더: {OUT_DIR}")
