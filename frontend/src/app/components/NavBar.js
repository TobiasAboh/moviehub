

export default function NavBar() {
    return (
        <div className="fixed top-0 w-full flex justify-start bg-white/0 gap-10 backdrop-blur-md z-50 pl-5 py-4">
            <h1 className="text-4xl">Movie Hub</h1>
            <form className="flex justify-end w-[50%] rounded-2xl gap-4 text-black">
                <input type="text" placeholder="Search" className="w-full bg-white/50 rounded-2xl pl-4">
                </input>
                <button className="bg-gray-500 px-4 rounded-xl hover:bg-gray-600">Search</button>
            </form>
        </div>
    );
}