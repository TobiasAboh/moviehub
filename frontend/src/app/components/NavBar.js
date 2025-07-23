"use client";
import { useState } from "react"
import Login from "./Login";
import SignUp from "./SignUp";
import { IoSearchSharp } from "react-icons/io5";


export default function NavBar() {
    const [loginModal, setLoginModal] = useState(false);
    const [signUpModal, setSignUpModal] = useState(false);
    const handleLogin = () => {
        setLoginModal(true);
    }
    const handleSignUp = () => {
        setSignUpModal(true);
    }
  return (
    <div className="fixed top-0 w-full flex justify-start items-center bg-red-500/60 gap-5 md:gap-10 backdrop-blur-md z-50 pl-5 py-3">
      <h1 className="text-sm sm:text-md md:text-4xl">Movie Hub</h1>
      <form className="flex justify-end w-[30%] sm:w-[40%] rounded-2xl gap-4 text-black">
        <div className="relative flex gap-2 w-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white/50 rounded-2xl pl-4 py-2 text-xs md:text-base"
          ></input>
          <IoSearchSharp className="absolute right-2 top-1 md:top-2 text-black w-6 h-6" />
        </div>
      </form>
      <div className="flex gap-4">
        <button onClick={handleLogin} className="bg-gray-500 p-2 text-xs md:text-base rounded-xl hover:bg-gray-400">
          Log In
        </button>
        <button onClick={handleSignUp} className="bg-gray-500 p-2 text-xs md:text-base rounded-xl hover:bg-gray-400">
          Sign Up
        </button>
      </div>
      {loginModal && <Login toggleLogin={setLoginModal} />}
      {signUpModal && <SignUp toggleSignUp={setSignUpModal} />}
    </div>
    
  );
}
