/* ─── HOME — 3 direcciones ─── */

/* ============================================================
   COMPONENTES COMPARTIDOS DE HOME
   ============================================================ */

function HomeFrase() {
  const ref = useRef(null);
  const { t } = useLang();
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const center = (r.top + r.height / 2) - window.innerHeight / 2;
      const progress = Math.max(0, Math.min(1, 1 - Math.abs(center) / (window.innerHeight * 0.7)));
      el.style.setProperty('--reveal', progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const text = t.home.frase;
  const words = text.split(' ');
  const accentSet = new Set(['extraordinaria.','infinito','straordinaria.','extraordinary.','infinito,','straordinarie.']);
  return (
    <section ref={ref} className="section-pad" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="maxw" style={{ textAlign: 'left', width: '100%' }}>
        <div className="eyebrow r" style={{ marginBottom: '2rem' }}>{t.home.manifesto}</div>
        <h2 style={{ maxWidth: '20ch', fontSize: 'clamp(1.7rem, 6.5vw, 5.5rem)', lineHeight: 1.05 }}>
          {words.map((w, i) => {
            const isAccent = accentSet.has(w) || /(extraordinari|straordinari)/i.test(w);
            return (
              <span key={i} style={{
                display: 'inline-block',
                opacity: `calc(0.18 + var(--reveal, 0) * ${isAccent ? '0.85' : '0.75'})`,
                color: isAccent ? 'var(--gold)' : 'inherit',
                transition: 'opacity .6s ease',
                fontFamily: isAccent ? 'var(--f-serif)' : 'inherit',
                fontStyle: isAccent ? 'italic' : 'normal',
                fontWeight: isAccent ? 400 : 500,
                marginRight: '0.25em'
              }}>{w}</span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}

/* === HOME CASES === Image-back rows with reveal === */
function HomeCases() {
  const { t } = useLang();
  const casos = window.XONA.casos.slice(0, 6);
  const [hovered, setHovered] = useState(null);
  return (
    <section className="section-pad home-cases">
      <div className="maxw">
        <div className="flex between" style={{ alignItems: 'flex-end', marginBottom: 'clamp(2rem, 5vw, 3rem)', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="r">
            <div className="eyebrow" style={{ marginBottom: '1rem' }}>{t.home.casosKicker}</div>
            <h2 style={{ maxWidth: '14ch' }}>
              {t.home.casosTitulo[0]} <span className="serif-it gold">{t.home.casosTitulo[1]}</span> {t.home.casosTitulo[2]}
            </h2>
          </div>
          <Link to="que-hacemos" className="btn r r-2">{t.common.viewAll} <Arrow /></Link>
        </div>

        <div className="cases-list">
          {casos.map((c, i) => (
            <Link
              key={c.id}
              to={`caso?id=${c.id}`}
              className={`case-row ${hovered === i ? 'is-hovered' : ''} ${hovered != null && hovered !== i ? 'is-dimmed' : ''}`}
              data-cursor-hover
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onTouchStart={() => setHovered(i)}
            >
              {/* Background image — full width of the row */}
              <div className="case-row-bg" aria-hidden="true">
                <img src={c.hero} alt="" loading="lazy" />
                <div className="grain"></div>
                <div className="tint" style={{ background: `linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.5) 60%, ${hexToRgba(c.color, 0.55)} 100%)` }}></div>
              </div>
              <div className="case-row-inner">
                <span className="case-num mono">{String(i+1).padStart(2,'0')}</span>
                <span className="case-title">{c.titulo}</span>
                <span className="case-meta mono">{c.cliente} — {c.year}</span>
                <span className="case-arrow"><Arrow /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .home-cases { position: relative; }
        .cases-list { border-top: 1px solid var(--fg-faint); }
        .case-row {
          display: block; position: relative; isolation: isolate;
          border-bottom: 1px solid var(--fg-faint);
          transition: padding-left .5s var(--ease-out);
          overflow: hidden;
        }
        .case-row-bg {
          position: absolute; inset: 0; z-index: 0;
          opacity: 0;
          transition: opacity .55s var(--ease-out);
          pointer-events: none;
          overflow: hidden;
        }
        .case-row-bg img {
          width: 100%; height: 100%; object-fit: cover;
          transform: scale(1.1) translateX(-2%);
          transition: transform 1.2s var(--ease-out);
          filter: contrast(1.05) saturate(0.85) brightness(0.85);
        }
        .case-row-bg .grain {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>");
          mix-blend-mode: overlay; opacity: .25;
        }
        .case-row-bg .tint { position: absolute; inset: 0; }

        .case-row.is-hovered .case-row-bg { opacity: 1; }
        .case-row.is-hovered .case-row-bg img { transform: scale(1.04) translateX(0); }
        .case-row.is-dimmed .case-title { color: var(--fg-mute); }

        .case-row:hover { padding-left: clamp(0.5rem, 2vw, 1.5rem); }

        .case-row-inner {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 60px 1fr auto 40px; gap: clamp(1rem, 3vw, 2rem);
          padding: clamp(1.4rem, 4vw, 2.8rem) 0; align-items: center;
        }
        .case-num { color: var(--fg-mute); transition: color .4s; }
        .case-title {
          font-family: var(--f-display); font-weight: 500; letter-spacing: -0.02em;
          font-size: clamp(1.5rem, 6vw, 4rem);
          line-height: 1;
          transition: color .4s, transform .5s var(--ease-out);
          padding: 0.1em 0;
        }
        .case-row.is-hovered .case-title { color: var(--gold); }
        .case-row.is-hovered .case-num { color: var(--gold); }
        .case-meta { color: var(--fg-mute); white-space: nowrap; transition: color .4s, opacity .4s; }
        .case-row.is-hovered .case-meta { color: var(--fg); }
        .case-arrow { color: var(--gold); opacity: 0; transform: translateX(-12px); transition: all .4s var(--ease-out); }
        .case-row.is-hovered .case-arrow { opacity: 1; transform: translateX(0); }

        @media (max-width: 720px) {
          .case-row-bg { opacity: 0.5; }   /* show image always on mobile, faded */
          .case-row-bg img { transform: scale(1.04); }
          .case-row.is-hovered .case-row-bg { opacity: 1; }
          .case-row-inner {
            grid-template-columns: 36px 1fr 24px;
            gap: 0.75rem;
            padding: clamp(1.1rem, 5vw, 1.6rem) clamp(0.6rem, 3vw, 1rem);
          }
          .case-meta { display: none; }
          .case-title { font-size: clamp(1.5rem, 8vw, 2.5rem); }
          .case-arrow { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}

function HomeStats() {
  const { t } = useLang();
  const stats = t.home.stats;
  return (
    <section className="section-pad" style={{ borderTop: '1px solid var(--fg-faint)', borderBottom: '1px solid var(--fg-faint)' }}>
      <div className="maxw">
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--fg-faint)', border: '1px solid var(--fg-faint)' }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-cell r" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="stat-num">{s.n}</div>
              <div className="mono dim">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .stat-cell {
          background: var(--bg);
          padding: clamp(1.6rem, 5vw, 4rem) clamp(1rem, 3vw, 2.2rem);
          display: flex; flex-direction: column; gap: 0.5rem;
          transition: background .4s, opacity .9s, transform .9s;
        }
        .stat-cell:hover { background: var(--bg-2); }
        .stat-num { font-family: var(--f-serif); font-style: italic; font-size: clamp(2.4rem, 7vw, 6rem); color: var(--gold); line-height: 0.9; font-weight: 400; }
        @media (max-width: 700px) { .stats-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </section>
  );
}

function HomeServiciosScrollH() {
  const { t } = useLang();
  const servicios = window.XONA.servicios;
  return (
    <section className="section-pad">
      <div className="maxw">
        <div className="r" style={{ marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
          <div className="eyebrow" style={{ marginBottom: '1rem' }}>{t.home.serviciosKicker}</div>
          <h2 style={{ maxWidth: '20ch' }}>
            {t.home.serviciosTitulo[0]} <span className="serif-it gold">{t.home.serviciosTitulo[1]}</span> {t.home.serviciosTitulo[2]}
          </h2>
        </div>
      </div>
      <div className="services-h-scroll">
        <div className="services-h-track">
          {servicios.map((s, i) => (
            <Link to={`que-hacemos?s=${s.id}`} key={s.id} className="service-card" data-cursor-hover>
              <div className="service-num mono">{s.n} / 04</div>
              <h3>{s.titulo}</h3>
              <p className="dim" style={{ marginTop: '1rem', fontSize: '0.95rem' }}>{s.bajada}</p>
              <ul style={{ marginTop: '1.5rem' }}>
                {s.items.slice(0, 4).map((it, j) => (
                  <li key={j} className="mono" style={{ color: 'var(--fg-dim)', padding: '0.4rem 0', borderTop: '1px solid var(--fg-faint)' }}>{it}</li>
                ))}
              </ul>
              <div className="service-link mono">{t.common.explore} <Arrow /></div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .services-h-scroll { overflow-x: auto; padding: 0 var(--px) 1rem; scrollbar-width: thin; -webkit-overflow-scrolling: touch; }
        .services-h-scroll::-webkit-scrollbar { height: 4px; }
        .services-h-track { display: inline-flex; gap: 1rem; padding-bottom: 1rem; }
        .service-card {
          flex: 0 0 clamp(260px, 28vw, 380px);
          background: var(--bg-2);
          padding: clamp(1.4rem, 3vw, 2rem);
          border: 1px solid var(--fg-faint);
          display: flex; flex-direction: column;
          transition: background .4s, border-color .4s, transform .4s;
          aspect-ratio: 3 / 4;
        }
        .service-card:hover { background: var(--bg-3); border-color: var(--gold-line); transform: translateY(-4px); }
        .service-num { color: var(--gold); margin-bottom: 1.5rem; }
        .service-card h3 { font-size: clamp(1.2rem, 2.6vw, 2rem); }
        .service-card h3::after { content: ''; display: block; width: 30px; height: 1px; background: var(--gold); margin-top: 1rem; }
        .service-link { margin-top: auto; padding-top: 2rem; color: var(--gold); display: inline-flex; gap: 0.5rem; align-items: center; }
      `}</style>
    </section>
  );
}

function HomeFilosofia() {
  const { t } = useLang();
  const dt = t.home.diferencialTitulo.split('.');
  return (
    <section className="section-pad" style={{ background: 'var(--bg-2)' }}>
      <div className="maxw filosofia-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem, 6vw, 6rem)', alignItems: 'center' }}>
        <div className="r">
          <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>{t.home.diferencialKicker}</div>
          <h2 style={{ marginBottom: '2rem' }}>{dt[0]}.<br/><span className="serif-it gold">{dt[1]}.</span></h2>
          <p className="lead" style={{ marginBottom: '2rem' }}>{t.home.diferencialCuerpo}</p>
          <Link to="xomos" className="btn">{t.common.whoWeAre} <Arrow /></Link>
        </div>
        <div className="r r-1" style={{ aspectRatio: '4/5' }}>
          <Img src={window.XONA.imagenes.servicios.branded} ratio="4/5" treatment="cinematic" parallax caption="REEL · BACKSTAGE" />
        </div>
      </div>
      <style>{`
        @media (max-width: 800px) { .filosofia-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function HomeMosaic() {
  const { t } = useLang();
  const imgs = window.XONA.imagenes.homeMosaic;
  const captions = ['01 · STAGE','02 · GALA','03 · ACTIVATION','04 · STADIUM','05 · SHOWROOM','06 · TRAVEL'];
  return (
    <section className="section-pad" style={{ background: 'var(--bg)' }}>
      <div className="maxw">
        <div className="r" style={{ marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
          <div className="eyebrow" style={{ marginBottom: '1rem' }}>{t.home.mosaicKicker}</div>
          <h2 style={{ maxWidth: '18ch' }}>
            {t.home.mosaicTitulo[0]} <span className="serif-it gold">{t.home.mosaicTitulo[1]}</span> {t.home.mosaicTitulo[2]}
          </h2>
        </div>
        <div className="mosaic">
          <div className="m m-1 r"><Img src={imgs[0]} treatment="cinematic" parallax caption={captions[0]} /></div>
          <div className="m m-2 r r-1"><Img src={imgs[1]} treatment="cinematic" parallax caption={captions[1]} /></div>
          <div className="m m-3 r r-2"><Img src={imgs[2]} treatment="cinematic" caption={captions[2]} /></div>
          <div className="m m-4 r"><Img src={imgs[3]} treatment="cinematic" parallax caption={captions[3]} /></div>
          <div className="m m-5 r r-1"><Img src={imgs[4]} treatment="cinematic" caption={captions[4]} /></div>
          <div className="m m-6 r r-2"><Img src={imgs[5]} treatment="cinematic" parallax caption={captions[5]} /></div>
        </div>
      </div>
      <style>{`
        .mosaic { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 14vw; gap: clamp(0.5rem, 1.2vw, 1rem); }
        .mosaic .m { overflow: hidden; height: 100%; min-height: 0; }
        .mosaic .m > .xona-img { width: 100%; height: 100%; aspect-ratio: auto; }
        .m-1 { grid-column: span 2; grid-row: span 2; }
        .m-2 { grid-column: span 2; grid-row: span 3; }
        .m-3 { grid-column: span 2; grid-row: span 2; }
        .m-4 { grid-column: span 2; grid-row: span 2; }
        .m-5 { grid-column: span 2; grid-row: span 2; }
        .m-6 { grid-column: span 2; grid-row: span 3; }
        @media (max-width: 800px) {
          .mosaic { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 38vw; }
          .m-1, .m-2, .m-3, .m-4, .m-5, .m-6 { grid-column: span 1; grid-row: span 1; }
        }
      `}</style>
    </section>
  );
}

function HomeCTA() {
  const { t } = useLang();
  return (
    <section className="section-pad" style={{ textAlign: 'center', padding: 'calc(var(--py) * 1.4) var(--px)' }}>
      <div className="r">
        <div className="eyebrow" style={{ marginBottom: '2rem', justifyContent: 'center', display: 'inline-flex' }}>{t.home.ctaKicker}</div>
        <h2 style={{ maxWidth: '20ch', margin: '0 auto 2.5rem', fontSize: 'clamp(1.8rem, 6vw, 5rem)' }}>
          {t.home.ctaTitulo[0]}<br/><span className="serif-it gold">{t.home.ctaTitulo[1]}</span>
        </h2>
        <Link to="contacto" className="btn solid">{t.common.start} <Arrow /></Link>
      </div>
    </section>
  );
}

/* helper — used in case-row tint */
function hexToRgba(hex, a = 1) {
  const h = hex.replace('#','');
  const r = parseInt(h.substr(0,2),16), g = parseInt(h.substr(2,2),16), b = parseInt(h.substr(4,2),16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ============================================================
   DIRECCIÓN A — Editorial Motion
   ============================================================ */
function HomeA() {
  const { t } = useLang();
  return (
    <div className="dir-a">
      <section className="home-hero">
        <div className="grid-bg"></div>
        <div className="hero-bg-img" aria-hidden="true">
          <Img src={window.XONA.imagenes.homeHero[0]} treatment="cinematic" style={{ width: '100%', height: '100%' }} parallax />
        </div>
        <div className="maxw" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div className="flex between" style={{ marginBottom: 'clamp(2.5rem, 7vw, 5rem)', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="eyebrow r">{t.home.eyebrow}</div>
            <div className="mono dim r r-1 hide-mobile">↓ {t.common.scroll}</div>
          </div>
          <h1>
            <SplitWords text={t.home.titulo[0]} /><br/>
            <SplitWords text={t.home.titulo[1]} delay={0.2} /><br/>
            <em><SplitWords text={t.home.titulo[2]} delay={0.5} /></em>
          </h1>
          <div className="hero-bottom-grid">
            <p className="lead r r-3">{t.home.sub}</p>
            <div className="r r-4 hero-buttons">
              <Link to="que-hacemos" className="btn">{t.common.whatWeDo} <Arrow /></Link>
              <Link to="contacto" className="btn ghost">{t.common.contact}</Link>
            </div>
          </div>
        </div>
        <div className="scroll-cue hide-mobile">
          <span>SCROLL</span>
          <div className="line"></div>
        </div>
      </section>

      <HomeStats />

      <section className="section-pad">
        <div className="maxw propuesta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem,6vw,6rem)', alignItems: 'center' }}>
          <div className="r r-1" style={{ aspectRatio: '4/5' }}>
            <Img src={window.XONA.imagenes.homeHero[1]} ratio="4/5" treatment="cinematic" parallax caption="REEL · 2025" />
          </div>
          <div>
            <div className="eyebrow r" style={{ marginBottom: '1.5rem' }}>{t.home.propuestaKicker}</div>
            <h2 className="r r-1" style={{ marginBottom: '2rem' }}>
              {t.home.propuestaTitulo.replace(/\.$/,'').split(' ').slice(0,-1).join(' ')} <span className="serif-it gold">{t.home.propuestaTitulo.split(' ').slice(-1)[0]}</span>
            </h2>
            <p className="lead r r-2" style={{ marginBottom: '2rem' }}>{t.home.propuestaCuerpo}</p>
            <Link to="que-hacemos" className="btn r r-3">{t.common.services} <Arrow /></Link>
          </div>
        </div>
        <style>{`
          @media (max-width: 800px) {
            .propuesta-grid { grid-template-columns: 1fr !important; }
            .propuesta-grid > div:first-child { order: 2; }
          }
        `}</style>
      </section>

      <HomeFrase />
      <HomeMosaic />
      <HomeCases />
      <HomeServiciosScrollH />
      <HomeFilosofia />

      <section style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0', borderTop: '1px solid var(--fg-faint)' }}>
        <div style={{ padding: '0 var(--px)', marginBottom: '2rem' }}>
          <div className="eyebrow">{t.common.clients}</div>
        </div>
        <ClientesMarquee />
      </section>

      <HomeCTA />
    </div>
  );
}

/* ============================================================
   DIRECCIÓN B — Brutalist Grid
   ============================================================ */
function HomeB() {
  const { t } = useLang();
  return (
    <div className="dir-b">
      <section className="home-hero">
        <div>
          <div className="mono" style={{ color: 'var(--gold)', marginBottom: '2rem' }}>[ XONA / 2026 / V3 ]</div>
          <h1>
            <SplitWords text={t.home.titulo[0]} /><br/>
            <SplitWords text={t.home.titulo[1]} delay={0.2} /><br/>
            <em><SplitWords text={t.home.titulo[2]} delay={0.5} /></em>
          </h1>
          <div className="r r-2" style={{ marginTop: '2.5rem', aspectRatio: '16/10' }}>
            <Img src={window.XONA.imagenes.homeHero[2]} ratio="16/10" treatment="duotone" caption="● LIVE · BUE 2025" />
          </div>
        </div>
        <div className="meta">
          <div className="row mono"><span className="k">EST.</span><span className="v">2005</span></div>
          <div className="row mono"><span className="k">{t.common.offices.toUpperCase()}</span><span className="v">04</span></div>
          <div className="row mono"><span className="k">DISC.</span><span className="v">04</span></div>
          <div className="row mono"><span className="k">{t.common.cases.toUpperCase()}</span><span className="v">150+</span></div>
          <p className="lead" style={{ marginTop: '1rem' }}>{t.home.sub}</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link to="que-hacemos" className="btn">{t.common.whatWeDo} <Arrow /></Link>
            <Link to="contacto" className="btn ghost">{t.common.contact}</Link>
          </div>
        </div>
      </section>

      <section style={{ borderTop: '1px solid var(--fg-faint)', borderBottom: '1px solid var(--fg-faint)', padding: 'clamp(2rem, 5vw, 4rem) 0', overflow: 'hidden' }}>
        <div className="marquee">
          <div className="marquee-track" style={{ animationDuration: '30s' }}>
            {[...Array(4)].map((_, i) => (
              <span key={i} className="marquee-item" style={{ fontSize: 'clamp(2.4rem, 8vw, 7rem)', color: 'var(--fg)' }}>
                Eventos<span className="dot"></span>
                <span className="serif-it gold">Branded Content</span><span className="dot"></span>
                PR<span className="dot"></span>
                <span className="serif-it gold">Digital</span><span className="dot"></span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <HomeStats />
      <HomeServiciosScrollH />
      <HomeFrase />
      <HomeMosaic />
      <HomeCases />
      <HomeFilosofia />

      <section style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0', borderTop: '1px solid var(--fg-faint)' }}>
        <div style={{ padding: '0 var(--px)', marginBottom: '2rem' }}>
          <div className="eyebrow">{t.common.clients} — 150+</div>
        </div>
        <ClientesMarquee />
      </section>
      <HomeCTA />
    </div>
  );
}

/* ============================================================
   DIRECCIÓN C — Minimal Cinematic
   ============================================================ */
function HomeC() {
  const { t } = useLang();
  return (
    <div className="dir-c">
      <section className="home-hero">
        <div className="video-bg">
          <Img src={window.XONA.imagenes.homeHero[0]} treatment="cinematic" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} parallax />
        </div>
        <div className="corners hide-mobile">
          <div className="corner tl"><span>● REC</span><span>{new Date().getFullYear()}</span></div>
          <div className="corner tr"><span>BUE / BRC / SCL / ROM</span></div>
          <div className="corner bl"><span>{t.common.motionReel}</span></div>
          <div className="corner br"><span>1.0 — SCROLL</span></div>
        </div>
        <div className="maxw" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div className="eyebrow r" style={{ marginBottom: '2rem' }}>{t.home.eyebrow}</div>
          <h1>
            <SplitWords text={t.home.titulo[0]} /> <em><SplitWords text={t.home.titulo[1]} delay={0.15} /></em><br/>
            <SplitWords text={t.home.titulo[2]} delay={0.5} />
          </h1>
          <div style={{ display: 'flex', gap: '1rem', marginTop: 'clamp(2rem, 5vw, 3rem)', flexWrap: 'wrap' }}>
            <Link to="que-hacemos" className="btn solid r r-2">{t.common.seeReel} <Arrow /></Link>
            <Link to="xomos" className="btn r r-3">Xomos</Link>
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ borderTop: '1px solid var(--fg-faint)' }}>
        <div className="maxw">
          <div className="propuestaC-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'clamp(2rem, 6vw, 6rem)', alignItems: 'flex-start' }}>
            <div className="eyebrow r" style={{ position: 'sticky', top: '6rem' }}>{t.home.propuestaKicker}</div>
            <div>
              <h2 className="r" style={{ marginBottom: '2rem' }}>{t.home.propuestaTitulo}</h2>
              <p className="lead r r-1" style={{ marginBottom: '2rem', fontSize: 'clamp(1.05rem, 1.8vw, 1.5rem)' }}>{t.home.propuestaCuerpo}</p>
              <p className="lead r r-2" style={{ color: 'var(--fg-dim)' }}>{t.home.sub}</p>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 800px) { .propuestaC-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      <HomeFrase />
      <HomeStats />
      <HomeMosaic />
      <HomeCases />
      <HomeServiciosScrollH />
      <HomeFilosofia />

      <section style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0', borderTop: '1px solid var(--fg-faint)' }}>
        <div style={{ padding: '0 var(--px)', marginBottom: '2rem' }}>
          <div className="eyebrow">{t.queHacemos.kickerClientes}</div>
        </div>
        <ClientesMarquee />
      </section>
      <HomeCTA />
    </div>
  );
}

Object.assign(window, { HomeA, HomeB, HomeC, HomeFrase, HomeCases, HomeMosaic, HomeStats, HomeServiciosScrollH, HomeFilosofia, HomeCTA, ClientesMarquee, hexToRgba });
