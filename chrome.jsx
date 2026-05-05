/* ─── Nav + Footer + Marquee ─── */

function Nav() {
  const { path, navigate } = useRouter();
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', on, { passive: true });
    on();
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setOpen(false); }, [path, lang]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const links = [
    { to: 'home', label: t.nav.home },
    { to: 'xomos', label: t.nav.xomos },
    { to: 'que-hacemos', label: t.nav.work },
    { to: 'contacto', label: t.nav.contact }
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''} ${open ? 'menu-open' : ''}`}>
        <Link to="home" className="nav-logo">
          <img src="xona/logo.png" alt="Xona" />
          <span className="dot"></span>
        </Link>
        <div className="nav-links">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={path === l.to ? 'is-active' : ''}>{l.label}</Link>
          ))}
        </div>
        <div className="nav-right">
          <div className="lang-switcher">
            {['ES','EN','IT'].map(l => (
              <button key={l} className={`lang-btn ${lang === l ? 'is-active' : ''}`} onClick={() => setLang(l)}>{l}</button>
            ))}
          </div>
          <button className={`menu-btn ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu">
            <span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="drawer-inner">
          <div className="mono dim" style={{ marginBottom: '2.5rem', fontSize: '0.65rem' }}>NAVIGATION</div>
          <ul className="drawer-links">
            {links.map((l, i) => (
              <li key={l.to} style={{ animationDelay: `${0.1 + i*0.06}s` }}>
                <Link to={l.to} className={path === l.to ? 'is-active' : ''}>
                  <span className="mono num">0{i+1}</span>
                  <span className="lbl">{l.label}</span>
                  <Arrow />
                </Link>
              </li>
            ))}
          </ul>
          <div className="drawer-footer">
            <a href={`mailto:${window.XONA.global.email}`} className="serif-it gold" style={{ fontSize: '1.4rem' }}>{window.XONA.global.email}</a>
            <div className="lang-switcher" style={{ marginTop: '1.5rem', justifyContent: 'flex-start' }}>
              {['ES','EN','IT'].map(l => (
                <button key={l} className={`lang-btn ${lang === l ? 'is-active' : ''}`} onClick={() => setLang(l)}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Footer() {
  const g = window.XONA.global;
  const { t } = useLang();
  const links = [
    { to: 'home', label: t.nav.home },
    { to: 'xomos', label: t.nav.xomos },
    { to: 'que-hacemos', label: t.nav.work },
    { to: 'contacto', label: t.nav.contact }
  ];
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>{t.footer.hablemos}</div>
          <div className="footer-big">
            <a href={`mailto:${g.email}`}>
              <span className="serif-it">{g.email}</span>
              <Arrow />
            </a>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem' }}>
            {Object.entries(g.redes).map(([k, v]) => (
              <a key={k} href={v} target="_blank" rel="noopener" className="mono dim">{k}</a>
            ))}
          </div>
        </div>
        <div>
          <h4>{t.common.site}</h4>
          <ul>
            {links.map(l => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4>{t.common.offices}</h4>
          <ul>
            {Object.entries(g.telefonos).map(([c, tel]) => (
              <li key={c}><span style={{ color: 'var(--fg-dim)' }}>{c}</span><br/><a href={`tel:${tel.replace(/\s/g,'')}`}>{tel}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>{t.common.whatWeDo}</h4>
          <ul>
            {window.XONA.servicios.map(s => (
              <li key={s.id}><Link to={`que-hacemos?s=${s.id}`}>{s.titulo}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="mono">© {new Date().getFullYear()} XONA — {t.footer.copyright}</span>
        <span className="mono">Buenos Aires · Bariloche · Santiago · Roma</span>
      </div>
    </footer>
  );
}

/* ─── Clientes marquee ─── */
function ClientesMarquee({ size = 'L' }) {
  const items = window.XONA.clientes;
  const sized = size === 'L'
    ? items.map((c,i) => i % 4 === 0 ? { c, serif: true } : { c, serif: false })
    : items.map((c) => ({ c, serif: false }));
  const Strip = () => (
    <div className="marquee-track">
      {sized.map((it, i) => (
        <span key={i} className={`marquee-item ${it.serif ? 'serif' : ''}`}>
          {it.c}
          <span className="dot"></span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" style={{ padding: '2rem 0' }}>
      <Strip /><Strip />
    </div>
  );
}

Object.assign(window, { Nav, Footer, ClientesMarquee });
