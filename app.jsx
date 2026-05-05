/* ─── APP ROOT ─── */

function PageRouter() {
  const { path } = useRouter();

  useReveal();

  let page;
  if (path === 'home' || !path) page = <HomeA />;
  else if (path === 'xomos') page = <PageXomos />;
  else if (path === 'works') page = <PageWorks />;
  else if (path === 'que-hacemos') page = <PageQueHacemos />;
  else if (path === 'caso') page = <PageCaso />;
  else if (path === 'contacto') page = <PageContacto />;
  else page = <HomeA />;

  return <div key={path} className="page is-active">{page}</div>;
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
      </RouterProvider>
    </LangProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
