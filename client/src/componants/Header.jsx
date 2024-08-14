import { Link } from "react-router-dom";
import chalkboard from "../assets/chalkboard.png";

export default function Header() {
  return (
    <header className="bg-slate-200 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/" className="flex items-center">
          <img src={chalkboard} alt="Logo" className="h-10 w-10 mr-2" />
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-700 text-xs font-serif">
              Shaping Minds,
              <br /> Creating Futures
            </span>
          </h1>
        </Link>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
