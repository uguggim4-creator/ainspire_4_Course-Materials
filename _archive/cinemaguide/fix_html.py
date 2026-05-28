# img 태그 → video 태그 일괄 치환
targets = [
    ('img/1_롱샷(와이드).png', 'img/1_롱샷(와이드).mp4'),
    ('img/2_미디엄샷.png', 'img/2_미디엄샷.mp4'),
    ('img/3_클로즈업.png', 'img/3_클로즈업.mp4'),
    ('img/5_오버숄더샷.png', 'img/5_오버숄더샷.mp4'),
    ('img/6_투샷(그룹샷).png', 'img/6_투샷(그룹샷).mp4'),
    ('img/7_탑뷰.png', 'img/7_탑뷰.mp4'),
    ('img/10_리액션샷.png', 'img/10_리액션샷.mp4'),
    ('img/11_인서트샷.png', 'img/11_인서트샷.mp4'),
    ('img/14_핸드핼드샷.png', 'img/14_핸드핼드샷.mp4'),
    ('img/21_더치틸트샷.png', 'img/21_더치틸트샷.mp4'),
]

with open('cinematography_guide.html', 'r', encoding='utf-8') as f:
    content = f.read()

for old_src, new_src in targets:
    old_tag = f'<img src="{old_src}" alt="preview" class="shot-media">'
    new_tag = f'<video src="{new_src}" autoplay loop muted playsinline class="shot-media"></video>'
    if old_tag in content:
        content = content.replace(old_tag, new_tag)
        print(f'교체: {old_src}')
    else:
        print(f'못찾음: {old_src}')

with open('cinematography_guide.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('저장 완료')
