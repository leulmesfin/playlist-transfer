import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
export default function Root() {

  const spotifyLoginRedirect = async() => {
    console.log("Hello Leul");
    try {
      const response = await fetch("http://localhost:8080/api/login");
      const url = await response.text();
      console.log("url: ", url);
      window.location.replace(url); // redirect user to spotify login page
    } catch (error) {
      console.log("error is happening")
      console.log(error);
    }
  }

  return (
    <div className="homeLayout">
      <h1>Music Transfer</h1>
      <button onClick={() =>spotifyLoginRedirect()}>Get Started <FontAwesomeIcon size="lg" icon={faSpotify} /></button>
    </div>
  );
}