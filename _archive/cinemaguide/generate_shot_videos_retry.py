"""
E005 우회 재시도 - 텍스트 전용 (image_references 제거)
대상: 1_롱샷, 2_미디엄샷, 10_리액션샷
"""

import replicate
import time
import urllib.request
from pathlib import Path

OUT_DIR = Path(r"F:\ainspire 4기 강의\cinemaguide\video_new")
OUT_DIR.mkdir(exist_ok=True)

SHOTS = [
    {
        "filename": "1_롱샷(와이드).mp4",
        "prompt": "Wide long shot. A young Korean woman with long wavy dark hair wearing an ivory knit sweater stands in a bright minimal indoor room with large windows and soft natural light. Camera slowly pulls back revealing the full environment. Elegant calm atmosphere.",
    },
    {
        "filename": "2_미디엄샷.mp4",
        "prompt": "Medium shot. A young Korean woman with long wavy dark hair wearing an ivory knit sweater, framed from waist up. She turns her head slightly toward camera with a calm smile. Soft natural window light, minimal white interior.",
    },
    {
        "filename": "10_리액션샷.mp4",
        "prompt": "Reaction close-medium shot. A young Korean woman with long wavy dark hair wearing an ivory knit sweater reacts with surprise — eyes widen, hand moves gently to chest, lips slightly part. Natural emotional micro-expression. Bright minimal indoor background.",
    },
]

print("=== 재시도 영상 생성 ===")
jobs = []
for shot in SHOTS:
    print(f"[시작] {shot['filename']}")
    try:
        pred = replicate.predictions.create(
            model="bytedance/seedance-2.0",
            input={
                "prompt": shot["prompt"],
                "duration": 4,
                "aspect_ratio": "16:9",
                "resolution": "720p",
            }
        )
        jobs.append({"filename": shot["filename"], "pred": pred})
    except Exception as e:
        print(f"[오류] {shot['filename']}: {e}")

print(f"\n=== 폴링 ({len(jobs)}개) ===")
done = set()
for attempt in range(60):
    for job in jobs:
        if job["filename"] in done:
            continue
        pred = job["pred"]
        pred.reload()
        if pred.status == "succeeded":
            done.add(job["filename"])
            output = pred.output
            url = output[0] if isinstance(output, list) else output
            if hasattr(url, "url"):
                url = url.url
            out_path = OUT_DIR / job["filename"]
            urllib.request.urlretrieve(str(url), out_path)
            print(f"[완료] {job['filename']} → {out_path}")
        elif pred.status == "failed":
            done.add(job["filename"])
            print(f"[실패] {job['filename']}: {pred.error}")
    if len(done) >= len(jobs):
        break
    print(f"  대기... ({len(done)}/{len(jobs)}) {attempt*10}s")
    time.sleep(10)

print(f"\n=== 완료: {len(done)}/{len(jobs)}개 ===")
