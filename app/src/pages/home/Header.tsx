import { FaGithub, FaScaleBalanced } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { shuffle } from "lodash";
import { repoFull, website } from "@/api";
import logo from "@/assets/Logo.svg";
import classes from "./Header.module.css";

/** decoration welcomes */
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
function Header() {
  return (
    <header className={classes.header}>
      <div className={classes.image}>
        {/* welcome decoration */}
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

        {/* logo */}
        <img className={classes.logo} src={logo} alt="" />
      </div>

      <div className={classes.title}>
        {/* site title */}
        <h1> {import.meta.env.VITE_TITLE}</h1>

        {/* hero description */}
        <div>
          Contribute, edit, and review translations of{" "}
          <Link to={website} target="_blank">
            3Blue1Brown
          </Link>{" "}
          content
        </div>

        {/* important links */}
        <nav className={classes.nav}>
          <Link
            to={`${repoFull}?tab=readme-ov-file#3blue1brown-captions`}
            target="_blank"
          >
            <FaScaleBalanced />
            Contribution Guidelines
          </Link>

          <Link to={`${repoFull}/issues`} target="_blank">
            <FaGithub />
            Help/Issues
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
