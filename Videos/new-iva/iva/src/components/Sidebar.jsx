import { AnimatePresence, motion } from 'framer-motion';
import { FaBars, FaHome, FaUser } from 'react-icons/fa';
import { MdMessage } from 'react-icons/md';
import { BiAnalyse, BiSearch, BiCog } from 'react-icons/bi';
import { AiFillHeart, AiTwotoneFileExclamation } from 'react-icons/ai';
import { BsCartCheck } from 'react-icons/bs';
import { NavLink,Outlet } from 'react-router-dom';
import { useState } from 'react';
import TopNavbar from './Navbar/TopNavbar';

const routes = [
  { path: '/overview', name: 'Overview', icon: <FaHome /> },
  { path: '/manualscan', name: 'Manual Scan', icon: <FaUser /> },
  { path: '/analytics', name: 'Analytics', icon: <BiAnalyse /> },
  { path: '/configuration', name: 'Configuration', icon: <AiTwotoneFileExclamation /> },
  { path: '/makechecker', name: 'Make Checker', icon: <BsCartCheck /> },
  { path: '/settings', name: 'Settings', icon: <BiCog /> },
  { path: '/saved', name: 'Saved', icon: <AiFillHeart /> },
];

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
const [pagename,setPagename]= useState("");
  const toggle = () => setIsOpen(!isOpen);

  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: { duration: 0.2 },
    },
    show: {
      width: '140px',
      padding: '5px 15px',
      transition: { duration: 0.2 },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,

      transition: { duration: 0.5 },
    },
    show: {
      opacity: 1,
      width: 'auto',
      
      transition: { duration: 0.5 },
    },
  };

  return (<>
    <TopNavbar content={pagename}
          style={{
            position: 'absolute',
            top: 0,
            left: '220px', // Adjust this based on your sidebar width
            right: 0,
            zIndex: 1,  // Ensure it's behind the sidebar
            transition: 'left 0.5s ease',
          }}
        />
    <div className="main-container">
     
      <motion.div animate={{ width: isOpen ? '220px' : '45px' }} className="sidebar" transition={
        {
            duration:0.5,
            type:"spring",
            damping:10,

        }
      }>
        <div className="top_section">
          {isOpen && (
            <motion.h1
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={showAnimation}
              className="logo"
            >
              iVA
            </motion.h1>
          )}
          <div className="bars" onClick={toggle}>
            <FaBars />
          </div>
        </div>
        <div className="search">
          <div className="search_icon">
            <BiSearch />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.input
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={inputAnimation}
                placeholder="Search"
              />
            )}
          </AnimatePresence>
        </div>
        <section className="routes">
          {routes.map((route) => (
           <NavLink
           key={route.name}
           to={route.path}
           className={({ isActive }) => {
             if (isActive) {
              setPagename(route.name); 
               // Update pagename when active
               return 'link active';
               
             }
             return 'link';
           }}
         >
              <div className="icon">{route.icon}</div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    variants={showAnimation}
                    className="link_text"
                  >
                    {route.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </section>
      </motion.div>
      <main><Outlet/></main>
    </div>
    </>
  );
};

export default Sidebar
