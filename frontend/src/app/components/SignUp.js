import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

export default function SignUp({ toggleSignUp }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setLoggedIn } = useAuth();

  const handleSignUp = async () => {
    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });
      
      if (response.status === 200) {
        setLoggedIn(true);
        setUsername("");
        setEmail("");
        setPassword("");
        toggleSignUp(false);
      } else if (response.status === 409) {
        alert("User already exists");
        console.log(response)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50  flex flex-col items-center justify-center h-screen z-50">
      <div className="relative flex flex-col items-center w-[40%] h-[50%] bg-gray-500 rounded-2xl p-5 gap-5">
        <button
          onClick={() => toggleSignUp(false)}
          className="flex justify-content items-center hover:bg-gray-400 absolute top-2 right-2 rounded-full w-6 h-6"
        >
          <IoClose className="text-3xl" />
        </button>
        <h1 className="text-2xl text-white">Sign Up</h1>
        <p>
          Sign up to be able to save your favorite movies and get personalized
          recommendations
        </p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full rounded-2xl bg-white/50 p-2 text-sm text-black"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-2xl bg-white/50 p-2 text-sm text-black"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-2xl bg-white/50 p-2 text-sm text-black"
        />
        <button
          onClick={handleSignUp}
          className="bg-gray-300 w-fit px-2 py-1 rounded-lg text-black"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

