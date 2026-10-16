/* ============ 손그림 펜 ============ */
const NS = 'http://www.w3.org/2000/svg';
function Pen(svg){
  const rc = window.rough ? rough.svg(svg) : null;
  let seed = 11;
  const put = (node, color) => { node.style.color = `var(--${color})`; svg.append(node); };
  const plain = (kind, a) => {
    const tag = { rectangle:'rect', circle:'circle', ellipse:'ellipse', line:'line', path:'path' }[kind];
    const e = document.createElementNS(NS, tag);
    const set = o => Object.entries(o).forEach(([k, v]) => e.setAttribute(k, v));
    if (kind === 'rectangle') set({ x:a[0], y:a[1], width:a[2], height:a[3] });
    if (kind === 'circle') set({ cx:a[0], cy:a[1], r:a[2] / 2 });
    if (kind === 'ellipse') set({ cx:a[0], cy:a[1], rx:a[2] / 2, ry:a[3] / 2 });
    if (kind === 'line') set({ x1:a[0], y1:a[1], x2:a[2], y2:a[3] });
    if (kind === 'path') set({ d:a[0] });
    return e;
  };
  function shape(kind, args, x = {}){
    const w = x.w ?? 2, rough = x.r ?? 1.1;
    if (x.fill){
      const fs = x.fs || (x.fill === 'paper' ? 'solid' : 'hachure');
      const f = rc ? rc[kind](...args, { stroke:'none', fill:'currentColor', fillStyle:fs, hachureGap:x.gap || 6, fillWeight:x.fw || 1.4, roughness:Math.min(rough, 1.2), seed:seed++ })
                   : (() => { const e = plain(kind, args); e.setAttribute('fill', 'currentColor'); e.setAttribute('fill-opacity', fs === 'solid' ? 1 : .35); return e; })();
      put(f, x.fill);
    }
    if (x.c !== null){
      const s = rc ? rc[kind](...args, { stroke:'currentColor', strokeWidth:w, roughness:rough, bowing:1.2, seed:seed++ })
                   : (() => { const e = plain(kind, args); e.setAttribute('fill', 'none'); e.setAttribute('stroke', 'currentColor'); e.setAttribute('stroke-width', w); e.setAttribute('stroke-linecap', 'round'); return e; })();
      put(s, x.c || 'ink');
    }
  }
  const rrPath = (x, y, w, hh, r) => { r = Math.min(r, w / 2, hh / 2);
    return `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + hh - r} Q${x + w} ${y + hh} ${x + w - r} ${y + hh} H${x + r} Q${x} ${y + hh} ${x} ${y + hh - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const P = {
    rect:(x, y, w, hh, o) => shape('rectangle', [x, y, w, hh], o),
    rrect:(x, y, w, hh, r, o) => shape('path', [rrPath(x, y, w, hh, r)], o),
    circle:(x, y, d, o) => shape('circle', [x, y, d], o),
    ellipse:(x, y, w, hh, o) => shape('ellipse', [x, y, w, hh], o),
    line:(x1, y1, x2, y2, o) => shape('line', [x1, y1, x2, y2], o),
    path:(d, o) => shape('path', [d], o),
    arrow(x1, y1, x2, y2, o = {}){
      shape('line', [x1, y1, x2, y2], o);
      const a = Math.atan2(y2 - y1, x2 - x1), L = o.head || 11;
      shape('line', [x2, y2, x2 - L * Math.cos(a - .5), y2 - L * Math.sin(a - .5)], o);
      shape('line', [x2, y2, x2 - L * Math.cos(a + .5), y2 - L * Math.sin(a + .5)], o);
    },
    curveArrow(x1, y1, cx, cy, x2, y2, o = {}){
      shape('path', [`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`], o);
      const a = Math.atan2(y2 - cy, x2 - cx), L = o.head || 11;
      shape('line', [x2, y2, x2 - L * Math.cos(a - .5), y2 - L * Math.sin(a - .5)], o);
      shape('line', [x2, y2, x2 - L * Math.cos(a + .5), y2 - L * Math.sin(a + .5)], o);
    },
    text(x, y, str, o = {}){
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', x); t.setAttribute('y', y);
      t.setAttribute('text-anchor', o.anchor || 'middle');
      t.setAttribute('font-size', o.size || 17);
      if (o.weight) t.setAttribute('font-weight', o.weight);
      if (o.mono) t.setAttribute('class', 'mono');
      t.style.fill = `var(--${o.c || 'ink'})`;
      t.textContent = str; svg.append(t);
    },
    face(cx, cy, s, o = {}){
      const m = o.mood || 'smile', ex = s * .2, ey = cy - s * .05, ed = s * .13, lw = Math.max(1.2, s * .035);
      const fo = { w:lw, r:.5 };
      P.ellipse(cx - s * .33, cy + s * .1, s * .16, s * .09, { fill:'pink', fs:'solid', c:null, r:.3 });
      P.ellipse(cx + s * .33, cy + s * .1, s * .16, s * .09, { fill:'pink', fs:'solid', c:null, r:.3 });
      const arcUp = x => P.path(`M${x - ed * .6} ${ey + ed * .25} Q${x} ${ey - ed * .7} ${x + ed * .6} ${ey + ed * .25}`, fo);
      const dot = x => { P.circle(x, ey, ed, { fill:'ink', fs:'solid', c:null, r:.3 }); P.circle(x - ed * .18, ey - ed * .2, ed * .38, { fill:'paper', fs:'solid', c:null, r:.2 }); };
      [-1, 1].forEach(side => {
        const x = cx + side * ex;
        if (m === 'proud' || (m === 'wink' && side < 0)) arcUp(x);
        else if (m === 'sleepy') P.line(x - ed * .6, ey + ed * .2, x + ed * .6, ey + ed * .2, fo);
        else if (m === 'dizzy'){ P.line(x - ed * .5, ey - ed * .5, x + ed * .5, ey + ed * .5, fo); P.line(x - ed * .5, ey + ed * .5, x + ed * .5, ey - ed * .5, fo); }
        else dot(x);
      });
      const my = cy + s * .13;
      if (m === 'happy') P.path(`M${cx - s * .12} ${my} Q${cx} ${my + s * .2} ${cx + s * .12} ${my} Z`, { fill:'bad', fs:'solid', w:lw, r:.5 });
      else if (m === 'sad') P.path(`M${cx - s * .08} ${my + s * .05} Q${cx} ${my - s * .04} ${cx + s * .08} ${my + s * .05}`, fo);
      else if (m === 'wow') P.ellipse(cx, my + s * .03, s * .09, s * .11, { fill:'bad', fs:'solid', w:lw, r:.4 });
      else if (m === 'sleepy') P.line(cx - s * .04, my + s * .02, cx + s * .04, my + s * .02, fo);
      else if (m === 'dizzy') P.path(`M${cx - s * .1} ${my} Q${cx - s * .05} ${my - s * .05} ${cx} ${my} Q${cx + s * .05} ${my + s * .05} ${cx + s * .1} ${my}`, fo);
      else P.path(`M${cx - s * .09} ${my} Q${cx} ${my + s * .1} ${cx + s * .09} ${my}`, fo);
    },
    robot(cx, cy, s = 1, o = {}){
      P.line(cx, cy - 44 * s, cx, cy - 52 * s, { w:2 * s + .6 });
      P.heart(cx, cy - 55 * s, 5 * s, 'bad');
      P.rrect(cx - 45 * s, cy - 44 * s, 90 * s, 66 * s, 14 * s, { fill:'paper' });
      P.rrect(cx - 36 * s, cy - 36 * s, 72 * s, 50 * s, 10 * s, { fill:'sky', gap:Math.max(3, 5 * s), w:1.3 });
      P.face(cx, cy - 11 * s, 56 * s, { mood:o.mood || 'smile' });
      P.rect(cx - 9 * s, cy + 22 * s, 18 * s, 10 * s, { w:1.6 });
      P.rrect(cx - 38 * s, cy + 32 * s, 76 * s, 24 * s, 10 * s, { fill:'accent', gap:Math.max(3, 6 * s), w:1.8 });
      [-20, -6, 8, 22].forEach(dx => P.line(cx + (dx - 4) * s, cy + 44 * s, cx + (dx + 4) * s, cy + 44 * s, { w:1.4, c:'ink', r:.4 }));
    },
    bubble(x, y, w, hh, tx, ty, o = {}){
      const fill = o.fill || 'paper';
      let b1, b2;
      if (ty > y + hh){ const bx = clamp(tx, x + 18, x + w - 18); b1 = [bx - 9, y + hh - 1]; b2 = [bx + 9, y + hh - 1]; }
      else if (ty < y){ const bx = clamp(tx, x + 18, x + w - 18); b1 = [bx - 9, y + 1]; b2 = [bx + 9, y + 1]; }
      else if (tx < x){ const by = clamp(ty, y + 12, y + hh - 12); b1 = [x + 1, by - 8]; b2 = [x + 1, by + 8]; }
      else { const by = clamp(ty, y + 12, y + hh - 12); b1 = [x + w - 1, by - 8]; b2 = [x + w - 1, by + 8]; }
      const tail = `M${b1[0]} ${b1[1]} L${tx} ${ty} L${b2[0]} ${b2[1]}`;
      P.rrect(x, y, w, hh, 14, { fill, fs:o.fs || 'solid', c:o.c || 'ink', w:o.w || 1.8 });
      P.path(tail + ' Z', { fill, fs:'solid', c:null, r:.4 });
      P.path(tail, { c:o.c || 'ink', w:o.w || 1.8 });
    },
    note(x, y, w, hh, o = {}){
      const f = Math.min(18, w * .2), fill = o.fill || 'paper';
      P.path(`M${x} ${y} L${x + w - f} ${y} L${x + w} ${y + f} L${x + w} ${y + hh} L${x} ${y + hh} Z`, { fill, fs:o.fs, gap:o.gap, c:o.c, w:o.w });
      P.path(`M${x + w - f} ${y} L${x + w - f} ${y + f} L${x + w} ${y + f}`, { c:o.c, w:(o.w || 2) * .8 });
    },
    sparkle(x, y, s = 8, c = 'hi'){
      P.path(`M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z`, { fill:c, fs:'solid', c:c === 'hi' ? 'warm' : c, w:1.1, r:.4 });
    },
    heart(x, y, s = 8, c = 'bad'){
      P.path(`M${x} ${y + s * .8} C${x - s * 1.4} ${y - s * .2} ${x - s * .6} ${y - s * 1.2} ${x} ${y - s * .4} C${x + s * .6} ${y - s * 1.2} ${x + s * 1.4} ${y - s * .2} ${x} ${y + s * .8} Z`, { fill:c, fs:'solid', c, w:1.1, r:.4 });
    },
    drop(x, y, s = 8){
      P.path(`M${x} ${y - s} Q${x + s * .9} ${y + s * .2} ${x} ${y + s * .9} Q${x - s * .9} ${y + s * .2} ${x} ${y - s} Z`, { fill:'sky', fs:'solid', c:'sky', w:1.1, r:.4 });
    },
    steam(x, y, s = 1, c = 'soft'){
      [-12, 0, 12].forEach(dx => { const X = x + dx * s;
        P.path(`M${X} ${y} Q${X - 6 * s} ${y - 8 * s} ${X} ${y - 16 * s} T${X} ${y - 32 * s}`, { c, w:1.8, r:.6 }); });
    },
  };
  return P;
}

/* 엔진 공용 그림 */
const GLOBAL_FIGS = {
  cookie:{ w:130, h:120, label:'작은 해(Solar)가 떠 있는 한입 베어 문 쿠키', draw(P){
    P.path('M105 60 A45 45 0 1 1 82.5 21 A13 13 0 0 0 92 42 A13 13 0 0 0 105 60 Z', { fill:'hi', w:2.4 });
    P.circle(112, 26, 6, { fill:'hi', fs:'solid', w:1.4 });
    P.circle(121, 40, 4, { fill:'hi', fs:'solid', w:1.2 });
    P.face(54, 72, 50, { mood:'happy' });
    // 작은 해: 동그라미 + 햇살 8개
    P.circle(40, 30, 20, { fill:'warm', fs:'solid', w:1.8 });
    for (let i = 0; i < 8; i++){ const a = i * Math.PI / 4; P.line(40 + Math.cos(a) * 14, 30 + Math.sin(a) * 14, 40 + Math.cos(a) * 20, 30 + Math.sin(a) * 20, { c:'warm', w:2.2 }); }
  }},
  yay:{ w:320, h:170, label:'한입 다 먹고 뿌듯한 쿠키와 반짝이', draw(P){
    P.circle(160, 92, 104, { fill:'hi', w:2.4 });
    P.face(160, 96, 70, { mood:'proud' });
    P.sparkle(66, 50, 12, 'hi'); P.sparkle(254, 44, 10, 'warm'); P.sparkle(270, 128, 8, 'accent'); P.sparkle(52, 130, 8, 'pink');
    P.heart(96, 30, 8, 'pink'); P.heart(228, 150, 7, 'bad');
    P.text(160, 164, '한입 꿀꺽!', { size:20, weight:700, c:'accent' });
  }},
};
function fig(name, unit){
  const src = unit || (S && S.u);
  const f = (src && src.figs && src.figs[name]) || GLOBAL_FIGS[name];
  if (!f) return null;
  const s = document.createElementNS(NS, 'svg');
  s.setAttribute('viewBox', `0 0 ${f.w} ${f.h}`); s.setAttribute('role', 'img'); s.setAttribute('aria-label', f.label);
  try { f.draw(Pen(s)); } catch (e) { console.error(e); }
  return h('div', { class:'fig' }, s);
}

