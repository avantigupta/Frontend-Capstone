import load from "../assets/icons/loader.gif"
import '../styles/loader.css'
const Loader = () => {
    return (
      <div className="loader-container">
        <img src={load} alt="Loading..." className="loader-gif" />
      </div>
    );
  };
  export default Loader;