import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const SidebarMenu = ({ showAnimation, route, isOpen, setPagename }) => {
  const menuAnimation = {
    hidden: { height: 0, opacity: 0, transition: { duration: 0.5 } },
    show: { opacity: 1, height: "auto", transition: { duration: 0.5 } },
  };

  const menuItemAnimation = {
    hidden: (custom) => ({
      padding: 0,
      x: "-100%",
      opacity: 0,
      transition: { duration: custom * 0.1 },
    }),
    show: (custom) => ({
      x: 0,
      opacity: 1,
      transition: { duration: custom * 0.5},
    }),
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <div key={route.name} className="menu" onClick={toggleMenu}>
        <div className="menu_item">
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
        </div>
        <motion.div
          animate={{ rotate: isMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaAngleDown />
        </motion.div>
      </div>

      <AnimatePresence>
        {isMenuOpen && isOpen && (
          <motion.div
            variants={menuAnimation}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="menu_container"
          >
            {route.subRoutes?.map((subRoute, i) => (
              <motion.div variants={menuItemAnimation} custom={i + 1} key={subRoute.name}>
                <NavLink
                  to={subRoute.path}
                  className={({ isActive }) =>
                    isActive ? "link active" : "link"
                  }
                  onClick={() => setPagename(subRoute.name)}
                >
                  <div className="icon">{subRoute.icon}</div>
                  <motion.div
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    variants={showAnimation}
                    className="link_text"
                  >
                    {subRoute.name}
                  </motion.div>
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarMenu;
