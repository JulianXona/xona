// XONA — utilities, hooks, motion helpers
const { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, createContext, useContext } = React;

/* ─── Router (hash-based) ─────────────────────────────────────── */
const RouterContext = createContext({ path: 'home', query: {}, navigate: () => {} });
function parseHash() {
  const h = (window.location.hash || '#/home').replace(/^#\/?/, '');
  const [path, qs] = h.split('?');
  const query = {};
  if (qs) qs.split('&').forEach(kv => { const [k,v] = kv.split('='); query[k] = decodeURIComponent(v||''); });
  return { path: path || 'home', query };
}
function RouterProvider({ children }) {
  const [route, setRoute] = useState(parseHash);
  const [isTransitioning, setT] = useState(false);
  useEffect(() => {
    const onHash = () => {
      setT(true);
      setTimeout(() => { setRoute(parseHash()); window.scrollTo({ top: 0, behavior: 'instant' }); }, 320);
      setTimeout(() => setT(false), 720);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const navigate = useCallback((p) => {
    const target = p.startsWith('/') ? '#' + p : '#/' + p;
    if ('#' + window.location.hash.replace(/^#/, '') === target || window.location.hash === target) return;
    window.location.hash = target.slice(1);
  }, []);
  return (
    <RouterContext.Provider value={{ ...route, navigate, isTransitioning }}>
      {children}
      <div className={`curtain ${isTransitioning ? 'entering' : ''}`} aria-hidden="true"></div>
    </RouterContext.Provider>
  );
}
const useRouter = () => useContext(RouterContext);

function Link({ to, children, className, ...props }) {
  const { navigate } = useRouter();
  const onClick = (e) => { e.preventDefault(); navigate(to); };
  return <a href={'#/' + to} className={className} onClick={onClick} {...props}>{children}</a>;
}

/* ─── Reveal-on-scroll hook ─────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.r:not(.in), .split-word:not(.in)').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ─── Scroll progress ─────────────────────────────── */
function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      if (ref.current) ref.current.style.width = p + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="scroll-progress" ref={ref}></div>;
}

/* ─── Custom cursor ─────────────────────────────── */
function CustomCursor() {
  const dotRef = useRef(null), ringRef = useRef(null);
  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    };
    const tick = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    };
    const onOver = (e) => {
      const isInteractive = e.target.closest('a, button, [data-cursor-hover], input, textarea, select');
      ringRef.current?.classList.toggle('hover', !!isInteractive);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    tick();
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseover', onOver); };
  }, []);
  return (
    <>
      <div className="cursor-ring" ref={ringRef}></div>
      <div className="cursor-dot" ref={dotRef}></div>
    </>
  );
}

/* ─── Word splitter ─────────────────────────────── */
function SplitWords({ text, className = '', as: Tag = 'span', delay = 0 }) {
  const words = (text || '').split(' ');
  return (
    <Tag className={className}>
      {words.map((w, i) => (
        <span key={i} className="split-word" style={{ transitionDelay: `${delay + i*0.05}s` }}>
          <span style={{ transitionDelay: `${delay + i*0.05}s` }}>{w}{i < words.length - 1 ? '\u00A0' : ''}</span>
        </span>
      ))}
    </Tag>
  );
}

/* ─── Arrow icon ─────────────────────────────── */
function Arrow(props) {
  return (
    <svg className="arrow" viewBox="0 0 14 10" fill="none" {...props}>
      <path d="M1 5h12M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Parallax helper ─────────────────────────── */
function useParallax(ref, factor = 0.2) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.setProperty('--par', `${-center * factor}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref, factor]);
}

/* ─── i18n ─────────────────────────────────────── */
const LangContext = createContext({ lang: 'ES', setLang: () => {}, t: window.XONA_I18N?.ES || {} });
function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('xona-lang');
    return (saved && window.XONA_I18N[saved]) ? saved : 'ES';
  });
  const setLang = useCallback((l) => {
    if (!window.XONA_I18N[l]) return;
    setLangState(l);
    localStorage.setItem('xona-lang', l);
    document.documentElement.lang = l.toLowerCase();
  }, []);
  useEffect(() => { document.documentElement.lang = lang.toLowerCase(); }, [lang]);
  const t = window.XONA_I18N[lang] || window.XONA_I18N.ES;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}
const useLang = () => useContext(LangContext);

/* ─── Img component — imagery with treatment ─── */
function Img({ src, alt = '', ratio, treatment = 'cinematic', parallax = false, className = '', style = {}, caption, children }) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!parallax) return;
    const el = wrapRef.current; if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2 - window.innerHeight / 2;
      const offset = Math.max(-80, Math.min(80, -center * 0.08));
      if (imgRef.current) imgRef.current.style.transform = `translateY(${offset}px) scale(1.08)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [parallax]);
  return (
    <div ref={wrapRef} className={`xona-img t-${treatment} ${loaded ? 'is-loaded' : ''} ${className}`} style={{ aspectRatio: ratio, ...style }}>
      <img ref={imgRef} src={src} alt={alt} loading="lazy" onLoad={() => setLoaded(true)} />
      <div className="xona-img-grain"></div>
      <div className="xona-img-tint"></div>
      {caption && <div className="xona-img-caption mono">{caption}</div>}
      {children}
    </div>
  );
}

/* ─── Mouse position context (for cursor-following effects) ─── */
function useMousePos() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const on = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', on);
    return () => window.removeEventListener('mousemove', on);
  }, []);
  return pos;
}

Object.assign(window, {
  RouterProvider, useRouter, Link, useReveal, ScrollProgress, CustomCursor,
  SplitWords, Arrow, useParallax, useMousePos, Img,
  LangProvider, useLang,
});
