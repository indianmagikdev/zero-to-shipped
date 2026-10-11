export default function Header() {
  return (
    <header className="site-header">
      <div className="logo">
        0<span className="arrow">→</span>Shipped <span className="logo-sub">Resume Parser</span>
      </div>
      <nav>
        <a href="#how">How it works</a>
        <a href="#analyze" className="nav-cta">Try it</a>
      </nav>
    </header>
  );
}
