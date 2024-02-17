import { useEffect } from "react";
import { Link } from "react-router-dom";
import { shuffle } from "lodash";
import logo from "@/assets/Logo.svg";
import classes from "./Home.module.css";

const welcome = shuffle([
  "Welcome",
  "Bienvenidas",
  "Bienvenue",
  "Willkommen",
  "Välkommen",
  "Hoş geldin",
  "Witaj",
  "مرحبا",
  "欢迎",
  "स्वागत हे",
  "ようこそ",
  "환영",
  "Chào mừng",
  "Welkom",
  "Karibu",
  "Mabuhay",
]).join("   ");

/** home page */
function Home() {
  /** set browser tab title */
  useEffect(() => {
    document.title = import.meta.env.VITE_TITLE;
  }, []);

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <svg className={classes.welcome} viewBox="-120 -120 240 240">
            <path
              id="welcome-circle"
              fill="none"
              d="M 0 -100 A 100 100 0 0 1 0 100 A 100 100 0 0 1 -17.365	-98.481"
            />
            <text>
              <textPath href="#welcome-circle" startOffset={1}>
                {welcome}
              </textPath>
            </text>
          </svg>
          <img className={classes.logo} src={logo} alt="" />
        </div>
        <h1 className={classes.title}>{import.meta.env.VITE_TITLE}</h1>
      </header>

      <main>
        <section data-narrow>
          <p>
            The home for translations of{" "}
            <a href="https://3blue1brown.com" target="_blank">
              3Blue1Brown
            </a>{" "}
            content. Help us by contributing, editing, and reviewing
            translations!
          </p>
        </section>

        <section data-narrow>
          <h2>Find a lesson</h2>

          <p>
            <Link to="/edit/basel-problem/french">Try example</Link>
          </p>
        </section>
      </main>
    </>
  );
}

export default Home;
