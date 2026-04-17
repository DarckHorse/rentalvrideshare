function PageShell({ title, subtitle, children, footerNote }) {
  return (
    <div className="page">
      <div className="shell">
        <header className="hero">
          <h1 className="title">{title}</h1>
          <p className="subtitle">{subtitle}</p>
        </header>

        {children}

        {footerNote ? <p className="footer-note">{footerNote}</p> : null}
      </div>
    </div>
  );
}

export default PageShell;