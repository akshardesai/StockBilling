import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import "./index.css";
import { account } from "./utils/appWrite";

function Layout() {
  const [isOpen, setIsOpen] = useState(
    window.matchMedia("(min-width: 1024px)").matches
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const toggleSlider = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Delete the current session
      await account.deleteSession('current');
      
      console.log('✅ Logout successful');
      
      // Redirect to login page
      navigate('/login');
      
    } catch (err) {
      console.error('❌ Logout failed:', err.message);
      alert("Logout failed: " + err.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <aside className="slider fixed top-0 z-50">
        <div
          id="slider-container"
          className={`slider__container w-10 h-screen bg-black transition-transform duration-500 ease-in-out relative ${
            isOpen ? "translate-x-0" : "-translate-x-10"
          }`}
        >
          <ul className="slider__links w-full h-full flex flex-col justify-center items-center gap-16">
            <li className="px-2 py-1 bg-neutral-900 rounded-full flex items-center justify-center">
              <NavLink
                to="dashboard"
                className={({ isActive }) =>
                  isActive ? "text-[#D7FF9C]" : "text-white hover:text-[#d7ff9c]"
                }
              >
                <i className="ri-edit-2-line"></i>
              </NavLink>
            </li>
            <li className="px-2 py-1 bg-neutral-900 rounded-full flex items-center justify-center">
              <NavLink
                to="bills"
                className={({ isActive }) =>
                  isActive ? "text-[#d7ff9c]" : "text-white hover:text-[#d7ff9c]"
                }
              >
                <i className="ri-survey-line"></i>
              </NavLink>
            </li>
            <li className="px-2 py-1 bg-neutral-900 rounded-full flex items-center justify-center">
              <NavLink
                to="stock"
                className={({ isActive }) =>
                  isActive ? "text-[#d7ff9c]" : "text-white hover:text-[#d7ff9c]"
                }
              >
                <i className="ri-truck-line"></i>
              </NavLink>
            </li>
            <li className="px-2 py-1  bg-neutral-900 rounded-full flex items-center justify-center">
              <NavLink
                to="logs"
                className={ ({ isActive }) =>
                  isActive ? "text-[#d7ff9c]" : "text-white hover:text-[#d7ff9c]" 
                }
              >
                <i className="ri-hourglass-2-fill"></i>
              </NavLink>
            </li>
            <li className="px-2 py-1 bg-neutral-900 rounded-full flex items-center justify-center">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`text-white hover:text-red-400 transition-colors ${
                  isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                title="Logout"
              >
                {isLoggingOut ? (
                  <i className="ri-loader-4-line animate-spin"></i>
                ) : (
                  <i className="ri-logout-box-r-line"></i>
                )}
              </button>
            </li>
          </ul>
          <div
            id="slider-toggle"
            className="slider__toggle absolute top-1/2 -translate-y-1/2 left-12 rounded-full cursor-pointer"
            onClick={toggleSlider}
          >
            <i
              id="toggle-icon"
              className={`fa-solid fa-chevron-right transition-transform duration-300 px-2 py-2 rounded-lg ${
                isOpen ? "rotate-180 text-black bg-[#D7FF9C]" : ""
              }`}
            ></i>
          </div>
        </div>
      </aside>
      <Outlet />
    </>
  );
}

export default Layout;