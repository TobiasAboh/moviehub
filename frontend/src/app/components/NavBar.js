"use client";
import { useState, useRef, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

import Profile from "./Profile";
import Login from "./Login";
import SignUp from "./SignUp";
import SearchOptions from "./SearchOptions";

export default function NavBar() {
  const { loggedIn } = useAuth();
  const [search, setSearch] = useState("");
  const [loginModal, setLoginModal] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [movies, setMovies] = useState([]);
  const searchContainerRef = useRef(null);

  const handleLogin = () => {
    setLoginModal(true);
  };
  const handleSignUp = () => {
    setSignUpModal(true);
  };
  const handleSearch = async (e) => {
    setSearch(e.target.value);
    try {
      const response = await fetch(
        `http://localhost:8080/search/multi?query=${e.target.value}`
      );
      if (response.ok) {
        const data = await response.json();
        setMovies(data);
        // console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeSearchOptions = () => {
    setShowRecommendations(false);
    setSearch("");
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowRecommendations(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  return (
    <div className="flex flex-col fixed top-0 z-50 w-full">
      <div className="relative w-full flex justify-start items-center bg-red-500/60 gap-5 md:gap-10 backdrop-blur-md pl-5 py-3">
        <a href="/">
          <h1 className="text-sm sm:text-md md:text-4xl">Movie Hub</h1>
        </a>
        <div className="relative flex flex-col w-[30%] sm:w-[40%] gap-2" ref={searchContainerRef}>
          <form className="flex justify-end w-full rounded-2xl gap-4 text-black">
            <div className="relative flex gap-2 w-full">
              <input
                type="text"
                onChange={(e) => handleSearch(e)}
                onFocus={() => setShowRecommendations(true)}
                value={search}
                placeholder="Search"
                className="w-full bg-white/50 rounded-2xl pl-4 py-2 text-xs md:text-base"
              ></input>
              <IoSearchSharp className="absolute right-2 top-1 md:top-2 text-black w-6 h-6" />
            </div>
          </form>
          {showRecommendations && search.length > 0 && (
            <SearchOptions movies={movies} closeOptions={closeSearchOptions} />
          )}
        </div>
        {loggedIn ? (
          <Profile />
        ) : (
          <div className="flex gap-4">
            <button
              onClick={handleLogin}
              className="bg-gray-500 p-2 text-xs md:text-base rounded-xl hover:bg-gray-400"
            >
              Log In
            </button>
            <button
              onClick={handleSignUp}
              className="bg-gray-500 p-2 text-xs md:text-base rounded-xl hover:bg-gray-400"
            >
              Sign Up
            </button>
          </div>
        )}
        {loginModal && <Login toggleLogin={setLoginModal} />}
        {signUpModal && <SignUp toggleSignUp={setSignUpModal} />}
      </div>
    </div>
  );
}