"use client";
import { useState, useRef, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

import Profile from "./Profile";
import Login from "./Login";
import SignUp from "./SignUp";
import SearchOptions from "./SearchOptions";

const NavLinks = () => {
  const router = useRouter();
  const pathname = usePathname();
  const hoverStyle =
    "hover:scale-110 hover:cursor-pointer p-1 transition-all duration-100";
  const activeStyle =
    "scale-110 cursor-pointer p-1 shadow-md shadow-white transition-all duration-100";
  const [activeTab, setActiveTab] = useState("Movies");

  const scrollToSection = (sectionId) => {
    console.log(`Attempting to scroll to section: ${sectionId}`);
    const element = document.getElementById(sectionId);
    if (element) {
      console.log(`Found element, scrolling to: ${sectionId}`);
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.log(`Element not found: ${sectionId}`);
      // Try again after a short delay
      setTimeout(() => {
        const retryElement = document.getElementById(sectionId);
        if (retryElement) {
          console.log(`Found element on retry, scrolling to: ${sectionId}`);
          retryElement.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          console.log(`Element still not found on retry: ${sectionId}`);
        }
      }, 500);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // Check if we're on the homepage
    const isHomepage = pathname === "/";

    if (tab === "Movies") {
      if (isHomepage) {
        // If on homepage, just scroll to section
        scrollToSection("movies-section");
      } else {
        // If not on homepage, store scroll target and navigate
        localStorage.setItem("scrollTo", "movies-section");
        // Small delay to ensure localStorage is set
        setTimeout(() => {
          router.push("/");
        }, 10);
      }
    }
    if (tab === "TV Shows") {
      if (isHomepage) {
        // If on homepage, just scroll to section
        scrollToSection("tv-section");
      } else {
        // If not on homepage, store scroll target and navigate
        localStorage.setItem("scrollTo", "tv-section");
        // Small delay to ensure localStorage is set
        setTimeout(() => {
          router.push("/");
        }, 10);
      }
    }
    if (tab === "Liked") {
      router.push("/content/liked");
    }
    if (tab === "Watchlist") {
      router.push("/content/watchlist");
    }
    if (tab === "Watched") {
      router.push("/content/watched");
    }
  };

  // Handle scroll target from localStorage when navigating to homepage
  useEffect(() => {
    if (pathname === "/" && typeof window !== "undefined") {
      const scrollTarget = localStorage.getItem("scrollTo");
      if (scrollTarget) {
        console.log(
          `Homepage loaded, attempting to scroll to: ${scrollTarget}`
        );
        localStorage.removeItem("scrollTo"); // Clear the target

        // Use a more robust approach with multiple attempts
        let attempts = 0;
        const maxAttempts = 10;

        const attemptScroll = () => {
          attempts++;
          console.log(`Scroll attempt ${attempts} for: ${scrollTarget}`);

          const element = document.getElementById(scrollTarget);
          if (element) {
            console.log(`Found element, scrolling to: ${scrollTarget}`);
            // Use a small delay to ensure the page is fully rendered
            setTimeout(() => {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
            return true;
          } else {
            console.log(
              `Element not found on attempt ${attempts}: ${scrollTarget}`
            );
            if (attempts < maxAttempts) {
              // Try again with increasing delays
              setTimeout(attemptScroll, attempts * 200);
            } else {
              console.log(
                `Max attempts reached, giving up on: ${scrollTarget}`
              );
            }
          }
          return false;
        };

        // Start the first attempt
        attemptScroll();
      }
    }
  }, [pathname]);

  // Handle hash navigation when page loads
  useEffect(() => {
    if (pathname === "/" && typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        // Wait for the page to fully load and sections to render
        const checkAndScroll = () => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            return true;
          }
          return false;
        };

        // Try immediately
        if (!checkAndScroll()) {
          // If not found, try again after a delay
          setTimeout(() => {
            if (!checkAndScroll()) {
              // If still not found, try one more time with longer delay
              setTimeout(checkAndScroll, 500);
            }
          }, 200);
        }
      }
    }
  }, [pathname]);

  return (
    <div className="hidden lg:flex lg:gap-4">
      <a
        onClick={() => handleTabClick("Movies")}
        className={activeTab === "Movies" ? activeStyle : hoverStyle}
      >
        Movies
      </a>
      <a
        onClick={() => handleTabClick("TV Shows")}
        className={activeTab === "TV Shows" ? activeStyle : hoverStyle}
      >
        TV Shows
      </a>
      <a
        onClick={() => handleTabClick("Watchlist")}
        className={activeTab === "Watchlist" ? activeStyle : hoverStyle}
      >
        Watchlist
      </a>
      <a
        onClick={() => handleTabClick("Liked")}
        className={activeTab === "Liked" ? activeStyle : hoverStyle}
      >
        Liked
      </a>
      <a
        onClick={() => handleTabClick("Watched")}
        className={activeTab === "Watched" ? activeStyle : hoverStyle}
      >
        Watched
      </a>
    </div>
  );
};

export default function NavBar() {
  const { loggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [loginModal, setLoginModal] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [movies, setMovies] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  };

  const handleTabClick = (tab) => {
    // Check if we're on the homepage
    const isHomepage = pathname === "/";

    if (tab === "Movies") {
      if (isHomepage) {
        // If on homepage, just scroll to section
        const element = document.getElementById("movies-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        // If not on homepage, store scroll target and navigate
        localStorage.setItem("scrollTo", "movies-section");
        setTimeout(() => {
          router.push("/");
        }, 10);
      }
    }
    if (tab === "TV Shows") {
      if (isHomepage) {
        // If on homepage, just scroll to section
        const element = document.getElementById("tv-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        // If not on homepage, store scroll target and navigate
        localStorage.setItem("scrollTo", "tv-section");
        setTimeout(() => {
          router.push("/");
        }, 10);
      }
    }
    if (tab === "Watchlist") {
      router.push("/content/watchlist");
    }
    if (tab === "Liked") {
      router.push("/content/liked");
    }
    if (tab === "Watched") {
      router.push("/content/watched");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
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
          <h1 className="text-lg sm:text-md md:text-4xl">Movie Hub</h1>
        </a>
        <div
          className="relative flex flex-col w-[50%] sm:w-[40%] gap-2"
          ref={searchContainerRef}
        >
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
        <NavLinks />
        {loggedIn ? (
          <Profile onProfileClick={() => setSidebarOpen(true)} />
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

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-white hover:text-gray-300"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col p-4 space-y-4 bg-gray-500">
                  <button
                    onClick={() => {
                      handleTabClick("Movies");
                      setSidebarOpen(false);
                    }}
                    className="text-left text-white hover:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Movies
                  </button>
                  <button
                    onClick={() => {
                      handleTabClick("TV Shows");
                      setSidebarOpen(false);
                    }}
                    className="text-left text-white hover:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    TV Shows
                  </button>
                  <button
                    onClick={() => {
                      handleTabClick("Watchlist");
                      setSidebarOpen(false);
                    }}
                    className="text-left text-white hover:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Watchlist
                  </button>
                  <button
                    onClick={() => {
                      handleTabClick("Liked");
                      setSidebarOpen(false);
                    }}
                    className="text-left text-white hover:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Liked
                  </button>
                  <button
                    onClick={() => {
                      handleTabClick("Watched");
                      setSidebarOpen(false);
                    }}
                    className="text-left text-white hover:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Watched
                  </button>
                </div>

                {/* Profile Section */}
                <div className="mt-auto p-4 border-t border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-400">
                      T
                    </div>
                    <div>
                      <p className="text-white font-medium">User</p>
                      <p className="text-gray-400 text-sm">user@example.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {loginModal && <Login toggleLogin={setLoginModal} />}
        {signUpModal && <SignUp toggleSignUp={setSignUpModal} />}
      </div>
    </div>
  );
}
