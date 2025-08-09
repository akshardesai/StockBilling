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
  const[confirmModal,setConfirmModal]=useState(false)
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
          className={`slider__container w-10 h-screen bg-[#1E2228] transition-transform duration-500 ease-in-out relative ${
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
                <i className="ri-line-chart-line"></i>
              </NavLink>
            </li>
            <li className="px-2 py-1 bg-neutral-900 rounded-full flex items-center justify-center">
              <NavLink
                to="invoice"
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
                onClick={()=>{setConfirmModal(true) 
                  toggleSlider()}}
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




      {confirmModal&&(
          <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out `}
      />

      <div
        id="deleteModal"
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2    w-[90%] max-w-md mx-auto p-6 z-50
        bg-gray-900 backdrop-blur-xl
        border-2 border-red-400/30 rounded-2xl shadow-2xl
        transition-all duration-300 ease-out

        "
      >
        {/* <!-- Modal content --> */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-white"> Logout ?</h2>
          {/* <p className="text-white mt-2 text-center font-light">Are you sure you want to logout</p> */}
          {/* <!-- Buttons --> */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleLogout}
              id="confirmDelete"
              className="bg-red-500 text-white hover:bg-red-400 active:bg-red-600  px-4 py-2 rounded-md transition duration-300"
            >
              Yes
            </button>
            <button
              onClick={()=>setConfirmModal(false)}
              id="cancelDelete"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
            >
              No
            </button>
          </div>
        </div>
      </div>



      



    </>
      )}
    </>
  );
}

export default Layout;