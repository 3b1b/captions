import classes from "./Header.module.css";

function Header() {
  return (
    <header>
      <div className={classes.video}></div>
      <div className={classes.text}>
        <h1 className="sr-only">{import.meta.env.VITE_TITLE}</h1>

        <div className={classes.row}>
          <h2>Video Name</h2>
          <span>French</span>
        </div>

        <nav className={classes.row}>
          <a href="https://github.com/3b1b/captions" target="_blank">
            Captions Home
          </a>
        </nav>

        <div className={classes.row}>
          <span>Unreviewed</span>
          <span>Sticky header/footer</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
