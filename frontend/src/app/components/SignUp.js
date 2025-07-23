import { IoClose } from "react-icons/io5";


export default function SignUp({toggleSignUp}) {
    return (
        <div className="fixed inset-0 bg-black/50  flex flex-col items-center justify-center h-screen z-50">
            <div className="relative flex flex-col items-center w-[40%] h-[50%] bg-gray-500 rounded-2xl p-5 gap-5">
                <button onClick={() => toggleSignUp(false)} className="flex justify-content items-center hover:bg-gray-400 absolute top-2 right-2 rounded-full w-6 h-6">
                    <IoClose className="text-3xl" />
                </button>
                <h1 className="text-2xl text-white">Sign Up</h1>
                <p>Sign up to be able to save your favorite movies and get personalized recommendations</p>
                <input type="text" placeholder="Username" className="w-full rounded-2xl bg-white/50 p-2 text-sm text-black" />
                <input type="email" placeholder="Email" className="w-full rounded-2xl bg-white/50 p-2 text-sm text-black" />
                <input type="password" placeholder="Password" className="w-full rounded-2xl bg-white/50 p-2 text-sm text-black" />
                <button className="bg-gray-300 w-fit px-2 py-1 rounded-lg text-black">Sign Up</button>
            </div>
        </div>
    );
}