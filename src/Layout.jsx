import { useState } from "react";
import { Outlet } from "react-router-dom";
import {Link, NavLink} from 'react-router-dom'

function Layout() {
  const [isOpen, setIsOpen] = useState(window.matchMedia("(min-width: 1024px)").matches);

  const toggleSlider = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <aside className="slider fixed top-0 z-10">
        <div
          id="slider-container"
          className={`slider__container w-10 h-screen bg-black transition-transform duration-500 ease-in-out relative ${
            isOpen ? "translate-x-0" : "-translate-x-10"
          }`}
        >
          <ul className="slider__links w-full h-full flex flex-col justify-center items-center gap-16">
          <li
            className="px-2 py-1 bg-neutral-900 rounded-full flex items-center justify-center"
          >
            <NavLink 
            to="/">
              <i className="fa-solid fa-pen-to-square text-[#D7FF9C]"></i>
            </NavLink>
          </li>
          <li className="px-2 py-1 bg-neutral-900 rounded-full flex items-center justify-center">
            <NavLink to="stock">
            <i className="ri-store-3-fill text-white"></i>
            </NavLink>
          </li>
          <li className="px-2 py-1 bg-neutral-900 rounded-full flex items-center justify-center">
            <NavLink to="logs">
            <i className="ri-chat-search-fill text-white"></i>
            </NavLink>
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
