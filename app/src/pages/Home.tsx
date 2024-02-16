import { Link } from "react-router-dom";

/** home page */
function Home() {
  return (
    <>
      Home Page
      <br />
      <Link to="/edit/basel-problem/french">Try example</Link>
    </>
  );
}

export default Home;
