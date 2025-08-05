import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Login({ toggleLogin }) {
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const {setLoggedIn, setEmail} = useAuth();

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setLoggedIn(true);   
        toggleLogin(false);
        
        
      } else if (response.status === 401) {
        alert("Invalid username or password");
      }
    } catch (error) {
        console.log(error)
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50  flex flex-col items-center justify-center h-screen z-50">
      <div className="relative flex flex-col items-center w-[40%] h-[50%] bg-gray-500 rounded-2xl p-5 gap-5">
        <button
          onClick={() => toggleLogin(false)}
          className="flex justify-content items-center hover:bg-gray-400 absolute top-2 right-2 rounded-full w-6 h-6"
        >
          <IoClose className="text-3xl" />
        </button>
        <h1 className="text-2xl text-white">Login</h1>
        <p>
          Login to be able to save your favorite movies and get personalized
          recommendations
        </p>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="Username or email"
          className="w-full rounded-2xl bg-white/50 p-2 text-sm text-black"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-2xl bg-white/50 p-2 text-sm text-black"
        />
        <button onClick={handleLogin} className="bg-gray-300 w-fit px-2 py-1 rounded-lg text-black">
          Login
        </button>
      </div>
    </div>
  );
}
