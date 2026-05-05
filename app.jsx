/* ─── APP ROOT ─── */

function PageRouter() {
  const { path } = useRouter();
  const [direction, setDirection] = useState(() => localStorage.getItem('xona-dir') || 'A');

  useReveal();

  useEffect(() => {
    const onStorage = () => {
      const d = localStorage.getItem('xona-dir') || 'A';
      setDirection(d);
    };
    const onTweak = (e) => {
      if (e.detail && e.detail.homeDir) {
        localStorage.setItem('xona-dir', e.detail.homeDir);
        setDirection(e.detail.homeDir);
      }
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('tweakchange', onTweak);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('tweakchange', onTweak);
    };
  }, []);

  const renderHome = () => {
    if (direction === 'B') return <HomeB />;
    if (direction === 'C') return <HomeC />;
    return <HomeA />;
  };

  let page;
  if (path === 'home' || !path) page = renderHome();
  else if (path === 'xomos') page = <PageXomos />;
  else if (path === 'que-hacemos') page = <PageQueHacemos />;
  else if (path === 'caso') page = <PageCaso />;
  else if (path === 'contacto') page = <PageContacto />;
  else page = renderHome();

  return <div key={path + direction} className="page is-active">{page}</div>;
}

function TweaksUI() {
  const { TweaksPanel, TweakSection, TweakRadio, useTweaks } = window;
  if (!TweaksPanel || !useTweaks) return null;
  const [t, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "homeDir": "A"
  }/*EDITMODE-END*/);
  const onChange = (v) => {
    setTweak('homeDir', v);
    localStorage.setItem('xona-dir', v);
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: { homeDir: v } }));
  };
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Home — Dirección visual">
        <TweakRadio
          label="Variante"
          value={t.homeDir}
          onChange={onChange}
          options={[
            { value: 'A', label: 'A · Editorial' },
            { value: 'B', label: 'B · Brutalist' },
            { value: 'C', label: 'C · Cinematic' },
          ]}
        />
      </TweakSection>
      <TweakSection title="Navegación">
        <div className="mono" style={{ fontSize: '0.65rem', color: 'rgba(242,238,232,0.55)', lineHeight: 1.7 }}>
          <div><a href="#/home" style={{ color: '#D4AF7A' }}>→ Home</a></div>
          <div><a href="#/xomos" style={{ color: '#D4AF7A' }}>→ Xomos</a></div>
          <div><a href="#/que-hacemos" style={{ color: '#D4AF7A' }}>→ Qué hacemos</a></div>
          <div><a href="#/caso?id=sapphire-2020" style={{ color: '#D4AF7A' }}>→ Caso (ejemplo)</a></div>
          <div><a href="#/contacto" style={{ color: '#D4AF7A' }}>→ Contacto</a></div>
        </div>
      </TweakSection>
    </TweaksPanel>
  );
}

function App() {
  return (
    <LangProvider>
      <RouterProvider>
        <ScrollProgress />
        <CustomCursor />
        <Nav />
        <main>
          <PageRouter />
        </main>
        <Footer />
        <TweaksUI />
      </RouterProvider>
    </LangProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
