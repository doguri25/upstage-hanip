"""업스테이지한입 만들기.
dist/index.html  미리보기(Artifact)용 조각. 글꼴은 페이지 안에 넣는다.
dist/local.html  시험용(모든 단원을 한꺼번에 불러옴). fitcheck·wrapcheck가 쓴다.
dist/web/        배포(Vercel·PWA)용. 글꼴은 따로 파일, 서비스 워커·manifest·아이콘 포함.
홈 화면은 units/index.js(요약)만으로 그리고, 단원 본문(units/cXuY.js)은 레슨을 열 때 불러온다."""
import os, glob, shutil, base64, hashlib, json, subprocess

os.makedirs('dist/units', exist_ok=True)
for f in glob.glob('dist/units/*.js'): os.remove(f)
units = sorted(glob.glob('units/*.js'))
for f in units:
    open('dist/' + f, 'w').write('(function(){\n' + open(f).read() + '\n})();\n')
meta = subprocess.run(['node', 'meta.mjs'], capture_output=True, text=True, check=True).stdout
# 찾아보기: 파일들을 하나로 묶는다(작아서 처음에 같이 불러옴)
for name in ('guide',):
    open(f'dist/{name}.js', 'w').write(''.join('(function(){\n' + open(f).read() + '\n})();\n' for f in sorted(glob.glob(f'{name}/*.js'))))
open('dist/units/index.js', 'w').write('HANIP.meta(' + meta + ');\n')

FONTS = [('R', '400'), ('B', '600 700'), ('EB', '800 900')]
def fontface(src, w):
    return f"@font-face{{font-family:'NanumSquareRound';font-weight:{w};font-style:normal;font-display:swap;src:url({src}) format('woff2')}}"
def inline_fonts():
    return ''.join(fontface('data:font/woff2;base64,' + base64.b64encode(open(f'fonts/NanumSquareRound{n}.woff2', 'rb').read()).decode(), w) for n, w in FONTS)
def sha(b): return hashlib.sha1(b).hexdigest()[:10]

src_head = open('src/head.html').read()
app = (open('src/app-info.js').read() + '\n' + open('src/app.js').read()
       .replace('/*CORE*/', open('src/simcore.js').read() + '\n' + open('src/core.js').read() + '\n' + open('src/pyrun.js').read())
       .replace('/*VIEWS*/', open('src/training.js').read() + '\n' + open('src/views.js').read()))
STUB = ('<script>window.HANIP = { units:[], _wait:{}, g:[], meta(list){ this.units = list; }, guide(list){ this.g.push(...list); },\n'
        '  unit(u){ const m = this.units.find(x => x.id === u.id);\n'
        '    if (m){ const min = {}; m.items.forEach(i => { min[i.id] = i.min; }); Object.assign(m, u); m.items.forEach(i => { if (min[i.id]) i.min = min[i.id]; }); }\n'
        '    else this.units.push(u);\n'
        '    (this._wait[u.id] || []).forEach(f => f()); delete this._wait[u.id]; } };</script>\n')
LAZY = '<script src="units/index.js"></script>\n<script src="guide.js"></script>\n'
EAGER = LAZY + '\n'.join(f'<script src="{f}"></script>' for f in units) + '\n'
def body(loader): return '\n<div id="app"></div>\n' + STUB + loader + '<script>\n' + app + '\n</script>\n'

head = src_head.replace('/*FONTS*/', inline_fonts())
open('dist/index.html', 'w').write(head + body(LAZY))
open('dist/local.html', 'w').write('<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>body{margin:0}</style></head><body>'
    + head + body(EAGER) + '</body></html>')

# ---- 웹(Vercel·PWA)용: dist/web ----
W = 'dist/web'
shutil.rmtree(W, ignore_errors=True)
os.makedirs(W + '/units'); os.makedirs(W + '/fonts')
shutil.copytree('assets/icons', W + '/icons')
for f in glob.glob('dist/units/*.js'): shutil.copy(f, W + '/units/')
shutil.copy('dist/guide.js', f'{W}/guide.js')
fv = {}
for n, _ in FONTS:
    b = open(f'fonts/NanumSquareRound{n}.woff2', 'rb').read(); fv[n] = sha(b)
    open(f'{W}/fonts/NanumSquareRound{n}.woff2', 'wb').write(b)
web_fonts = ''.join(fontface(f'fonts/NanumSquareRound{n}.woff2?v={fv[n]}', w) for n, w in FONTS)
webhead = src_head.replace('/*FONTS*/', web_fonts)
DESC = '업스테이지 Solar·Document Parse·Information Extract로 수업 도구와 에이전트를 만드는 법을 한입씩 배우는 개인 학습앱. 기반연수 대비부터 대회 준비까지.'
manifest = { 'name':'업스테이지한입', 'short_name':'업스테이지한입', 'description':DESC, 'lang':'ko', 'dir':'ltr', 'id':'./', 'start_url':'./', 'scope':'./',
  'display':'standalone', 'background_color':'#F5F5F7', 'theme_color':'#F5F5F7', 'categories':['education'],
  'icons':[{ 'src':'icons/icon-192.png', 'sizes':'192x192', 'type':'image/png', 'purpose':'any' },
           { 'src':'icons/icon-512.png', 'sizes':'512x512', 'type':'image/png', 'purpose':'any' },
           { 'src':'icons/maskable-512.png', 'sizes':'512x512', 'type':'image/png', 'purpose':'maskable' }] }
json.dump(manifest, open(W + '/manifest.webmanifest', 'w'), ensure_ascii=False, indent=2)
others = sorted(os.path.relpath(os.path.join(d, f), W) for d, _, fs in os.walk(W) for f in fs)
ver = sha((webhead + app + STUB).encode() + b''.join(open(os.path.join(W, f), 'rb').read() for f in others))
headtags = ('<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
  f'<meta name="description" content="{DESC}">'
  '<meta name="theme-color" content="#F5F5F7" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#161618" media="(prefers-color-scheme: dark)">'
  '<link rel="manifest" href="manifest.webmanifest"><link rel="icon" type="image/png" href="icons/favicon-64.png"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png">'
  '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="업스테이지한입"><meta name="apple-mobile-web-app-status-bar-style" content="default">'
  + ''.join(f'<link rel="preload" href="fonts/NanumSquareRound{n}.woff2?v={fv[n]}" as="font" type="font/woff2" crossorigin>' for n in ('R', 'B')))
reg = (f"<script>window.HANIP_WEB = true; window.HANIP_VER = '{ver}';"
       " if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));</script>")
open(W + '/index.html', 'w').write('<!doctype html><html lang="ko"><head>' + headtags + webhead + '</head><body>' + reg + body(LAZY.replace('units/index.js', f'units/index.js?v={ver}').replace('guide.js', f'guide.js?v={ver}')) + '</body></html>')
# 미리 저장할 파일: 단원은 index.html이 부르는 주소 그대로(?v=버전), 글꼴도 CSS가 부르는 주소 그대로
pre = ['./'] + [f'{f}?v={ver}' if f.startswith('units/') or f == 'guide.js' else f'{f}?v={fv[f[len("fonts/NanumSquareRound"):-6]]}' if f.startswith('fonts/') else f for f in others]
open(W + '/sw.js', 'w').write(open('src/sw.js').read().replace('/*VERSION*/', ver).replace('/*FILES*/', json.dumps(pre)))
kb = lambda p: os.path.getsize(p) // 1024
print(f'web {W} version {ver} · {len(pre)} files · index.html {kb(W + "/index.html")}KB · units/index.js {kb(W + "/units/index.js")}KB')
print('built', len(units), 'units:', ' '.join(os.path.basename(u)[:-3] for u in units))
