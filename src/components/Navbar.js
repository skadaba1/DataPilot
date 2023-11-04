import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import { IconContext } from 'react-icons';
import harvest_logo from "./harvest_logo_white.png"
import LanguagesDropdown from "./LanguagesDropdown.js"
import ThemeDropdown from "./ThemeDropdown.js"

function Navbar() {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);

    return (
        <>
            <IconContext.Provider value={{ color: 'black' }}>
                <div className='navbar'>
                    <Link to='#' className='menu-bars'>
                        <FaIcons.FaBars onClick={showSidebar} />
                    </Link>
                    <img
                        src={harvest_logo}
                        alt="Your Image Description"
                        className="text-center py-3 font-bold text-2xl"
                        style={{
                            width: '200px',
                            height: 'auto',
                            marginLeft: "30px"
                        }}
                    />
                    {/* <div className="px-6 py-4">
                        <LanguagesDropdown onSelectChange={onSelectChange} />
                    </div>
                    <div className="px-6 py-4">
                        <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
                    </div> */}
                </div>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className='navbar-toggle'>
                            <Link to='#' className='menu-bars'>
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </li>
                        {SidebarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    );
}

export default Navbar;