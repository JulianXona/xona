/* ─── PÁGINAS INTERNAS ─── */

function PageHero({ eyebrow, title, sub, accent }) {
  return (
    <section className="section-pad" style={{ paddingTop: 'clamp(7rem, 14vw, 12rem)', paddingBottom: 'clamp(2.5rem, 6vw, 5rem)' }}>
      <div className="maxw">
        <div className="eyebrow r" style={{ marginBottom: '1.5rem' }}>{eyebrow}</div>
        <h1 className="r r-1" style={{ maxWidth: '14ch', fontSize: 'clamp(2.4rem, 9vw, 8rem)' }}>
          {Array.isArray(title) ? title.map((line, i) => (
            <span key={i}>
              {i === title.length - 1 && accent ? <em className="serif-it gold">{line}</em> : line}
              {i < title.length - 1 && <br/>}
            </span>
          )) : title}
        </h1>
        {sub && <p className="lead r r-2" style={{ marginTop: '1.5rem' }}>{sub}</p>}
      </div>
    </section>
  );
}

/* ─── XOMOS ─── */
function PageXomos() {
  const { t } = useLang();
  const x = t.xomos;
  return (
    <div>
      <PageHero eyebrow={x.eyebrow} title={x.titulo} sub={x.sub} accent />

      {/* Big number */}
      <section className="section-pad" style={{ borderTop: '1px solid var(--fg-faint)', borderBottom: '1px solid var(--fg-faint)', textAlign: 'center', padding: 'clamp(3rem, 9vw, 7rem) var(--px)' }}>
        <div className="r" style={{ fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: 'clamp(7rem, 22vw, 18rem)', lineHeight: '0.85', color: 'transparent', WebkitTextStroke: '1px var(--gold)', fontWeight: 400 }}>20</div>
        <div className="mono r r-1" style={{ marginTop: '1rem', color: 'var(--fg-dim)' }}>{x.bigNumLabel}</div>
      </section>

      {/* Cultura */}
      <section className="section-pad">
        <div className="maxw">
          <div className="r" style={{ marginBottom: '2.5rem' }}>
            <div className="eyebrow" style={{ marginBottom: '1rem' }}>{x.culturaKicker}</div>
            <h2 className="serif-it" style={{ maxWidth: '24ch', color: 'var(--fg-dim)', fontSize: 'clamp(1.4rem, 3.5vw, 2.6rem)' }}>{x.pregunta}</h2>
          </div>
          <div className="valores-grid">
            {x.valores.map((v, i) => (
              <div key={v.n} className="r valor-cell" style={{ transitionDelay: `${i*0.08}s` }}>
                <div className="mono gold" style={{ marginBottom: '1.2rem' }}>{v.n}</div>
                <h3 style={{ marginBottom: '0.8rem' }}>{v.t}</h3>
                <p className="dim" style={{ fontSize: '0.95rem' }}>{v.d}</p>
              </div>
            ))}
          </div>
          <div className="r" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <p className="serif-it gold" style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)' }}>" {x.cita} "</p>
          </div>
        </div>
        <style>{`
          .valores-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--fg-faint); border: 1px solid var(--fg-faint); }
          .valor-cell { background: var(--bg); padding: clamp(1.3rem, 4vw, 2.5rem); transition: background .4s, opacity .9s, transform .9s; }
          .valor-cell:hover { background: var(--bg-2); }
          @media (max-width: 800px) { .valores-grid { grid-template-columns: 1fr 1fr; } }
          @media (max-width: 480px) { .valores-grid { grid-template-columns: 1fr; } }
        `}</style>
      </section>

      {/* Historia */}
      <section className="section-pad" style={{ background: 'var(--bg-2)' }}>
        <div className="maxw historia-grid">
          <div className="r r-1" style={{ aspectRatio: '4/3' }}>
            <Img src={window.XONA.imagenes.xomos.portada} ratio="4/3" treatment="cinematic" parallax caption="EQUIPO · 2025" />
          </div>
          <div>
            <div className="eyebrow r" style={{ marginBottom: '1.2rem' }}>{x.historia.kicker}</div>
            <h2 className="r r-1" style={{ marginBottom: '1.5rem' }}>
              {x.historia.titulo.split('.')[0]}.<br/>
              <span className="serif-it gold">{x.historia.titulo.split('.')[1]}.</span>
            </h2>
            <p className="lead r r-2" style={{ marginBottom: '1.8rem' }}>{x.historia.cuerpo}</p>
            <Link to="que-hacemos" className="btn r r-3">{t.common.whatWeDo} <Arrow /></Link>
          </div>
        </div>
        <style>{`
          .historia-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 6vw, 6rem); align-items: center; }
          @media (max-width: 800px) { .historia-grid { grid-template-columns: 1fr; } }
        `}</style>
      </section>

      <HomeCTA />
    </div>
  );
}

/* ─── QUÉ HACEMOS ─── */
function PageQueHacemos() {
  const { query } = useRouter();
  const { t } = useLang();
  const focusId = query.s;
  const servicios = window.XONA.servicios;
  const casos = window.XONA.casos;
  const tags = ['todos', ...new Set(casos.flatMap(c => c.tags))];
  const [filter, setFilter] = useState('todos');
  const filtered = filter === 'todos' ? casos : casos.filter(c => c.tags.includes(filter));

  return (
    <div>
      <PageHero eyebrow={t.queHacemos.eyebrow} title={t.queHacemos.titulo} accent sub={t.queHacemos.sub} />

      {/* Servicios — listing detallado */}
      <section className="section-pad">
        <div className="maxw">
          <div className="eyebrow r" style={{ marginBottom: '1.5rem' }}>{t.queHacemos.kickerDisciplinas}</div>
          <div className="services-stack">
            {servicios.map((s, i) => {
              const img = window.XONA.imagenes.servicios[s.id];
              return (
                <div key={s.id} className={`service-block r ${focusId === s.id ? 'focused' : ''}`} style={{ transitionDelay: `${i*0.06}s` }}>
                  <div className="service-block-meta">
                    <div className="mono gold">{s.n} / 0{servicios.length}</div>
                  </div>
                  <div className="service-block-title">
                    <h2>{s.titulo}</h2>
                    <p className="lead" style={{ marginTop: '0.8rem', marginBottom: '1.2rem' }}>{s.bajada}</p>
                    {img && (
                      <div style={{ aspectRatio: '4/3', marginTop: '0.8rem' }}>
                        <Img src={img} ratio="4/3" treatment="cinematic" caption={s.titulo.toUpperCase()} />
                      </div>
                    )}
                  </div>
                  <div className="service-block-items">
                    {s.items.map((it, j) => (
                      <div key={j} className="service-item">
                        <span className="mono dim">{String(j+1).padStart(2,'0')}</span>
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <style>{`
          .services-stack { border-top: 1px solid var(--fg-faint); }
          .service-block {
            display: grid; grid-template-columns: 80px 1fr 1.2fr; gap: 2rem;
            padding: clamp(1.8rem, 5vw, 4rem) 0;
            border-bottom: 1px solid var(--fg-faint);
            align-items: flex-start;
            transition: background .4s, opacity .9s, transform .9s;
          }
          .service-block:hover, .service-block.focused { background: linear-gradient(to right, var(--gold-soft), transparent 50%); }
          .service-block-title h2 { font-size: clamp(1.5rem, 3.8vw, 2.8rem); }
          .service-block-items { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
          .service-item { display: flex; gap: 0.8rem; padding: 0.55rem 0; border-bottom: 1px solid var(--fg-faint); font-size: 0.85rem; color: var(--fg-dim); }
          @media (max-width: 800px) {
            .service-block { grid-template-columns: 1fr; gap: 1rem; }
            .service-block-items { grid-template-columns: 1fr; }
          }
        `}</style>
      </section>

      {/* Casos */}
      <section className="section-pad" style={{ background: 'var(--bg-2)' }}>
        <div className="maxw">
          <div className="flex between" style={{ alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="r">
              <div className="eyebrow" style={{ marginBottom: '1rem' }}>{t.queHacemos.work}</div>
              <h2>{t.queHacemos.casosTitulo}</h2>
            </div>
          </div>
          <div className="filtros r" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {tags.map(tg => (
              <button key={tg} className={`filtro-btn ${filter === tg ? 'is-active' : ''}`} onClick={() => setFilter(tg)}>
                {tg === 'todos' ? t.queHacemos.todos : tg}
              </button>
            ))}
          </div>
          <div className="cases-grid">
            {filtered.map((c, i) => (
              <Link key={c.id} to={`caso?id=${c.id}`} className="case-card r" style={{ transitionDelay: `${(i%3)*0.08}s` }} data-cursor-hover>
                <div style={{ aspectRatio: '4/5', position: 'relative' }}>
                  <Img src={c.hero} ratio="4/5" treatment="cinematic" />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: c.color, zIndex: 4 }}></div>
                </div>
                <div className="case-card-info">
                  <div className="mono gold">{c.cliente} · {c.year}</div>
                  <h3 style={{ marginTop: '0.5rem' }}>{c.titulo}</h3>
                  <div className="tag-list" style={{ marginTop: '0.8rem' }}>
                    {c.tags.map(tg => <span key={tg} className="tag">{tg}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <style>{`
          .filtro-btn { font-family: var(--f-mono); font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; padding: 0.5rem 0.9rem; border: 1px solid var(--fg-faint); border-radius: 999px; color: var(--fg-mute); transition: all .3s; cursor: pointer; }
          .filtro-btn:hover { color: var(--fg); border-color: var(--gold-line); }
          .filtro-btn.is-active { color: var(--bg); background: var(--gold); border-color: var(--gold); }
          .cases-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1rem, 2vw, 2rem); }
          .case-card { display: flex; flex-direction: column; gap: 1rem; transition: opacity .9s, transform .9s; }
          @media (max-width: 900px) { .cases-grid { grid-template-columns: 1fr 1fr; } }
          @media (max-width: 560px) { .cases-grid { grid-template-columns: 1fr; } }
        `}</style>
      </section>

      <section style={{ padding: 'clamp(2.5rem, 6vw, 5rem) 0', borderTop: '1px solid var(--fg-faint)' }}>
        <div style={{ padding: '0 var(--px)', marginBottom: '1.5rem' }}>
          <div className="eyebrow">{t.queHacemos.kickerClientes}</div>
        </div>
        <ClientesMarquee />
      </section>

      <HomeCTA />
    </div>
  );
}

/* ─── CASO ─── */
function PageCaso() {
  const { query } = useRouter();
  const { t } = useLang();
  const casos = window.XONA.casos;
  const idx = casos.findIndex(c => c.id === query.id);
  const caso = idx >= 0 ? casos[idx] : casos[0];
  const prev = idx > 0 ? casos[idx-1] : null;
  const next = idx < casos.length - 1 ? casos[idx+1] : null;

  return (
    <div>
      <section style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'flex-end', padding: 'clamp(7rem, 14vw, 11rem) var(--px) clamp(2.5rem, 6vw, 5rem)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Img src={caso.hero} treatment="cinematic" parallax style={{ width: '100%', height: '100%' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.35) 50%, rgba(10,10,10,0.95) 100%)`, zIndex: 1 }}></div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: caso.color, zIndex: 1 }}></div>
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
          <div className="mono dim" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="home">{t.nav.home}</Link><span className="gold">·</span>
            <Link to="que-hacemos">{t.caso.casos}</Link><span className="gold">·</span>
            <span>{caso.titulo}</span>
          </div>
          <div className="eyebrow r" style={{ marginBottom: '1rem' }}>{caso.cliente} · {caso.year}</div>
          <h1 className="r r-1" style={{ fontSize: 'clamp(2.2rem, 8vw, 7rem)' }}>{caso.titulo}</h1>
          <div className="tag-list r r-2" style={{ marginTop: '1.5rem' }}>
            {caso.tags.map(tg => <span key={tg} className="tag">{tg}</span>)}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="maxw caso-body-grid">
          <div>
            <h2 className="r" style={{ marginBottom: '1.5rem', fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)' }}>{caso.corta}</h2>
            <p className="lead r r-1" style={{ marginBottom: '1.8rem' }}>{caso.larga}</p>
            <div className="r r-2" style={{ marginTop: '2.5rem', aspectRatio: '16/9' }}>
              <Img src={caso.gallery[0]} ratio="16/9" treatment="cinematic" parallax caption={`${caso.cliente.toUpperCase()} · CASE FILM`} />
            </div>
            <div className="caso-making" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginTop: '2px' }}>
              <div className="r" style={{ aspectRatio: '4/3' }}>
                <Img src={caso.gallery[1]} ratio="4/3" treatment="cinematic" caption="MAKING OF · 01" />
              </div>
              <div className="r" style={{ aspectRatio: '4/3' }}>
                <Img src={caso.gallery[2]} ratio="4/3" treatment="cinematic" caption="MAKING OF · 02" />
              </div>
            </div>
          </div>
          <aside className="caso-aside">
            <div className="sidebar-card r">
              <div className="mono gold" style={{ marginBottom: '0.6rem' }}>{t.caso.cliente}</div>
              <div style={{ fontSize: '1.05rem' }}>{caso.cliente}</div>
            </div>
            <div className="sidebar-card r r-1">
              <div className="mono gold" style={{ marginBottom: '0.6rem' }}>{t.caso.ano}</div>
              <div style={{ fontSize: '1.05rem' }}>{caso.year}</div>
            </div>
            <div className="sidebar-card r r-2">
              <div className="mono gold" style={{ marginBottom: '0.6rem' }}>{t.caso.disciplinas}</div>
              <div className="tag-list">{caso.tags.map(tg => <span key={tg} className="tag">{tg}</span>)}</div>
            </div>
            <div className="sidebar-card r r-3" style={{ background: 'var(--bg-2)' }}>
              <div className="mono gold" style={{ marginBottom: '0.6rem' }}>{t.caso.juntos}</div>
              <p className="dim" style={{ fontSize: '0.88rem', marginBottom: '1rem' }}>{t.caso.juntosCuerpo}</p>
              <Link to="contacto" className="btn" style={{ width: '100%', justifyContent: 'center' }}>{t.common.contact} <Arrow /></Link>
            </div>
          </aside>
        </div>
        <style>{`
          .caso-body-grid { display: grid; grid-template-columns: 2fr 1fr; gap: clamp(2rem, 6vw, 6rem); align-items: flex-start; }
          .caso-aside { position: sticky; top: 6rem; display: flex; flex-direction: column; gap: 1rem; }
          .sidebar-card { padding: 1.3rem; border: 1px solid var(--fg-faint); transition: opacity .9s, transform .9s, border-color .3s; }
          .sidebar-card:hover { border-color: var(--gold-line); }
          @media (max-width: 900px) {
            .caso-body-grid { grid-template-columns: 1fr; }
            .caso-aside { position: static; }
          }
          @media (max-width: 560px) {
            .caso-making { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      <section className="section-pad" style={{ borderTop: '1px solid var(--fg-faint)' }}>
        <div className="maxw" style={{ display: 'grid', gridTemplateColumns: prev && next ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
          {prev && (
            <Link to={`caso?id=${prev.id}`} className="prevnext">
              <div className="mono dim">← {t.caso.anterior}</div>
              <h3 className="serif-it gold" style={{ marginTop: '0.4rem' }}>{prev.titulo}</h3>
            </Link>
          )}
          {next && (
            <Link to={`caso?id=${next.id}`} className="prevnext" style={{ textAlign: 'right' }}>
              <div className="mono dim">{t.caso.siguiente} →</div>
              <h3 className="serif-it gold" style={{ marginTop: '0.4rem' }}>{next.titulo}</h3>
            </Link>
          )}
        </div>
        <style>{`
          .prevnext { padding: 1.5rem; border: 1px solid var(--fg-faint); transition: background .3s, border-color .3s; }
          .prevnext:hover { background: var(--bg-2); border-color: var(--gold-line); }
        `}</style>
      </section>
    </div>
  );
}

/* ─── CONTACTO ─── */
function PageContacto() {
  const g = window.XONA.global;
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 4000); };
  return (
    <div>
      <section className="contacto-wrap">
        <div className="contacto-left">
          <div>
            <div className="eyebrow r" style={{ marginBottom: '1.5rem' }}>{t.contacto.eyebrow}</div>
            <h1 className="r r-1" style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)', marginBottom: '1.5rem' }}>
              {t.contacto.titulo[0]}<br/>
              <span className="serif-it gold">{t.contacto.titulo[1]}</span>
            </h1>
            <p className="lead r r-2">{t.contacto.sub}</p>
          </div>
          <div className="r r-2 contacto-info">
            <a href={`mailto:${g.email}`} className="serif-it gold contacto-mail">
              {g.email} <Arrow />
            </a>
            <div className="contacto-phones">
              {Object.entries(g.telefonos).map(([c, tel]) => (
                <div key={c}>
                  <div className="mono gold" style={{ marginBottom: '0.3rem' }}>{c.toUpperCase()}</div>
                  <a href={`tel:${tel.replace(/\s/g,'')}`} className="dim" style={{ fontSize: '0.88rem' }}>{tel}</a>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1.2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              {Object.entries(g.redes).map(([k, v]) => (
                <a key={k} href={v} target="_blank" rel="noopener" className="mono dim">{k}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="contacto-right">
          <h2 className="r" style={{ marginBottom: '2rem', fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>{t.contacto.empecemos}</h2>
          <form onSubmit={submit} className="r r-1" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="form-row">
              <div className="field"><label>{t.contacto.nombre}</label><input required placeholder={t.contacto.nombrePh} /></div>
              <div className="field"><label>{t.contacto.empresa}</label><input placeholder={t.contacto.empresaPh} /></div>
            </div>
            <div className="form-row">
              <div className="field"><label>Email</label><input type="email" required placeholder="tu@email.com" /></div>
              <div className="field"><label>{t.contacto.telefono}</label><input placeholder="+54 9 11..." /></div>
            </div>
            <div className="field">
              <label>{t.contacto.necesitas}</label>
              <select>
                <option>{t.contacto.seleccionar}</option>
                {window.XONA.servicios.map(s => <option key={s.id}>{s.titulo}</option>)}
                <option>{t.contacto.otro}</option>
              </select>
            </div>
            <div className="field"><label>{t.contacto.proyecto}</label><textarea rows="3" placeholder={t.contacto.proyectoPh}></textarea></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
              <span className="mono dim" style={{ fontSize: '0.62rem' }}>{sent ? `✓ ${t.contacto.enviado}` : t.contacto.privacidad}</span>
              <button type="submit" className="btn solid">{t.contacto.enviar} <Arrow /></button>
            </div>
          </form>
        </div>
      </section>
      <style>{`
        .contacto-wrap { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
        .contacto-left { padding: clamp(6rem, 12vw, 11rem) var(--px) 2.5rem; border-right: 1px solid var(--fg-faint); display: flex; flex-direction: column; justify-content: space-between; gap: 3rem; background: linear-gradient(135deg, var(--gold-soft), transparent 70%); }
        .contacto-right { padding: clamp(6rem, 12vw, 11rem) var(--px) 2.5rem; display: flex; flex-direction: column; justify-content: center; }
        .contacto-mail { font-size: clamp(1.3rem, 3vw, 2.2rem); display: inline-flex; gap: 0.5rem; align-items: center; margin-bottom: 2.5rem; word-break: break-all; }
        .contacto-phones { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        @media (max-width: 900px) {
          .contacto-wrap { grid-template-columns: 1fr; }
          .contacto-left { border-right: none; border-bottom: 1px solid var(--fg-faint); }
        }
        @media (max-width: 560px) {
          .form-row { grid-template-columns: 1fr; gap: 0.5rem; }
          .contacto-phones { grid-template-columns: 1fr 1fr; gap: 0.8rem; }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { PageXomos, PageQueHacemos, PageCaso, PageContacto });
