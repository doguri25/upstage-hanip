/* ============ 파이썬 연습장 실행기(초보자 범위) ============
   진짜 파이썬 대신 문법의 초보자 범위를 직접 해석한다. 오류 문구는 Python 3.12에 맞춘다.
   Web Worker 안에서 돌려서 끝나지 않는 반복은 밖에서 멈춘다. */
function __hanipPy(){
  class PyErr { constructor(type, msg, line, col){ this.type = type; this.msg = msg; this.line = line; this.col = col; } }
  class Brk {} class Cnt {} class Ret { constructor(v){ this.v = v; } }
  class PyFloat { constructor(v){ this.v = v; } }
  class PyList { constructor(a){ this.a = a || []; } }
  class PyTuple { constructor(a){ this.a = a || []; } }
  class PyView extends PyList { constructor(a, kind){ super(a); this.kind = kind; } }
  class PyDict { constructor(){ this.m = new Map(); }
    key(k){ return (typeof k === 'string' ? 's:' : k instanceof PyFloat ? 'n:' : typeof k === 'number' || typeof k === 'boolean' ? 'n:' : k === null ? 'z:' : k instanceof PyTuple ? 't:' : 'o:') + (k instanceof PyFloat ? k.v : k instanceof PyTuple ? k.a.map(x => repr(x)).join(',') : typeof k === 'boolean' ? +k : k); }
    get(k){ const e = this.m.get(this.key(k)); return e ? e[1] : undefined; }
    has(k){ return this.m.has(this.key(k)); }
    set(k, v){ const kk = this.key(k); const e = this.m.get(kk); if (e) e[1] = v; else this.m.set(kk, [k, v]); }
    del(k){ return this.m.delete(this.key(k)); }
    keys(){ return [...this.m.values()].map(e => e[0]); }
    vals(){ return [...this.m.values()].map(e => e[1]); }
    items(){ return [...this.m.values()]; }
    get size(){ return this.m.size; } }
  class PyRange { constructor(a, b, c){ this.start = a; this.stop = b; this.step = c; }
    list(){ const out = []; if (this.step > 0) for (let i = this.start; i < this.stop; i += this.step) out.push(i); else for (let i = this.start; i > this.stop; i += this.step) out.push(i); return out; } }
  class PyFunc { constructor(name, params, body, g, locals){ this.name = name; this.params = params; this.body = body; this.g = g; this.locals = locals; } }
  class Builtin { constructor(name, fn){ this.name = name; this.fn = fn; } }
  class Method { constructor(self, name, fn){ this.self = self; this.name = name; this.fn = fn; } }
  class Module { constructor(name, attrs){ this.name = name; this.attrs = attrs; } }
  class PyType { constructor(name, fn){ this.name = name; this.fn = fn; } }
  const F = v => new PyFloat(v);
  const isFloat = x => x instanceof PyFloat;
  const isNum = x => typeof x === 'number' || typeof x === 'boolean' || x instanceof PyFloat;
  const nv = x => (x instanceof PyFloat ? x.v : +x);
  const mk = (r, flt) => (flt ? F(r) : r);

  /* ---------- 글자 조각으로 나누기 ---------- */
  const OPS = ['**=', '//=', '...', '&&', '||', '==', '!=', '<=', '>=', '+=', '-=', '*=', '/=', '%=', '**', '//', '->', ':=', '+', '-', '*', '/', '%', '<', '>', '=', '(', ')', '[', ']', '{', '}', ',', ':', '.', ';', '@', '|', '&', '^', '~', '!'];
  const CLOSE = { ')':'(', ']':'[', '}':'{' };
  function tokenize(src){
    const toks = []; const indents = [0]; const alt = [0]; const stack = [];
    let pos = 0, line = 1, col0 = 0, atStart = true;
    const col = () => pos - col0;
    const push = (k, v, extra) => toks.push(Object.assign({ k, v, ln:line, col:col() }, extra || {}));
    while (pos < src.length){
      if (atStart && !stack.length){
        let ind = 0, ind1 = 0, p = pos; while (src[p] === ' ' || src[p] === '\t'){ ind += src[p] === '\t' ? 8 - (ind % 8) : 1; ind1++; p++; }
        if (p >= src.length) { pos = p; break; }
        if (src[p] === '\n'){ pos = p + 1; line++; col0 = pos; continue; }
        if (src[p] === '#'){ while (p < src.length && src[p] !== '\n') p++; pos = p; continue; }
        const cur = indents[indents.length - 1], cur1 = alt[alt.length - 1];
        if (Math.sign(ind - cur) !== Math.sign(ind1 - cur1)) throw new PyErr('TabError', 'inconsistent use of tabs and spaces in indentation', line, 0);
        pos = p;
        if (ind > cur){ indents.push(ind); alt.push(ind1); push('INDENT'); }
        else if (ind < cur){ while (ind < indents[indents.length - 1]){ indents.pop(); alt.pop(); push('DEDENT'); }
          if (ind !== indents[indents.length - 1]) throw new PyErr('IndentationError', 'unindent does not match any outer indentation level', line, ind); }
        atStart = false;
      }
      const c = src[pos];
      if (c === '\n'){ if (!stack.length){ push('NEWLINE'); atStart = true; } pos++; line++; col0 = pos; continue; }
      if (c === ' ' || c === '\t' || c === '\r'){ pos++; continue; }
      if (c === '#'){ while (pos < src.length && src[pos] !== '\n') pos++; continue; }
      if (c === '\\' && src[pos + 1] === '\n'){ pos += 2; line++; col0 = pos; continue; }
      const sm = /^([rRfF]{0,2})("""|'''|"|')/.exec(src.slice(pos, pos + 5));
      if (sm && (sm[1] === '' || /^[rRfF]+$/.test(sm[1]))){
        const pre = sm[1].toLowerCase(), q = sm[2], startLine = line, startCol = col();
        let p = pos + sm[0].length, s = '';
        for (;;){
          const kind = pre.includes('f') ? 'f-string' : 'string';
          if (p >= src.length) throw new PyErr('SyntaxError', q.length === 3 ? `unterminated triple-quoted ${kind} literal (detected at line ${line})` : `unterminated ${kind} literal (detected at line ${startLine})`, startLine, startCol);
          const ch = src[p];
          if (q.length === 1 && ch === '\n') throw new PyErr('SyntaxError', `unterminated ${kind} literal (detected at line ${startLine})`, startLine, startCol);
          if (src.startsWith(q, p)){ p += q.length; break; }
          if (ch === '\\' && !pre.includes('r')){ const n = src[p + 1];
            const map = { n:'\n', t:'\t', '\\':'\\', "'":"'", '"':'"', r:'\r', '0':'\0' };
            if (n === '\n'){ p += 2; line++; col0 = p; continue; }
            if (n in map){ s += map[n]; p += 2; continue; }
            if (n === 'u'){ s += String.fromCharCode(parseInt(src.slice(p + 2, p + 6), 16)); p += 6; continue; }
            s += '\\'; p++; continue; }
          if (ch === '\n'){ line++; col0 = p + 1; }
          s += ch; p++;
        }
        const tok = { k:'STR', v:s, ln:startLine, col:startCol, f:pre.includes('f') };
        pos = p; toks.push(tok); continue;
      }
      const nm = /^(\d[\d_]*\.?[\d_]*(?:[eE][+-]?\d+)?|\.\d[\d_]*(?:[eE][+-]?\d+)?)/.exec(src.slice(pos, pos + 40));
      if (nm){ const t = nm[1].replace(/_/g, ''); push('NUM', /[.eE]/.test(t) ? F(parseFloat(t)) : parseInt(t, 10)); pos += nm[1].length; continue; }
      const id = /^[A-Za-z_À-￿][\wÀ-￿]*/.exec(src.slice(pos, pos + 80));
      if (id && !/[‘’“”]/.test(id[0][0])){ push('NAME', id[0]); pos += id[0].length; continue; }
      const op = OPS.find(o => src.startsWith(o, pos));
      if (op){
        if ('([{'.includes(op)) stack.push({ ch:op, ln:line, col:col() });
        if (')]}'.includes(op)){
          if (!stack.length) throw new PyErr('SyntaxError', `unmatched '${op}'`, line, col());
          const top = stack.pop();
          if (top.ch !== CLOSE[op]) throw new PyErr('SyntaxError', `closing parenthesis '${op}' does not match opening parenthesis '${top.ch}'` + (top.ln !== line ? ` on line ${top.ln}` : ''), line, col());
        }
        push('OP', op); pos += op.length; continue;
      }
      const cp = c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
      if (c.codePointAt(0) < 128) throw new PyErr('SyntaxError', 'invalid syntax', line, col());
      throw new PyErr('SyntaxError', `invalid character '${c}' (U+${cp})`, line, col());
    }
    if (stack.length){ const t = stack[stack.length - 1]; throw new PyErr('SyntaxError', `'${t.ch}' was never closed`, t.ln, t.col); }
    if (toks.length && toks[toks.length - 1].k !== 'NEWLINE') push('NEWLINE');
    while (indents.length > 1){ indents.pop(); push('DEDENT'); }
    push('EOF');
    return toks;
  }

  /* ---------- 문장 나무로 짓기 ---------- */
  const KW = new Set(['False', 'None', 'True', 'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']);
  function parse(toks){
    let p = 0;
    const peek = (o = 0) => toks[p + o];
    const isOp = (v, o = 0) => { const t = toks[p + o]; return t && t.k === 'OP' && t.v === v; };
    const isKw = (v, o = 0) => { const t = toks[p + o]; return t && t.k === 'NAME' && t.v === v; };
    const bad = (t, msg) => { t = t || peek(); throw new PyErr('SyntaxError', msg || 'invalid syntax', t.ln, t.col); };
    const eatOp = v => { if (!isOp(v)) return null; return toks[p++]; };
    const needOp = (v, msg) => { if (!isOp(v)) bad(peek(), msg); return toks[p++]; };
    const needColon = () => { if (!isOp(':')){ const t = peek(); bad(t, t.k === 'OP' && ['&&', '||', '!', '&', '|', '^', '~'].includes(t.v) ? 'invalid syntax' : "expected ':'"); } p++; };

    function file(){ const body = []; while (peek().k !== 'EOF'){ if (peek().k === 'NEWLINE'){ p++; continue; }
        if (peek().k === 'INDENT') throw new PyErr('IndentationError', 'unexpected indent', peek().ln, peek().col);
        body.push(...stmt()); } return body; }
    function suite(kind, ln){
      if (peek().k === 'NEWLINE'){ p++;
        if (peek().k !== 'INDENT') throw new PyErr('IndentationError', `expected an indented block after ${kind} on line ${ln}`, peek().ln, peek().col);
        p++; const body = [];
        while (peek().k !== 'DEDENT' && peek().k !== 'EOF'){ if (peek().k === 'NEWLINE'){ p++; continue; }
          if (peek().k === 'INDENT') throw new PyErr('IndentationError', 'unexpected indent', peek().ln, peek().col);
          body.push(...stmt()); }
        if (peek().k === 'DEDENT') p++;
        return body; }
      return simple();
    }
    function stmt(){
      const t = peek();
      if (t.k === 'NAME'){
        if (t.v === 'if') return [ifStmt()];
        if (t.v === 'while'){ p++; const cond = condExpr(); needColon(); const body = suite(`'while' statement`, t.ln); let orelse = null;
          if (isKw('else') && isOp(':', 1)){ const et = peek(); p += 2; orelse = suite(`'else' statement`, et.ln); }
          return [{ n:'while', cond, body, orelse, ln:t.ln }]; }
        if (t.v === 'for'){ p++; const target = targetList(); if (!isKw('in')) bad(peek()); p++; const iter = testList(); needColon();
          const body = suite(`'for' statement`, t.ln); let orelse = null;
          if (isKw('else') && isOp(':', 1)){ const et = peek(); p += 2; orelse = suite(`'else' statement`, et.ln); }
          return [{ n:'for', target, iter, body, orelse, ln:t.ln }]; }
        if (t.v === 'def'){ p++; const name = peek(); if (name.k !== 'NAME') bad(name); p++; needOp('(', "expected '('"); const params = [];
          while (!isOp(')')){ const pn = peek(); if (pn.k !== 'NAME') bad(pn); p++; let def = null; if (eatOp('=')) def = test();
            if (!def && params.some(q => q.def)) throw new PyErr('SyntaxError', 'parameter without a default follows parameter with a default', pn.ln, pn.col);
            params.push({ name:pn.v, def }); if (!eatOp(',')) break; }
          needOp(')'); if (eatOp('->')) test(); needColon(); const body = suite(`function definition`, t.ln);
          return [{ n:'def', name:name.v, params, body, ln:t.ln }]; }
        if (t.v === 'try'){ p++; needColon(); const body = suite(`'try' statement`, t.ln); const handlers = []; let orelse = null, fin = null;
          while (isKw('except')){ const et = peek(); p++; let type = null, as = null;
            if (!isOp(':')){ type = test(); if (isKw('as')){ p++; as = peek().v; p++; } }
            needColon(); handlers.push({ type, as, body:suite(`'except' statement`, et.ln) }); }
          if (isKw('else')){ const et = peek(); p++; needColon(); orelse = suite(`'else' statement`, et.ln); }
          if (isKw('finally')){ const et = peek(); p++; needColon(); fin = suite(`'finally' statement`, et.ln); }
          if (!handlers.length && !fin) bad(peek(), "expected 'except' or 'finally' block");
          return [{ n:'try', body, handlers, orelse, fin, ln:t.ln }]; }
        if (t.v === 'class') bad(t, '연습장에서는 class를 쓸 수 없어요');
        if (t.v === 'else' || t.v === 'elif') bad(t);
      }
      return simple();
    }
    function ifStmt(){
      const t = peek(); p++; const cond = condExpr(); needColon();
      const body = suite(`'${t.v}' statement`, t.ln); let orelse = null;
      if (isKw('elif')) orelse = [ifStmt()];
      else if (isKw('else')){ const et = peek(); p++; needColon(); orelse = suite(`'else' statement`, et.ln); }
      return { n:'if', cond, body, orelse, ln:t.ln };
    }
    function condExpr(){ const e = test(); if (isOp('=')) bad(peek(), "invalid syntax. Maybe you meant '==' or ':=' instead of '='?"); return e; }
    function simple(){
      const out = [];
      for (;;){ out.push(small()); if (eatOp(';')){ if (peek().k === 'NEWLINE') break; continue; } break; }
      if (peek().k !== 'NEWLINE'){ const t = peek();
        if (out.length === 1 && out[0].n === 'expr' && out[0].e.n === 'name' && out[0].e.id === 'print' && (t.k === 'STR' || t.k === 'NAME' || t.k === 'NUM'))
          bad({ ln:out[0].ln, col:out[0].e.col }, "Missing parentheses in call to 'print'. Did you mean print(...)?");
        bad(t); }
      p++; return out;
    }
    function small(){
      const t = peek();
      if (t.k === 'NAME'){
        if (t.v === 'pass'){ p++; return { n:'pass', ln:t.ln }; }
        if (t.v === 'break'){ p++; return { n:'break', ln:t.ln }; }
        if (t.v === 'continue'){ p++; return { n:'continue', ln:t.ln }; }
        if (t.v === 'return'){ p++; const e = (peek().k === 'NEWLINE' || isOp(';')) ? null : testList(); return { n:'return', e, ln:t.ln }; }
        if (t.v === 'global' || t.v === 'nonlocal'){ p++; const names = []; do { names.push(peek().v); p++; } while (eatOp(',')); return { n:'global', names, ln:t.ln }; }
        if (t.v === 'import'){ p++; const names = []; do { const m = peek().v; p++; let as = m; if (isKw('as')){ p++; as = peek().v; p++; } names.push([m, as]); } while (eatOp(',')); return { n:'import', names, ln:t.ln }; }
        if (t.v === 'from'){ p++; const m = peek().v; p++; if (!isKw('import')) bad(peek()); p++; const names = [];
          if (eatOp('*')) names.push(['*', '*']); else do { const nm = peek().v; p++; let as = nm; if (isKw('as')){ p++; as = peek().v; p++; } names.push([nm, as]); } while (eatOp(','));
          return { n:'from', m, names, ln:t.ln }; }
        if (t.v === 'raise'){ p++; const e = peek().k === 'NEWLINE' ? null : test(); return { n:'raise', e, ln:t.ln }; }
        if (t.v === 'del'){ p++; const targets = [test()]; while (eatOp(',')) targets.push(test()); return { n:'del', targets, ln:t.ln }; }
        if (t.v === 'assert'){ p++; const e = test(); let msg = null; if (eatOp(',')) msg = test(); return { n:'assert', e, msg, ln:t.ln }; }
      }
      const e = testList();
      if (isOp('=')){ const targets = [e]; let val;
        while (eatOp('=')){ val = testList(); targets.push(val); }
        targets.pop(); targets.forEach(x => checkTarget(x, '='));
        return { n:'assign', targets, e:val, ln:t.ln }; }
      const aug = ['+=', '-=', '*=', '/=', '//=', '%=', '**='].find(o => isOp(o));
      if (aug){ p++; checkTarget(e, aug); if (e.n === 'tuple') bad(t, `'tuple' is an illegal expression for augmented assignment`); return { n:'aug', target:e, op:aug.slice(0, -1), e:testList(), ln:t.ln }; }
      return { n:'expr', e, ln:t.ln };
    }
    function checkTarget(x, op){
      if (x.n === 'name' || x.n === 'sub' || x.n === 'attr') return;
      if ((x.n === 'tuple' || x.n === 'list') && op === '='){ x.items.forEach(i => checkTarget(i, op)); return; }
      const what = x.n === 'call' ? 'function call' : x.n === 'const' ? 'literal' : x.n === 'bin' || x.n === 'unary' ? 'expression' : x.n === 'fstr' ? 'f-string expression' : 'expression';
      throw new PyErr('SyntaxError', `cannot assign to ${what} here. Maybe you meant '==' instead of '='?`, x.ln, x.col);
    }
    function targetList(){ const first = orExprNoIn(); if (!isOp(',')) return first; const items = [first]; while (eatOp(',')){ if (isKw('in')) break; items.push(orExprNoIn()); } return { n:'tuple', items, ln:first.ln, col:first.col }; }
    function orExprNoIn(){ return primaryExpr(); }
    function testList(){ const first = test(); if (!isOp(',')) return first; const items = [first];
      while (eatOp(',')){ if (peek().k === 'NEWLINE' || isOp('=') || isOp(')') || isOp(':') || isOp(';')) break; items.push(test()); }
      return { n:'tuple', items, ln:first.ln, col:first.col }; }
    function test(){
      if (isKw('lambda')){ const t = peek(); p++; const params = []; while (!isOp(':')){ params.push({ name:peek().v, def:null }); p++; if (!eatOp(',')) break; } needColon();
        const body = test(); return { n:'lambda', params, body, ln:t.ln, col:t.col }; }
      const e = orTest();
      if (isKw('if') && !isOp('=', 1)){ const save = p; p++; const cond = orTest(); if (isKw('else')){ p++; return { n:'ifexp', cond, a:e, b:test(), ln:e.ln, col:e.col }; } p = save; }
      return e;
    }
    function orTest(){ let l = andTest(); while (isKw('or')){ p++; l = { n:'bool', op:'or', l, r:andTest(), ln:l.ln, col:l.col }; } return l; }
    function andTest(){ let l = notTest(); while (isKw('and')){ p++; l = { n:'bool', op:'and', l, r:notTest(), ln:l.ln, col:l.col }; } return l; }
    function notTest(){ if (isKw('not')){ const t = peek(); p++; return { n:'not', e:notTest(), ln:t.ln, col:t.col }; } return comparison(); }
    function comparison(){
      const first = arith(); const ops = [], rest = [];
      for (;;){ let op = null;
        if (['<', '>', '==', '>=', '<=', '!='].some(o => isOp(o))){ op = peek().v; p++; }
        else if (isKw('in')){ op = 'in'; p++; }
        else if (isKw('not') && isKw('in', 1)){ op = 'not in'; p += 2; }
        else if (isKw('is')){ p++; if (isKw('not')){ p++; op = 'is not'; } else op = 'is'; }
        else break;
        ops.push(op); rest.push(arith()); }
      return ops.length ? { n:'cmp', first, ops, rest, ln:first.ln, col:first.col } : first;
    }
    function arith(){ let l = term(); while (isOp('+') || isOp('-')){ const op = toks[p++].v; l = { n:'bin', op, l, r:term(), ln:l.ln, col:l.col }; } return l; }
    function term(){ let l = factor(); while (isOp('*') || isOp('/') || isOp('//') || isOp('%')){ const op = toks[p++].v; l = { n:'bin', op, l, r:factor(), ln:l.ln, col:l.col }; } return l; }
    function factor(){ if (isOp('-') || isOp('+')){ const t = toks[p++]; return { n:'unary', op:t.v, e:factor(), ln:t.ln, col:t.col }; } return power(); }
    function power(){ const b = primaryExpr(); if (isOp('**')){ p++; return { n:'bin', op:'**', l:b, r:factor(), ln:b.ln, col:b.col }; } return b; }
    function primaryExpr(){
      let e = atom();
      for (;;){
        if (isOp('(')){ p++; const args = [], kwargs = [];
          while (!isOp(')')){
            if (peek().k === 'NAME' && isOp('=', 1)){ const k = peek().v; p += 2; kwargs.push([k, test()]); }
            else { if (kwargs.length) bad(peek(), 'positional argument follows keyword argument'); const a = test();
              if (isKw('for')){ args.push(compFor(a, 'gen')); } else args.push(a); }
            if (!eatOp(',')) break; }
          needOp(')'); e = { n:'call', f:e, args, kwargs, ln:e.ln, col:e.col }; continue; }
        if (isOp('[')){ p++; const idx = subscript(); needOp(']'); e = { n:'sub', e, idx, ln:e.ln, col:e.col }; continue; }
        if (isOp('.')){ p++; const nm = peek(); if (nm.k !== 'NAME') bad(nm); p++; e = { n:'attr', e, name:nm.v, ln:e.ln, col:e.col }; continue; }
        return e;
      }
    }
    function subscript(){
      let a = null, b = null, c = null;
      if (!isOp(':')) a = test();
      if (!isOp(':')) return a;
      p++; if (!isOp(']') && !isOp(':')) b = test();
      if (eatOp(':')){ if (!isOp(']')) c = test(); }
      return { n:'slice', a, b, c };
    }
    function compFor(elt, kind, val){
      const fors = [];
      while (isKw('for')){ p++; const target = targetList(); if (!isKw('in')) bad(peek()); p++; const iter = orTest(); const ifs = [];
        while (isKw('if')){ p++; ifs.push(orTest()); } fors.push({ target, iter, ifs }); }
      return { n:'comp', kind, elt, val, fors, ln:elt.ln, col:elt.col };
    }
    function atom(){
      const t = peek();
      if (t.k === 'NUM'){ p++; return { n:'const', v:t.v, ln:t.ln, col:t.col }; }
      if (isOp('...')){ p++; return { n:'const', v:null, ellipsis:true, ln:t.ln, col:t.col }; }
      if (t.k === 'STR'){ const parts = []; let any = false;
        while (peek().k === 'STR'){ const s = toks[p++]; if (s.f){ any = true; parts.push(...fparts(s)); } else parts.push({ s:s.v }); }
        if (!any) return { n:'const', v:parts.map(x => x.s).join(''), ln:t.ln, col:t.col };
        return { n:'fstr', parts, ln:t.ln, col:t.col }; }
      if (t.k === 'NAME'){
        if (t.v === 'True' || t.v === 'False'){ p++; return { n:'const', v:t.v === 'True', ln:t.ln, col:t.col }; }
        if (t.v === 'None'){ p++; return { n:'const', v:null, ln:t.ln, col:t.col }; }
        if (KW.has(t.v)) bad(t);
        p++; return { n:'name', id:t.v, ln:t.ln, col:t.col }; }
      if (isOp('(')){ p++; if (eatOp(')')) return { n:'tuple', items:[], ln:t.ln, col:t.col };
        const first = test(); if (isKw('for')){ const c = compFor(first, 'gen'); needOp(')'); return c; }
        if (eatOp(')')) return Object.assign({}, first, { paren:true });
        const items = [first]; while (eatOp(',')){ if (isOp(')')) break; items.push(test()); } needOp(')');
        return { n:'tuple', items, ln:t.ln, col:t.col }; }
      if (isOp('[')){ p++; const items = [];
        if (!isOp(']')){ const first = test(); if (isKw('for')){ const c = compFor(first, 'list'); needOp(']'); return c; }
          items.push(first); while (eatOp(',')){ if (isOp(']')) break; items.push(test()); } }
        needOp(']'); return { n:'list', items, ln:t.ln, col:t.col }; }
      if (isOp('{')){ p++; const keys = [], vals = [];
        if (eatOp('}')) return { n:'dict', keys, vals, ln:t.ln, col:t.col };
        const k0 = test();
        if (!isOp(':')){ const items = [k0]; if (isKw('for')){ const c = compFor(k0, 'set'); needOp('}'); return c; }
          while (eatOp(',')){ if (isOp('}')) break; items.push(test()); } needOp('}'); return { n:'set', items, ln:t.ln, col:t.col }; }
        p++; const v0 = test(); if (isKw('for')){ const c = compFor(k0, 'dict', v0); needOp('}'); return c; }
        keys.push(k0); vals.push(v0);
        while (eatOp(',')){ if (isOp('}')) break; keys.push(test()); needColon(); vals.push(test()); }
        needOp('}'); return { n:'dict', keys, vals, ln:t.ln, col:t.col }; }
      if (t.k === 'NEWLINE' || t.k === 'EOF') bad(t);
      if (t.k === 'INDENT') throw new PyErr('IndentationError', 'unexpected indent', t.ln, t.col);
      bad(t);
    }
    function fparts(s){
      const out = []; const str = s.v; let i = 0, buf = '';
      while (i < str.length){ const c = str[i];
        if (c === '{' && str[i + 1] === '{'){ buf += '{'; i += 2; continue; }
        if (c === '}' && str[i + 1] === '}'){ buf += '}'; i += 2; continue; }
        if (c === '{'){ if (buf){ out.push({ s:buf }); buf = ''; }
          let depth = 1, j = i + 1, q = null;
          while (j < str.length && depth){ const d = str[j]; if (q){ if (d === q) q = null; } else if (d === '"' || d === "'") q = d; else if ('([{'.includes(d)) depth++; else if (')]}'.includes(d)) depth--; j++; }
          if (depth) throw new PyErr('SyntaxError', "f-string: expecting '}'", s.ln, s.col);
          let inner = str.slice(i + 1, j - 1), spec = '', conv = '';
          let dd = 0, qq = null, cut = -1;
          for (let k = 0; k < inner.length; k++){ const d = inner[k]; if (qq){ if (d === qq) qq = null; continue; } if (d === '"' || d === "'"){ qq = d; continue; }
            if ('([{'.includes(d)) dd++; else if (')]}'.includes(d)) dd--; else if (d === ':' && !dd){ cut = k; break; } }
          if (cut >= 0){ spec = inner.slice(cut + 1); inner = inner.slice(0, cut); }
          let selfDoc = '';
          if (/!r\s*$/.test(inner)){ conv = 'r'; inner = inner.replace(/!r\s*$/, ''); }
          if (/=\s*$/.test(inner) && !/[=!<>]=\s*$/.test(inner)){ selfDoc = inner; inner = inner.replace(/=\s*$/, ''); }
          if (!inner.trim()) throw new PyErr('SyntaxError', "f-string: valid expression required before '}'", s.ln, s.col);
          const sub = parse(tokenize(inner.trim()));
          const fix = n => { if (!n || typeof n !== 'object') return; if (Array.isArray(n)){ n.forEach(fix); return; } if ('ln' in n) n.ln = s.ln; for (const k in n) if (n[k] && typeof n[k] === 'object') fix(n[k]); };
          fix(sub);
          if (sub.length !== 1 || sub[0].n !== 'expr') throw new PyErr('SyntaxError', 'f-string: invalid syntax', s.ln, s.col);
          if (selfDoc) out.push({ s:selfDoc });
          out.push({ e:sub[0].e, spec, conv:conv || (selfDoc && !spec ? 'r' : '') });
          i = j; continue; }
        if (c === '}') throw new PyErr('SyntaxError', "f-string: single '}' is not allowed", s.ln, s.col);
        buf += c; i++; }
      if (buf) out.push({ s:buf });
      return out;
    }
    return file();
  }

  /* ---------- 값 보여 주기 ---------- */
  const fmtFloat = v => {
    if (Number.isNaN(v)) return 'nan'; if (v === Infinity) return 'inf'; if (v === -Infinity) return '-inf';
    if (Number.isInteger(v) && Math.abs(v) < 1e16) return v.toFixed(1);
    let s = Math.abs(v) >= 1e16 || (v !== 0 && Math.abs(v) < 1e-4) ? v.toExponential() : String(v);
    s = s.replace(/e([+-])(\d)$/, 'e$10$2');
    return s.replace('e+', 'e+');
  };
  const strRepr = s => { const q = s.includes("'") && !s.includes('"') ? '"' : "'";
    return q + s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r').replace(q === "'" ? /'/g : /"/g, q === "'" ? "\\'" : '\\"') + q; };
  function repr(v){
    if (typeof v === 'string') return strRepr(v);
    return str(v, true);
  }
  function str(v, inner){
    if (v === null) return 'None';
    if (v === true) return 'True'; if (v === false) return 'False';
    if (typeof v === 'number') return String(v);
    if (typeof v === 'string') return v;
    if (v instanceof PyFloat) return fmtFloat(v.v);
    if (v instanceof PyView) return `${v.kind}([${v.a.map(repr).join(', ')}])`;
    if (v instanceof PyList) return `[${v.a.map(repr).join(', ')}]`;
    if (v instanceof PyTuple) return v.a.length === 1 ? `(${repr(v.a[0])},)` : `(${v.a.map(repr).join(', ')})`;
    if (v instanceof PyDict) return `{${v.items().map(([k, x]) => `${repr(k)}: ${repr(x)}`).join(', ')}}`;
    if (v instanceof PySet) return v.size ? `{${v.vals().map(repr).join(', ')}}` : 'set()';
    if (v instanceof PyRange) return v.step === 1 ? `range(${v.start}, ${v.stop})` : `range(${v.start}, ${v.stop}, ${v.step})`;
    if (v instanceof PyFunc) return `<function ${v.name} at 0x7f3a2c1b0e50>`;
    if (v instanceof Builtin) return `<built-in function ${v.name}>`;
    if (v instanceof Method) return `<built-in method ${v.name} of ${typeName(v.self)} object at 0x7f3a2c1b0e50>`;
    if (v instanceof Module) return `<module '${v.name}'>`;
    if (v instanceof PyType) return `<class '${v.name}'>`;
    if (v instanceof PyExc) return inner ? `${v.type}(${repr(v.msg)})` : v.msg;
    return String(v);
  }
  class PySet extends PyDict { add(k){ this.set(k, true); } }
  class PyExc { constructor(type, msg){ this.type = type; this.msg = msg; } }
  function typeName(v){
    if (v === null) return 'NoneType'; if (typeof v === 'boolean') return 'bool'; if (typeof v === 'number') return 'int';
    if (typeof v === 'string') return 'str'; if (v instanceof PyFloat) return 'float';
    if (v instanceof PyView) return v.kind; if (v instanceof PyList) return 'list'; if (v instanceof PyTuple) return 'tuple';
    if (v instanceof PySet) return 'set'; if (v instanceof PyDict) return 'dict'; if (v instanceof PyRange) return 'range';
    if (v instanceof PyFunc) return 'function'; if (v instanceof Builtin || v instanceof Method) return 'builtin_function_or_method';
    if (v instanceof Module) return 'module'; if (v instanceof PyType) return 'type'; if (v instanceof PyExc) return v.type;
    return 'object';
  }
  const truthy = v => !(v === null || v === false || v === 0 || v === '' || (v instanceof PyFloat && v.v === 0) ||
    (v instanceof PyList && !v.a.length) || (v instanceof PyTuple && !v.a.length) || (v instanceof PyDict && !v.size) || (v instanceof PyRange && !v.list().length));
  const E = (type, msg) => new PyErr(type, msg);

  /* ---------- 값 계산 ---------- */
  function iterList(v, what){
    if (v instanceof PyList || v instanceof PyTuple) return v.a.slice();
    if (typeof v === 'string') return [...v];
    if (v instanceof PyRange) return v.list();
    if (v instanceof PyDict) return v.keys();
    throw E('TypeError', `'${typeName(v)}' object is not iterable`);
  }
  function eq(a, b){
    if (isNum(a) && isNum(b)) return nv(a) === nv(b);
    if (typeof a === 'string' || typeof b === 'string') return a === b;
    if (a === null || b === null) return a === b;
    if (a instanceof PyType && b instanceof PyType) return a.name === b.name;
    if ((a instanceof PyList && b instanceof PyList && !(a instanceof PyView)) || (a instanceof PyTuple && b instanceof PyTuple))
      return a.a.length === b.a.length && a.a.every((x, i) => eq(x, b.a[i]));
    if (a instanceof PyDict && b instanceof PyDict) return a.size === b.size && a.items().every(([k, v]) => b.has(k) && eq(v, b.get(k)));
    return a === b;
  }
  function lt(a, b, op){
    if (isNum(a) && isNum(b)) return nv(a) < nv(b);
    if (typeof a === 'string' && typeof b === 'string') return a < b;
    if ((a instanceof PyList && b instanceof PyList) || (a instanceof PyTuple && b instanceof PyTuple)){
      for (let i = 0; i < Math.min(a.a.length, b.a.length); i++){ if (!eq(a.a[i], b.a[i])) return lt(a.a[i], b.a[i], op); }
      return a.a.length < b.a.length; }
    throw E('TypeError', `'${op}' not supported between instances of '${typeName(a)}' and '${typeName(b)}'`);
  }
  function contains(c, x){
    if (typeof c === 'string'){ if (typeof x !== 'string') throw E('TypeError', `'in <string>' requires string as left operand, not ${typeName(x)}`); return c.includes(x); }
    if (c instanceof PyDict) return c.has(x);
    if (c instanceof PyList || c instanceof PyTuple) return c.a.some(y => eq(x, y));
    if (c instanceof PyRange) return isNum(x) && c.list().includes(nv(x));
    throw E('TypeError', `argument of type '${typeName(c)}' is not iterable`);
  }
  function binop(op, a, b){
    const flt = isFloat(a) || isFloat(b);
    if (isNum(a) && isNum(b)){ const x = nv(a), y = nv(b);
      switch (op){
        case '+': return mk(x + y, flt); case '-': return mk(x - y, flt); case '*': return mk(x * y, flt);
        case '/': if (y === 0) throw E('ZeroDivisionError', flt ? 'float division by zero' : 'division by zero'); return F(x / y);
        case '//': if (y === 0) throw E('ZeroDivisionError', flt ? 'float floor division by zero' : 'integer division or modulo by zero'); return mk(Math.floor(x / y), flt);
        case '%': if (y === 0) throw E('ZeroDivisionError', flt ? 'float modulo' : 'integer modulo by zero'); return mk(((x % y) + y) % y, flt);
        case '**': { const r = Math.pow(x, y); return mk(r, flt || (y < 0)); } } }
    if (op === '+'){
      if (typeof a === 'string' && typeof b === 'string') return a + b;
      if (a instanceof PyList && b instanceof PyList) return new PyList(a.a.concat(b.a));
      if (a instanceof PyTuple && b instanceof PyTuple) return new PyTuple(a.a.concat(b.a));
      if (typeof a === 'string') throw E('TypeError', `can only concatenate str (not "${typeName(b)}") to str`);
      if (a instanceof PyList) throw E('TypeError', `can only concatenate list (not "${typeName(b)}") to list`);
    }
    if (op === '*'){
      const rep = (s, n) => { if (typeof n === 'boolean') n = +n; return n > 0 ? n : 0; };
      if (typeof a === 'string' && (typeof b === 'number' || typeof b === 'boolean')) return a.repeat(rep(a, b));
      if (typeof b === 'string' && (typeof a === 'number' || typeof a === 'boolean')) return b.repeat(rep(b, a));
      if (a instanceof PyList && typeof b === 'number'){ let r = []; for (let i = 0; i < b; i++) r = r.concat(a.a); return new PyList(r); }
      if (typeof a === 'string' || typeof b === 'string' || a instanceof PyList) throw E('TypeError', `can't multiply sequence by non-int of type '${typeName(typeof a === 'string' || a instanceof PyList ? b : a)}'`);
    }
    if (op === '%' && typeof a === 'string') return pctFormat(a, b);
    throw E('TypeError', `unsupported operand type(s) for ${op}: '${typeName(a)}' and '${typeName(b)}'`);
  }
  function pctFormat(s, args){
    const list = args instanceof PyTuple ? args.a.slice() : [args];
    return s.replace(/%(\.\d+)?([sdf%])/g, (m, prec, c) => { if (c === '%') return '%'; const v = list.shift();
      if (c === 's') return str(v); if (c === 'd') return String(Math.trunc(nv(v))); return nv(v).toFixed(prec ? +prec.slice(1) : 6); });
  }
  function formatSpec(v, spec){
    if (!spec) return str(v);
    const m = /^(?:(.)?([<>^=]))?([+\- ])?(0)?(\d+)?([,_])?(?:\.(\d+))?([sdfeg%xob])?$/.exec(spec);
    if (!m) throw E('ValueError', `Invalid format specifier '${spec}' for object of type '${typeName(v)}'`);
    let [, fill, align, sign, zero, width, group, prec, type] = m;
    let s;
    if (prec != null && !type && isNum(v) && !isFloat(v)) throw E('ValueError', 'Precision not allowed in integer format specifier');
    if (prec != null && !type && isFloat(v)){
      let g = v.v.toPrecision(Math.max(1, +prec));
      if (/e/.test(g)) g = g.replace(/\.?0+e/, 'e').replace(/e([+-])(\d)$/, 'e$10$2');
      else if (g.includes('.')) g = g.replace(/0+$/, '').replace(/\.$/, '.0'); else g += '.0';
      s = g;
    } else if (type === 'f' || type === '%'){
      if (!isNum(v)) throw E('ValueError', `Unknown format code '${type || 'f'}' for object of type '${typeName(v)}'`);
      let x = nv(v); if (type === '%') x *= 100;
      s = x.toFixed(prec != null ? +prec : 6);
      if (group){ const [i, d] = s.split('.'); s = i.replace(/\B(?=(\d{3})+(?!\d))/g, group) + (d != null ? '.' + d : ''); }
      if (type === '%') s += '%';
    } else if (type === 'd' || (group && isNum(v))){
      if (type === 'd' && (isFloat(v) || !isNum(v))) throw E('ValueError', `Unknown format code 'd' for object of type '${typeName(v)}'`);
      s = isFloat(v) ? fmtFloat(v.v) : String(nv(v));
      if (group){ const [i, d] = s.split('.'); s = i.replace(/\B(?=(\d{3})+(?!\d))/g, group) + (d != null ? '.' + d : ''); }
    } else if (type === 'x') s = nv(v).toString(16); else if (type === 'o') s = nv(v).toString(8); else if (type === 'b') s = nv(v).toString(2);
    else s = str(v);
    if (sign === '+' && isNum(v) && nv(v) >= 0) s = '+' + s;
    if (width && s.length < +width){ const w = +width;
      if (zero && !align){ const neg = s[0] === '-' || s[0] === '+'; const body = neg ? s.slice(1) : s; s = (neg ? s[0] : '') + body.padStart(w - (neg ? 1 : 0), '0'); }
      else { const f = fill || ' '; const a = align || (isNum(v) ? '>' : '<'); const padN = w - [...s].length;
        if (a === '<') s = s + f.repeat(padN); else if (a === '>') s = f.repeat(padN) + s; else { const l = Math.floor(padN / 2); s = f.repeat(l) + s + f.repeat(padN - l); } } }
    return s;
  }
  function index(c, i, loc){
    if (c instanceof PyDict){ if (!c.has(i)) throw E('KeyError', repr(i)); return c.get(i); }
    if (i && i.n === 'sliceval') return slice(c, i);
    if (c instanceof PyList || c instanceof PyTuple || typeof c === 'string'){
      if (!(typeof i === 'number' || typeof i === 'boolean')) throw E('TypeError', `${typeName(c) === 'str' ? 'string' : typeName(c)} indices must be integers${typeName(c) === 'str' ? '' : ' or slices'}, not ${typeName(i)}`);
      const arr = typeof c === 'string' ? [...c] : c.a; let k = +i; if (k < 0) k += arr.length;
      if (k < 0 || k >= arr.length) throw E('IndexError', `${typeName(c) === 'str' ? 'string' : typeName(c)} index out of range`);
      return arr[k]; }
    if (c instanceof PyRange){ const l = c.list(); let k = +i; if (k < 0) k += l.length; if (k < 0 || k >= l.length) throw E('IndexError', 'range object index out of range'); return l[k]; }
    throw E('TypeError', `'${typeName(c)}' object is not subscriptable`);
  }
  function slice(c, s){
    const arr = typeof c === 'string' ? [...c] : c instanceof PyRange ? c.list() : c.a; const n = arr.length;
    const step = s.c == null ? 1 : nv(s.c); if (step === 0) throw E('ValueError', 'slice step cannot be zero');
    const norm = (x, d) => { if (x == null) return d; x = nv(x); if (x < 0) x += n; return step > 0 ? Math.min(Math.max(x, 0), n) : Math.min(Math.max(x, -1), n - 1); };
    const a = norm(s.a, step > 0 ? 0 : n - 1), b = norm(s.b, step > 0 ? n : -1); const out = [];
    if (step > 0) for (let i = a; i < b; i += step) out.push(arr[i]); else for (let i = a; i > b; i += step) out.push(arr[i]);
    if (typeof c === 'string') return out.join(''); if (c instanceof PyTuple) return new PyTuple(out); return new PyList(out);
  }

  /* ---------- 실행 ---------- */
  let OUT, answers, frames, globals, outCount;
  const emit = s => { OUT(s); };
  /* 파이썬이 쓰는 것과 비슷한 '비슷한 이름' 거리: 넣기·빼기·바꾸기 2점, 대소문자만 다르면 1점 */
  const lev = (a, b) => { const d = Array.from({ length:a.length + 1 }, (_, i) => [i * 2]); for (let j = 1; j <= b.length; j++) d[0][j] = j * 2;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++){ const x = a[i - 1], y = b[j - 1];
      const sub = x === y ? 0 : x.toLowerCase() === y.toLowerCase() ? 1 : 2; d[i][j] = Math.min(d[i - 1][j] + 2, d[i][j - 1] + 2, d[i - 1][j - 1] + sub); } return d[a.length][b.length]; };
  const suggest = (name, pool) => { const c = [...new Set(pool)].filter(x => x !== name && !x.startsWith('_')).map(x => [x, lev(name, x)])
      .filter(([x, d]) => d <= Math.floor((name.length + x.length + 3) * 2 / 6)).sort((a, b) => a[1] - b[1]); return c.length ? `. Did you mean: '${c[0][0]}'?` : ''; };
  const METHODS = {
    str:{
      upper:s => s.toUpperCase(), lower:s => s.toLowerCase(), strip:(s, c) => c == null ? s.trim() : s.replace(new RegExp(`^[${esc(c)}]+|[${esc(c)}]+$`, 'g'), ''),
      lstrip:(s, c) => c == null ? s.replace(/^\s+/, '') : s.replace(new RegExp(`^[${esc(c)}]+`), ''), rstrip:(s, c) => c == null ? s.replace(/\s+$/, '') : s.replace(new RegExp(`[${esc(c)}]+$`), ''),
      split:(s, sep, max) => { let parts; if (sep == null) parts = s.trim() ? s.trim().split(/\s+/) : []; else { if (sep === '') throw E('ValueError', 'empty separator'); parts = s.split(sep); }
        if (max != null && max >= 0 && parts.length > max + 1){ const head = parts.slice(0, max); const rest = parts.slice(max).join(sep == null ? ' ' : sep); parts = head.concat([rest]); } return new PyList(parts); },
      join:(s, it) => { const l = iterList(it); l.forEach((x, i) => { if (typeof x !== 'string') throw E('TypeError', `sequence item ${i}: expected str instance, ${typeName(x)} found`); }); return l.join(s); },
      replace:(s, a, b, n) => { if (n == null) return s.split(a).join(b); let r = s; for (let i = 0; i < n; i++) r = r.replace(a, b); return r; },
      find:(s, x) => s.indexOf(x), index:(s, x) => { const i = s.indexOf(x); if (i < 0) throw E('ValueError', 'substring not found'); return i; },
      count:(s, x) => x === '' ? s.length + 1 : s.split(x).length - 1, startswith:(s, x) => s.startsWith(x), endswith:(s, x) => s.endsWith(x),
      isdigit:s => /^\d+$/.test(s), isalpha:s => /^[\p{L}]+$/u.test(s), isalnum:s => /^[\p{L}\d]+$/u.test(s), isupper:s => /[A-Z]/.test(s) && s === s.toUpperCase(), islower:s => /[a-z]/.test(s) && s === s.toLowerCase(), isspace:s => /^\s+$/.test(s),
      capitalize:s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(), title:s => s.toLowerCase().replace(/(^|[^a-zA-Z])([a-z])/g, (m, a, b) => a + b.toUpperCase()),
      zfill:(s, w) => s.padStart(w, '0'), center:(s, w, f = ' ') => { const n = w - s.length; if (n <= 0) return s; const l = Math.floor(n / 2) + (n % 2 && s.length % 2 ? 1 : 0); return f.repeat(n - l < 0 ? 0 : l) + s + f.repeat(n - l); },
      ljust:(s, w, f = ' ') => s.padEnd(w, f), rjust:(s, w, f = ' ') => s.padStart(w, f), swapcase:s => [...s].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
      format:(s, ...args) => strFormat(s, args, {}),
    },
    list:{
      append:(l, x) => { l.a.push(x); return null; }, extend:(l, it) => { l.a.push(...iterList(it)); return null; },
      insert:(l, i, x) => { let k = nv(i); if (k < 0) k = Math.max(0, k + l.a.length); l.a.splice(k, 0, x); return null; },
      pop:(l, i) => { if (!l.a.length) throw E('IndexError', 'pop from empty list'); let k = i == null ? l.a.length - 1 : nv(i); if (k < 0) k += l.a.length; if (k < 0 || k >= l.a.length) throw E('IndexError', 'pop index out of range'); return l.a.splice(k, 1)[0]; },
      remove:(l, x) => { const k = l.a.findIndex(y => eq(x, y)); if (k < 0) throw E('ValueError', 'list.remove(x): x not in list'); l.a.splice(k, 1); return null; },
      index:(l, x) => { const k = l.a.findIndex(y => eq(x, y)); if (k < 0) throw E('ValueError', `${repr(x)} is not in list`); return k; },
      count:(l, x) => l.a.filter(y => eq(x, y)).length, reverse:l => { l.a.reverse(); return null; }, clear:l => { l.a.length = 0; return null; }, copy:l => new PyList(l.a.slice()),
      sort:(l, kw) => { sortArr(l.a, kw); return null; },
    },
    dict:{
      keys:d => new PyView(d.keys(), 'dict_keys'), values:d => new PyView(d.vals(), 'dict_values'), items:d => new PyView(d.items().map(([k, v]) => new PyTuple([k, v])), 'dict_items'),
      get:(d, k, def = null) => (d.has(k) ? d.get(k) : def), pop:(d, k, def) => { if (d.has(k)){ const v = d.get(k); d.del(k); return v; } if (def !== undefined) return def; throw E('KeyError', repr(k)); },
      update:(d, o) => { if (o instanceof PyDict) o.items().forEach(([k, v]) => d.set(k, v)); return null; }, setdefault:(d, k, def = null) => { if (!d.has(k)) d.set(k, def); return d.get(k); },
      clear:d => { d.m.clear(); return null; }, copy:d => { const n = new PyDict(); d.items().forEach(([k, v]) => n.set(k, v)); return n; },
    },
    tuple:{ count:(t, x) => t.a.filter(y => eq(x, y)).length, index:(t, x) => { const k = t.a.findIndex(y => eq(x, y)); if (k < 0) throw E('ValueError', 'tuple.index(x): x not in tuple'); return k; } },
    set:{ add:(s, x) => { s.add(x); return null; }, remove:(s, x) => { if (!s.del(x)) throw E('KeyError', repr(x)); return null; }, discard:(s, x) => { s.del(x); return null; } },
  };
  function esc(s){ return String(s).replace(/[\]\\^-]/g, '\\$&'); }
  function sortArr(arr, kw){
    const key = kw && kw.key ? kw.key : null, rev = kw && kw.reverse ? truthy(kw.reverse) : false;
    const keyed = arr.map(x => [key ? callValue(key, [x], {}) : x, x]);
    keyed.sort((p, q) => (lt(p[0], q[0], '<') ? -1 : lt(q[0], p[0], '<') ? 1 : 0));
    if (rev) keyed.reverse();
    arr.splice(0, arr.length, ...keyed.map(k => k[1]));
  }
  function strFormat(s, args, kw){
    let auto = 0;
    return s.replace(/\{\{|\}\}|\{([^{}:!]*)(?:!r)?(?::([^{}]*))?\}/g, (m, name, spec) => {
      if (m === '{{') return '{'; if (m === '}}') return '}';
      let v; if (name === '' || name == null) v = args[auto++]; else if (/^\d+$/.test(name)) v = args[+name]; else v = kw[name];
      if (v === undefined) throw E('IndexError', `Replacement index ${auto - 1} out of range for positional args tuple`);
      return formatSpec(v, spec || ''); });
  }
  function getAttr(o, name){
    if (o instanceof Module){ if (name in o.attrs) return o.attrs[name]; throw E('AttributeError', `module '${o.name}' has no attribute '${name}'${suggest(name, Object.keys(o.attrs))}`); }
    if (o instanceof PyExc && name === 'args') return new PyTuple([o.msg]);
    const t = typeName(o); const tbl = METHODS[t === 'dict_keys' || t === 'dict_values' || t === 'dict_items' ? 'none' : t] || {};
    if (name in tbl) return new Method(o, name, tbl[name]);
    throw E('AttributeError', `'${t}' object has no attribute '${name}'${suggest(name, Object.keys(tbl))}`);
  }
  function toInt(v, base){
    if (typeof v === 'number') return v; if (typeof v === 'boolean') return +v; if (v instanceof PyFloat) return Math.trunc(v.v);
    if (typeof v === 'string'){ const s = v.trim().replace(/_/g, ''); const b = base == null ? 10 : nv(base);
      const ok = b === 10 ? /^[+-]?\d+$/.test(s) : b === 16 ? /^[+-]?[0-9a-fA-F]+$/.test(s) : b === 2 ? /^[+-]?[01]+$/.test(s) : /^[+-]?\w+$/.test(s);
      if (!ok) throw E('ValueError', `invalid literal for int() with base ${b}: ${strRepr(v)}`); return parseInt(s, b); }
    throw E('TypeError', `int() argument must be a string, a bytes-like object or a real number, not '${typeName(v)}'`);
  }
  function toFloat(v){
    if (isNum(v)) return F(nv(v));
    if (typeof v === 'string'){ const s = v.trim(); if (/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(s)) return F(parseFloat(s));
      if (/^[+-]?(inf|infinity)$/i.test(s)) return F(s[0] === '-' ? -Infinity : Infinity); if (/^nan$/i.test(s)) return F(NaN);
      throw E('ValueError', `could not convert string to float: ${strRepr(v)}`); }
    throw E('TypeError', `float() argument must be a string or a real number, not '${typeName(v)}'`);
  }
  /* 파이썬 round: 실제 2진수 값 기준으로 반올림하고, 정확히 가운데면 짝수 쪽으로 */
  function roundHalfEven(x, n){
    n = n || 0;
    if (!isFinite(x)) return x;
    if (n < 0){ const m = Math.pow(10, -n); return roundHalfEven(x / m, 0) * m; }
    const exact = Math.abs(x).toFixed(Math.min(100, n + 30));
    const tie = new RegExp(`^\\d+\\.\\d{${n}}50*$`).test(exact) || (n === 0 && /^\d+\.50*$/.test(exact));
    if (!tie) return +x.toFixed(n);
    const m = Math.pow(10, n); const f = Math.floor(Math.abs(x) * m); const r = (f % 2 === 0 ? f : f + 1) / m;
    return x < 0 ? -r : r;
  }
  let rngSeed = null;
  const rand = () => { if (rngSeed == null) return Math.random(); rngSeed = (rngSeed * 1103515245 + 12345) % 2147483648; return rngSeed / 2147483648; };
  function makeBuiltins(){
    const B = {};
    const def = (name, fn) => { B[name] = new Builtin(name, fn); };
    const typ = (name, fn) => { B[name] = new PyType(name, fn); };
    def('print', (args, kw) => { const sep = kw.sep == null ? ' ' : str(kw.sep), end = kw.end == null ? '\n' : str(kw.end); emit(args.map(x => str(x)).join(sep) + end); return null; });
    def('input', args => { const q = args.length ? str(args[0]) : ''; const a = answers.length ? answers.shift() : null;
      if (a === null){ emit(q + '\n'); throw E('EOFError', 'EOF when reading a line'); }
      emit(q + a + '\n'); return a; });
    def('len', args => { const v = args[0];
      if (typeof v === 'string') return [...v].length; if (v instanceof PyList || v instanceof PyTuple) return v.a.length; if (v instanceof PyDict) return v.size; if (v instanceof PyRange) return v.list().length;
      throw E('TypeError', `object of type '${typeName(v)}' has no len()`); });
    typ('int', (args, kw) => (args.length ? toInt(args[0], args[1] ?? kw.base) : 0));
    typ('float', args => (args.length ? toFloat(args[0]) : F(0)));
    typ('str', args => (args.length ? str(args[0]) : ''));
    typ('bool', args => (args.length ? truthy(args[0]) : false));
    typ('list', args => new PyList(args.length ? iterList(args[0]) : []));
    typ('tuple', args => new PyTuple(args.length ? iterList(args[0]) : []));
    typ('dict', (args, kw) => { const d = new PyDict(); if (args.length){ if (args[0] instanceof PyDict) args[0].items().forEach(([k, v]) => d.set(k, v)); else iterList(args[0]).forEach(p => { const a = iterList(p); d.set(a[0], a[1]); }); }
      for (const k in kw) d.set(k, kw[k]); return d; });
    typ('set', args => { const s = new PySet(); if (args.length) iterList(args[0]).forEach(x => s.add(x)); return s; });
    def('range', args => { const a = args.map(x => { if (!(typeof x === 'number' || typeof x === 'boolean')) throw E('TypeError', `'${typeName(x)}' object cannot be interpreted as an integer`); return +x; });
      if (a.length === 1) return new PyRange(0, a[0], 1); if (a.length === 2) return new PyRange(a[0], a[1], 1);
      if (a[2] === 0) throw E('ValueError', 'range() arg 3 must not be zero'); return new PyRange(a[0], a[1], a[2]); });
    def('sum', args => { let s = args[1] ?? 0; for (const x of iterList(args[0])) s = binop('+', s, x); return s; });
    const mm = (name, better) => def(name, (args, kw) => { const list = args.length === 1 ? iterList(args[0]) : args;
      if (!list.length){ if (kw.default !== undefined) return kw.default; throw E('ValueError', `${name}() iterable argument is empty`); }
      let best = list[0], bk = kw.key ? callValue(kw.key, [best], {}) : best;
      for (const x of list.slice(1)){ const k = kw.key ? callValue(kw.key, [x], {}) : x; if (better(k, bk)){ best = x; bk = k; } } return best; });
    mm('max', (a, b) => lt(b, a, '>')); mm('min', (a, b) => lt(a, b, '<'));
    def('sorted', (args, kw) => { const a = iterList(args[0]); sortArr(a, kw); return new PyList(a); });
    def('reversed', args => new PyList(iterList(args[0]).reverse()));
    def('enumerate', (args, kw) => { const s = args[1] ?? kw.start ?? 0; return new PyList(iterList(args[0]).map((x, i) => new PyTuple([i + s, x]))); });
    def('zip', args => { const ls = args.map(a => iterList(a)); const n = Math.min(...ls.map(l => l.length)); const out = []; for (let i = 0; i < n; i++) out.push(new PyTuple(ls.map(l => l[i]))); return new PyList(out); });
    def('abs', args => { const v = args[0]; if (!isNum(v)) throw E('TypeError', `bad operand type for abs(): '${typeName(v)}'`); return mk(Math.abs(nv(v)), isFloat(v)); });
    def('round', args => { const v = nv(args[0]); if (args.length < 2 || args[1] === null) return roundHalfEven(v, 0); return F(roundHalfEven(v, nv(args[1]))); });
    def('type', args => new PyType(typeName(args[0])));
    def('isinstance', args => { const t = args[1]; const ts = t instanceof PyTuple ? t.a : [t]; const n = typeName(args[0]); return ts.some(x => x instanceof PyType && (x.name === n || (x.name === 'int' && n === 'bool'))); });
    def('chr', args => String.fromCodePoint(nv(args[0]))); def('ord', args => args[0].codePointAt(0));
    def('any', args => iterList(args[0]).some(truthy)); def('all', args => iterList(args[0]).every(truthy));
    def('map', args => new PyList(iterList(args[1]).map(x => callValue(args[0], [x], {}))));
    def('filter', args => new PyList(iterList(args[1]).filter(x => truthy(args[0] === null ? x : callValue(args[0], [x], {})))));
    def('divmod', args => new PyTuple([binop('//', args[0], args[1]), binop('%', args[0], args[1])]));
    def('pow', args => binop('**', args[0], args[1]));
    def('format', args => formatSpec(args[0], args[1] ? str(args[1]) : ''));
    def('repr', args => repr(args[0]));
    def('hex', args => (nv(args[0]) < 0 ? '-0x' : '0x') + Math.abs(nv(args[0])).toString(16));
    def('bin', args => (nv(args[0]) < 0 ? '-0b' : '0b') + Math.abs(nv(args[0])).toString(2));
    def('id', () => 140234567890000 + Math.floor(Math.random() * 100000));
    def('open', () => { throw E('OSError', '연습장에서는 파일을 열 수 없어요(진짜 컴퓨터의 파이썬에서 해 봐요)'); });
    def('help', () => { emit('(연습장에서는 help를 볼 수 없어요)\n'); return null; });
    def('exit', () => { throw new ExitSignal(); }); B.quit = B.exit;
    ['Exception', 'ValueError', 'TypeError', 'KeyError', 'IndexError', 'ZeroDivisionError', 'NameError', 'AttributeError', 'RuntimeError', 'EOFError'].forEach(n => { B[n] = new PyType(n, args => new PyExc(n, args.length ? str(args[0]) : '')); });
    return B;
  }
  class ExitSignal {}
  /* json.dumps / json.loads: 파이썬과 같은 글자·오류 문구 */
  function jsonStr(x, ascii){ let q = JSON.stringify(x); if (ascii) q = q.replace(/[\u0080-￿]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')); return q; }
  function jsonDumps(v, kw){
    const ascii = kw.ensure_ascii == null ? true : truthy(kw.ensure_ascii), sortKeys = kw.sort_keys != null && truthy(kw.sort_keys);
    const ind = kw.indent == null ? null : (typeof kw.indent === 'string' ? kw.indent : ' '.repeat(Math.max(0, nv(kw.indent))));
    const keyStr = k => { if (typeof k === 'string') return k; if (k === null) return 'null'; if (k === true) return 'true'; if (k === false) return 'false';
      if (typeof k === 'number') return String(k); if (k instanceof PyFloat) return jsonNum(k.v);
      throw E('TypeError', `keys must be str, int, float, bool or None, not ${typeName(k)}`); };
    const jsonNum = n => (Number.isNaN(n) ? 'NaN' : n === Infinity ? 'Infinity' : n === -Infinity ? '-Infinity' : fmtFloat(n));
    const go = (x, depth) => {
      if (x === null) return 'null'; if (x === true) return 'true'; if (x === false) return 'false';
      if (typeof x === 'number') return String(x); if (x instanceof PyFloat) return jsonNum(x.v);
      if (typeof x === 'string') return jsonStr(x, ascii);
      const nl = ind == null ? '' : '\n' + ind.repeat(depth + 1), end = ind == null ? '' : '\n' + ind.repeat(depth), sep = ind == null ? ', ' : ',';
      if (x instanceof PyList || x instanceof PyTuple){ if (!x.a.length) return '[]'; return '[' + x.a.map(y => nl + go(y, depth + 1)).join(sep) + end + ']'; }
      if (x instanceof PyDict && !(x instanceof PySet)){ let it = x.items().map(([k, y]) => [keyStr(k), y]); if (!it.length) return '{}';
        if (sortKeys) it = it.sort((p, q) => (p[0] < q[0] ? -1 : p[0] > q[0] ? 1 : 0));
        return '{' + it.map(([k, y]) => nl + jsonStr(k, ascii) + ': ' + go(y, depth + 1)).join(sep) + end + '}'; }
      throw E('TypeError', `Object of type ${typeName(x)} is not JSON serializable`);
    };
    return go(v, 0);
  }
  function jsonLoads(src){
    if (typeof src !== 'string') throw E('TypeError', `the JSON object must be str, bytes or bytearray, not ${typeName(src)}`);
    let i = 0;
    const fail = (msg, at) => { const before = src.slice(0, at), ln = before.split('\n').length, col = at - before.lastIndexOf('\n');
      throw E('json.decoder.JSONDecodeError', `${msg}: line ${ln} column ${col} (char ${at})`); };
    const ws = () => { while (i < src.length && ' \t\n\r'.includes(src[i])) i++; };
    const strAt = () => { const start = i; i++; let out = '';
      for (;;){ if (i >= src.length) fail('Unterminated string starting at', start);
        const c = src[i];
        if (c === '"'){ i++; return out; }
        if (c === '\\'){ const n = src[i + 1];
          const map = { '"':'"', '\\':'\\', '/':'/', b:'\b', f:'\f', n:'\n', r:'\r', t:'\t' };
          if (n in map){ out += map[n]; i += 2; continue; }
          if (n === 'u' && /^[0-9a-fA-F]{4}$/.test(src.slice(i + 2, i + 6))){ out += String.fromCharCode(parseInt(src.slice(i + 2, i + 6), 16)); i += 6; continue; }
          if (n === 'u') fail('Invalid \\uXXXX escape', i + 1);
          fail('Invalid \\escape', i); }
        if (c < ' ') fail('Invalid control character at', i);
        out += c; i++; } };
    const val = () => {
      ws(); const c = src[i];
      if (c === '"') return strAt();
      if (c === '{'){ i++; const d = new PyDict(); ws();
        if (src[i] === '}'){ i++; return d; }
        for (;;){ ws(); if (src[i] !== '"') fail('Expecting property name enclosed in double quotes', i);
          const k = strAt(); ws(); if (src[i] !== ':') fail("Expecting ':' delimiter", i); i++;
          d.set(k, val()); ws();
          if (src[i] === '}'){ i++; return d; }
          if (src[i] !== ',') fail("Expecting ',' delimiter", i);
          const comma = i; i++; ws(); if (src[i] === '}') fail('Illegal trailing comma before end of object', comma); } }
      if (c === '['){ i++; const l = []; ws();
        if (src[i] === ']'){ i++; return new PyList(l); }
        for (;;){ l.push(val()); ws();
          if (src[i] === ']'){ i++; return new PyList(l); }
          if (src[i] !== ',') fail("Expecting ',' delimiter", i);
          const comma = i; i++; ws(); if (src[i] === ']') fail('Illegal trailing comma before end of array', comma); } }
      const words = { true:true, false:false, null:null, NaN:F(NaN), Infinity:F(Infinity), '-Infinity':F(-Infinity) };
      for (const w in words) if (src.startsWith(w, i)){ i += w.length; return words[w]; }
      const m = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/.exec(src.slice(i));
      if (m){ i += m[0].length; return m[2] || m[3] ? F(parseFloat(m[0])) : (Math.abs(parseInt(m[0], 10)) <= Number.MAX_SAFE_INTEGER ? parseInt(m[0], 10) : F(parseFloat(m[0]))); }
      fail('Expecting value', i);
    };
    const v = val(); ws(); if (i < src.length) fail('Extra data', i);
    return v;
  }
  const MODULES = {
    random:() => new Module('random', { randint:new Builtin('randint', a => nv(a[0]) + Math.floor(rand() * (nv(a[1]) - nv(a[0]) + 1))),
      choice:new Builtin('choice', a => { const l = iterList(a[0]); if (!l.length) throw E('IndexError', 'Cannot choose from an empty sequence'); return l[Math.floor(rand() * l.length)]; }),
      random:new Builtin('random', () => F(rand())), shuffle:new Builtin('shuffle', a => { const l = a[0].a; for (let i = l.length - 1; i > 0; i--){ const j = Math.floor(rand() * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; } return null; }),
      sample:new Builtin('sample', a => { const l = iterList(a[0]).slice(); for (let i = l.length - 1; i > 0; i--){ const j = Math.floor(rand() * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; } return new PyList(l.slice(0, nv(a[1]))); }),
      seed:new Builtin('seed', a => { rngSeed = a.length ? Math.abs(Math.floor(nv(a[0]))) % 2147483648 : null; return null; }) }),
    math:() => new Module('math', { pi:F(Math.PI), e:F(Math.E), sqrt:new Builtin('sqrt', a => { if (nv(a[0]) < 0) throw E('ValueError', 'math domain error'); return F(Math.sqrt(nv(a[0]))); }),
      floor:new Builtin('floor', a => Math.floor(nv(a[0]))), ceil:new Builtin('ceil', a => Math.ceil(nv(a[0]))), pow:new Builtin('pow', a => F(Math.pow(nv(a[0]), nv(a[1])))),
      fabs:new Builtin('fabs', a => F(Math.abs(nv(a[0])))), trunc:new Builtin('trunc', a => Math.trunc(nv(a[0]))),
      exp:new Builtin('exp', a => { const v = Math.exp(nv(a[0])); if (!isFinite(v)) throw E('OverflowError', 'math range error'); return F(v); }),
      log:new Builtin('log', a => { const x = nv(a[0]); if (x <= 0) throw E('ValueError', 'math domain error'); return F(a.length > 1 ? Math.log(x) / Math.log(nv(a[1])) : Math.log(x)); }),
      log10:new Builtin('log10', a => { const x = nv(a[0]); if (x <= 0) throw E('ValueError', 'math domain error'); return F(Math.log10(x)); }),
      log2:new Builtin('log2', a => { const x = nv(a[0]); if (x <= 0) throw E('ValueError', 'math domain error'); return F(Math.log2(x)); }),
      isclose:new Builtin('isclose', (a, kw) => { const x = nv(a[0]), y = nv(a[1]), rt = kw && kw.rel_tol != null ? nv(kw.rel_tol) : 1e-9, at = kw && kw.abs_tol != null ? nv(kw.abs_tol) : 0; return Math.abs(x - y) <= Math.max(rt * Math.max(Math.abs(x), Math.abs(y)), at); }),
      inf:F(Infinity) }),
    json:() => new Module('json', { dumps:new Builtin('dumps', (a, kw) => jsonDumps(a[0], kw || {})), loads:new Builtin('loads', a => jsonLoads(a[0])),
      JSONDecodeError:new PyType('JSONDecodeError', args => new PyExc('json.decoder.JSONDecodeError', args.length ? str(args[0]) : '')) }),
    time:() => new Module('time', { sleep:new Builtin('sleep', () => null), time:new Builtin('time', () => F(Date.now() / 1000)) }),
  };

  function lookup(name, frame, node){
    if (frame.locals){
      if (name in frame.locals) return frame.locals[name];
      if (frame.localNames && frame.localNames.has(name) && !(frame.globalNames && frame.globalNames.has(name)))
        throw new PyErr('UnboundLocalError', `cannot access local variable '${name}' where it is not associated with a value`, node.ln);
      if (frame.closure && name in frame.closure) return frame.closure[name];
    }
    if (name in globals) return globals[name];
    if (name in BUILTINS) return BUILTINS[name];
    const pool = Object.keys(frame.locals || {}).concat(Object.keys(globals), Object.keys(BUILTINS), ['True', 'False', 'None']);
    const STD = ['math', 'random', 'time', 'os', 'sys', 'json', 'csv', 'datetime', 're', 'string', 'collections', 'itertools', 'statistics'];
    const hint = STD.includes(name) ? `. Did you forget to import '${name}'?` : suggest(name, pool);
    throw new PyErr('NameError', `name '${name}' is not defined${hint}`, node.ln);
  }
  function assignName(name, v, frame){ if (frame.locals && !(frame.globalNames && frame.globalNames.has(name))) frame.locals[name] = v; else globals[name] = v; }
  function assign(t, v, frame){
    if (t.n === 'name') return assignName(t.id, v, frame);
    if (t.n === 'tuple' || t.n === 'list'){ const vals = iterList(v);
      if (vals.length !== t.items.length) throw E('ValueError', vals.length > t.items.length ? `too many values to unpack (expected ${t.items.length})` : `not enough values to unpack (expected ${t.items.length}, got ${vals.length})`);
      t.items.forEach((x, i) => assign(x, vals[i], frame)); return; }
    if (t.n === 'sub'){ const c = ev(t.e, frame); const i = t.idx && t.idx.n === 'slice' ? null : ev(t.idx, frame);
      if (c instanceof PyDict) return c.set(i, v);
      if (c instanceof PyList){ let k = nv(i); if (k < 0) k += c.a.length; if (k < 0 || k >= c.a.length) throw E('IndexError', 'list assignment index out of range'); c.a[k] = v; return; }
      throw E('TypeError', `'${typeName(c)}' object does not support item assignment`); }
    if (t.n === 'attr') throw E('AttributeError', `'${typeName(ev(t.e, frame))}' object attribute '${t.name}' is read-only`);
  }
  function callValue(f, args, kw, node){
    if (f instanceof Builtin || f instanceof PyType){ if (!f.fn) throw E('TypeError', `cannot create '${f.name}' instances`); return f.fn(args, kw); }
    if (f instanceof Method){ if (f.name === 'sort') return f.fn(f.self, kw); if (f.name === 'format') return strFormat(f.self, args, kw); return f.fn(f.self, ...args); }
    if (f instanceof PyFunc){
      const locals = Object.create(null); const ps = f.params;
      if (args.length > ps.length){ const req = ps.filter(pp => !pp.def).length;
        const range = req < ps.length ? `from ${req} to ${ps.length} positional arguments` : `${ps.length} positional argument${ps.length === 1 ? '' : 's'}`;
        throw E('TypeError', `${f.name}() takes ${range} but ${args.length} ${args.length === 1 ? 'was' : 'were'} given`); }
      ps.forEach((pp, i) => { if (i < args.length) locals[pp.name] = args[i]; });
      for (const k in kw){ if (!ps.some(pp => pp.name === k)) throw E('TypeError', `${f.name}() got an unexpected keyword argument '${k}'`); if (k in locals) throw E('TypeError', `${f.name}() got multiple values for argument '${k}'`); locals[k] = kw[k]; }
      const missing = ps.filter(pp => !(pp.name in locals) && !pp.def);
      if (missing.length) throw E('TypeError', `${f.name}() missing ${missing.length} required positional argument${missing.length > 1 ? 's' : ''}: ${missing.map(m => `'${m.name}'`).join(missing.length === 2 ? ' and ' : ', ')}`);
      ps.forEach(pp => { if (!(pp.name in locals)) locals[pp.name] = pp.defVal; });
      if (frames.length > 200) throw E('RecursionError', 'maximum recursion depth exceeded');
      const fr = { name:f.name, line:0, locals, localNames:f.localNames, globalNames:f.globalNames, closure:f.closure };
      frames.push(fr);
      try {
        if (f.lambda) return ev(f.body, fr);
        execBlock(f.body, fr);
        return null;
      } catch (e){ if (e instanceof Ret) return e.v;
        if (e instanceof PyErr && !e.stackFrames){ if (e.line) fr.line = e.line; e.stackFrames = frames.map(x => ({ name:x.name, line:x.line })); }
        throw e; }
      finally { frames.pop(); }
    }
    throw E('TypeError', `'${typeName(f)}' object is not callable`);
  }
  function scanLocals(body, set, globalNames){
    const add = t => { if (t.n === 'name') set.add(t.id); else if (t.n === 'tuple' || t.n === 'list') t.items.forEach(add); };
    for (const s of body){
      if (s.n === 'assign') s.targets.forEach(add); else if (s.n === 'aug') add(s.target); else if (s.n === 'for'){ add(s.target); scanLocals(s.body, set, globalNames); if (s.orelse) scanLocals(s.orelse, set, globalNames); }
      else if (s.n === 'if' || s.n === 'while'){ scanLocals(s.body, set, globalNames); if (s.orelse) scanLocals(s.orelse, set, globalNames); }
      else if (s.n === 'def') set.add(s.name); else if (s.n === 'global') s.names.forEach(n => globalNames.add(n));
      else if (s.n === 'import') s.names.forEach(([m, as]) => set.add(as)); else if (s.n === 'from') s.names.forEach(([m, as]) => set.add(as));
      else if (s.n === 'try'){ scanLocals(s.body, set, globalNames); s.handlers.forEach(h => { if (h.as) set.add(h.as); scanLocals(h.body, set, globalNames); }); if (s.orelse) scanLocals(s.orelse, set, globalNames); if (s.fin) scanLocals(s.fin, set, globalNames); }
    }
  }
  function ev(e, fr){
    switch (e.n){
      case 'const': return e.v;
      case 'name': return lookup(e.id, fr, e);
      case 'fstr': return e.parts.map(pt => (pt.s != null ? pt.s : pt.conv === 'r' ? repr(ev(pt.e, fr)) : formatSpec(ev(pt.e, fr), pt.spec))).join('');
      case 'list': return new PyList(e.items.map(x => ev(x, fr)));
      case 'tuple': return new PyTuple(e.items.map(x => ev(x, fr)));
      case 'set': { const s = new PySet(); e.items.forEach(x => s.add(ev(x, fr))); return s; }
      case 'dict': { const d = new PyDict(); e.keys.forEach((k, i) => { const kv = ev(k, fr); if (kv instanceof PyList || kv instanceof PyDict) throw E('TypeError', `unhashable type: '${typeName(kv)}'`); d.set(kv, ev(e.vals[i], fr)); }); return d; }
      case 'comp': {
        const out = []; const d = e.kind === 'dict' ? new PyDict() : null; const scope = { name:fr.name, line:fr.line, locals:Object.assign(Object.create(null), fr.locals || {}), closure:fr.locals ? fr.closure : null, globalNames:new Set() };
        const loop = i => { if (i === e.fors.length){ if (d) d.set(ev(e.elt, scope), ev(e.val, scope)); else out.push(ev(e.elt, scope)); return; }
          const f = e.fors[i]; for (const x of iterList(ev(f.iter, i === 0 ? fr : scope))){ assign(f.target, x, scope); if (f.ifs.every(c => truthy(ev(c, scope)))) loop(i + 1); } };
        loop(0);
        if (d) return d; if (e.kind === 'set'){ const s = new PySet(); out.forEach(x => s.add(x)); return s; } return new PyList(out); }
      case 'bin': return binop(e.op, ev(e.l, fr), ev(e.r, fr));
      case 'unary': { const v = ev(e.e, fr); if (!isNum(v)) throw E('TypeError', `bad operand type for unary ${e.op}: '${typeName(v)}'`); return e.op === '-' ? mk(-nv(v), isFloat(v)) : mk(nv(v), isFloat(v)); }
      case 'not': return !truthy(ev(e.e, fr));
      case 'bool': { const l = ev(e.l, fr); if (e.op === 'and') return truthy(l) ? ev(e.r, fr) : l; return truthy(l) ? l : ev(e.r, fr); }
      case 'ifexp': return truthy(ev(e.cond, fr)) ? ev(e.a, fr) : ev(e.b, fr);
      case 'cmp': { let a = ev(e.first, fr);
        for (let i = 0; i < e.ops.length; i++){ const b = ev(e.rest[i], fr); const op = e.ops[i]; let r;
          if (op === '==') r = eq(a, b); else if (op === '!=') r = !eq(a, b); else if (op === '<') r = lt(a, b, '<'); else if (op === '>') r = lt(b, a, '>');
          else if (op === '<=') r = !lt(b, a, '<='); else if (op === '>=') r = !lt(a, b, '>='); else if (op === 'in') r = contains(b, a); else if (op === 'not in') r = !contains(b, a);
          else if (op === 'is') r = a === b || (a instanceof PyType && b instanceof PyType && a.name === b.name); else r = !(a === b || (a instanceof PyType && b instanceof PyType && a.name === b.name));
          if (!r) return false; a = b; }
        return true; }
      case 'call': {
        const f = ev(e.f, fr); const args = e.args.map(a => ev(a, fr)); const kw = {}; e.kwargs.forEach(([k, v]) => { kw[k] = ev(v, fr); });
        return callValue(f, args, kw, e); }
      case 'sub': { const c = ev(e.e, fr);
        if (e.idx && e.idx.n === 'slice'){ if (c instanceof PyDict) throw E('TypeError', 'unhashable type: \'slice\''); if (!(c instanceof PyList || c instanceof PyTuple || typeof c === 'string' || c instanceof PyRange)) throw E('TypeError', `'${typeName(c)}' object is not subscriptable`);
          return slice(c, { a:e.idx.a && ev(e.idx.a, fr), b:e.idx.b && ev(e.idx.b, fr), c:e.idx.c && ev(e.idx.c, fr) }); }
        return index(c, ev(e.idx, fr)); }
      case 'attr': return getAttr(ev(e.e, fr), e.name);
      case 'lambda': { const f = new PyFunc('<lambda>', e.params.map(pp => ({ name:pp.name })), e.body, globals); f.lambda = true; f.localNames = new Set(e.params.map(pp => pp.name)); f.globalNames = new Set(); f.closure = fr.locals || null; return f; }
      case 'slice': throw E('SyntaxError', 'invalid syntax');
    }
    throw E('RuntimeError', `연습장이 아직 모르는 표현이에요(${e.n})`);
  }
  function execBlock(body, fr){ for (const s of body) exec(s, fr); }
  function exec(s, fr){
    fr.line = s.ln;
    switch (s.n){
      case 'expr': ev(s.e, fr); return;
      case 'assign': { const v = ev(s.e, fr); s.targets.forEach(t => assign(t, v, fr)); return; }
      case 'aug': { let cur;
        if (s.target.n === 'name') cur = lookup(s.target.id, fr, s.target);
        else cur = ev(s.target, fr);
        if (s.op === '+' && cur instanceof PyList){ cur.a.push(...iterList(ev(s.e, fr))); return; }
        const rhs = ev(s.e, fr); let val;
        try { val = binop(s.op, cur, rhs); } catch (x){ if (x instanceof PyErr && x.msg.startsWith('unsupported operand type(s) for ' + s.op + ':')) x.msg = x.msg.replace(' for ' + s.op + ':', ' for ' + s.op + '=:'); throw x; }
        assign(s.target, val, fr); return; }
      case 'pass': case 'global': return;
      case 'break': throw new Brk(); case 'continue': throw new Cnt();
      case 'return': if (!fr.locals) throw new PyErr('SyntaxError', "'return' outside function", s.ln); throw new Ret(s.e ? ev(s.e, fr) : null);
      case 'if': if (truthy(ev(s.cond, fr))) execBlock(s.body, fr); else if (s.orelse) execBlock(s.orelse, fr); return;
      case 'while': { let broke = false;
        while (truthy(ev(s.cond, fr))){ try { execBlock(s.body, fr); } catch (e){ if (e instanceof Brk){ broke = true; break; } if (e instanceof Cnt) continue; throw e; } fr.line = s.ln; }
        if (!broke && s.orelse) execBlock(s.orelse, fr); return; }
      case 'for': { let broke = false;
        const itv = ev(s.iter, fr);
        /* 리스트는 도는 중에 바뀐 모습을 그대로 따라간다(진짜 파이썬처럼 번호로 한 칸씩) */
        const live = itv instanceof PyList && !(itv instanceof PyView);
        const seq = live ? null : iterList(itv);
        for (let k = 0; live ? k < itv.a.length : k < seq.length; k++){ const x = live ? itv.a[k] : seq[k]; assign(s.target, x, fr);
          try { execBlock(s.body, fr); } catch (e){ if (e instanceof Brk){ broke = true; break; } if (e instanceof Cnt) continue; throw e; } fr.line = s.ln; }
        if (!broke && s.orelse) execBlock(s.orelse, fr); return; }
      case 'def': { const f = new PyFunc(s.name, s.params.map(pp => ({ name:pp.name, def:!!pp.def, defVal:pp.def ? ev(pp.def, fr) : undefined })), s.body, globals);
        const ln = new Set(s.params.map(pp => pp.name)), gn = new Set(); scanLocals(s.body, ln, gn); f.localNames = ln; f.globalNames = gn; f.closure = fr.locals || null;
        assignName(s.name, f, fr); return; }
      case 'import': s.names.forEach(([m, as]) => { if (!MODULES[m]) throw E('ModuleNotFoundError', `No module named '${m}'`); assignName(as, MODULES[m](), fr); }); return;
      case 'from': { if (!MODULES[s.m]) throw E('ModuleNotFoundError', `No module named '${s.m}'`); const mod = MODULES[s.m]();
        s.names.forEach(([n, as]) => { if (n === '*'){ for (const k in mod.attrs) assignName(k, mod.attrs[k], fr); return; }
          if (!(n in mod.attrs)) throw E('ImportError', `cannot import name '${n}' from '${s.m}'`); assignName(as, mod.attrs[n], fr); }); return; }
      case 'raise': { if (!s.e) throw E('RuntimeError', 'No active exception to reraise'); const v = ev(s.e, fr);
        if (v instanceof PyExc) throw E(v.type, v.msg); if (v instanceof PyType) throw E(v.name, ''); throw E('TypeError', 'exceptions must derive from BaseException'); }
      case 'assert': if (!truthy(ev(s.e, fr))) throw E('AssertionError', s.msg ? str(ev(s.msg, fr)) : ''); return;
      case 'del': s.targets.forEach(t => { if (t.n === 'name'){ if (fr.locals && t.id in fr.locals) delete fr.locals[t.id]; else if (t.id in globals) delete globals[t.id]; else lookup(t.id, fr, t); }
        else if (t.n === 'sub'){ const c = ev(t.e, fr), i = ev(t.idx, fr); if (c instanceof PyDict){ if (!c.del(i)) throw E('KeyError', repr(i)); } else if (c instanceof PyList){ let k = nv(i); if (k < 0) k += c.a.length; if (k < 0 || k >= c.a.length) throw E('IndexError', 'list assignment index out of range'); c.a.splice(k, 1); } } }); return;
      case 'try': {
        let ok = false;
        try { execBlock(s.body, fr); ok = true; }
        catch (e){
          if (!(e instanceof PyErr) || e.type === 'SyntaxError') throw e;
          const h = s.handlers.find(hh => { if (!hh.type) return true; const t = ev(hh.type, fr); const ts = t instanceof PyTuple ? t.a : [t];
            const base = e.type.split('.').pop();
            return ts.some(x => x instanceof PyType && (x.name === e.type || x.name === base || x.name === 'Exception' || (x.name === 'ValueError' && base === 'JSONDecodeError') || (x.name === 'LookupError' && (e.type === 'KeyError' || e.type === 'IndexError')))); });
          if (!h){ if (s.fin) execBlock(s.fin, fr); throw e; }
          if (h.as) assignName(h.as, new PyExc(e.type, e.msg.replace(/\. Did you (mean|forget to import)[^]*$/, '')), fr);
          try { execBlock(h.body, fr); } finally { if (s.fin) execBlock(s.fin, fr); }
          return;
        }
        if (ok && s.orelse) execBlock(s.orelse, fr);
        if (s.fin) execBlock(s.fin, fr);
        return; }
    }
    throw E('RuntimeError', `연습장이 아직 모르는 문장이에요(${s.n})`);
  }

  let BUILTINS;
  function run(src, ans, out){
    OUT = out; answers = (ans || []).slice(); globals = Object.create(null); globals.__name__ = '__main__'; frames = []; BUILTINS = makeBuiltins(); rngSeed = null;
    const lines = src.replace(/\r/g, '').split('\n');
    let tree;
    try { tree = parse(tokenize(src.replace(/\r/g, ''))); }
    catch (e){
      if (!(e instanceof PyErr)) throw e;
      const raw = lines[e.line - 1] || '';
      const col = Math.max(0, (e.col || 0) - (raw.length - raw.replace(/^\s+/, '').length));
      return `  File "main.py", line ${e.line}\n    ${raw.trim()}\n    ${' '.repeat(col)}^\n${e.type}: ${e.msg}`;
    }
    const top = { name:'<module>', line:0, locals:null };
    frames.push(top);
    try { execBlock(tree, top); return ''; }
    catch (e){
      if (e instanceof ExitSignal) return '';
      if (e instanceof Brk || e instanceof Cnt){ return `  File "main.py", line ${top.line}\nSyntaxError: 'break' outside loop`; }
      if (e instanceof Ret) return '';
      let err = e;
      if (e instanceof RangeError) err = E('RecursionError', 'maximum recursion depth exceeded');
      if (!(err instanceof PyErr)) err = E('RuntimeError', String(e && e.message || e));
      const stack = err.stackFrames || frames.map(f => ({ name:f.name, line:f.line }));
      if (err.line && stack.length) stack[stack.length - 1].line = err.line;
      let tb = 'Traceback (most recent call last):\n';
      for (const f of stack){ tb += `  File "main.py", line ${f.line}, in ${f.name}\n    ${(lines[f.line - 1] || '').trim()}\n`; }
      return tb + `${err.type}${err.msg !== '' ? ': ' + err.msg : ''}`;
    }
  }
  return { run };
}

/* 워커에서 돌리기: 2초 넘게 걸리면 멈춘다. 워커를 못 쓰면 이 화면에서 바로 돌린다 */
function pyPad({ onOut, onErr, onNote, onDone }){
  let worker = null, timer = null;
  const stop = () => { clearTimeout(timer); if (worker){ worker.terminate(); worker = null; } };
  function run(code, answers){
    stop();
    const body = `const PY = (${__hanipPy.toString()})();\nlet n = 0;\nself.onmessage = e => { const out = s => { n += s.length; if (n > 20000) throw new Error('__too_much__'); self.postMessage({ t:'out', s }); };\n` +
      `  let err = ''; try { err = PY.run(e.data.code, e.data.answers, out); } catch (x){ if (String(x && x.message) === '__too_much__') { self.postMessage({ t:'note', s:'출력이 너무 많아서 멈췄어요. 끝나지 않는 반복이 있는지 살펴봐요.' }); } else err = 'RuntimeError: ' + (x && x.message); }\n` +
      `  if (err) self.postMessage({ t:'err', s:err }); self.postMessage({ t:'done' }); };`;
    let url;
    try { url = URL.createObjectURL(new Blob([body], { type:'text/javascript' })); worker = new Worker(url); }
    catch (e){ const PY = __hanipPy(); let buf = ''; const err = PY.run(code, answers, s => { buf += s; }); onOut(buf); if (err) onErr(err); onDone(); return; }
    worker.onmessage = e => { const d = e.data;
      if (d.t === 'out') onOut(d.s); else if (d.t === 'err') onErr(d.s); else if (d.t === 'note') onNote(d.s); else if (d.t === 'done'){ clearTimeout(timer); onDone(); } };
    worker.onerror = e => { e.preventDefault(); clearTimeout(timer); onErr('RuntimeError: ' + e.message); onDone(); };
    timer = setTimeout(() => { stop(); onNote('코드가 2초가 넘도록 끝나지 않아서 멈췄어요. 끝나지 않는 반복(무한 반복)이 있는지 살펴봐요.'); onDone(); }, 2000);
    worker.postMessage({ code, answers });
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
  return { run, stop };
}
