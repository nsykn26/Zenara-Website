import { useState } from 'react';
import { motion as Motion, useScroll, useMotionValueEvent } from 'framer-motion';

const Header = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-150%" },
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="header glassmorphism-background fixed antialiased mt-1 inset-x-0 top-0 mx-auto w-11/12 md:w-10/12 z-50 p-4"
      id="header"
    >
      <nav className="navbar w-full">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <a className="flex items-center" href="#">
              <img src="/src/assets/White.png" alt="Zenara Jaya Logo" className="h-6 w-auto" />
            </a>

            <button
              className="md:hidden p-2 rounded focus:outline-none"
              type="button"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation"
            >
              <span className="block w-6 h-0.5 bg-white mb-1"></span>
              <span className="block w-6 h-0.5 bg-white mb-1"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </button>

            <div
              className={`${
                isMobileMenuOpen
                  ? "flex flex-col absolute top-full left-0 right-0 bg-[rgba(26,26,26,0.95)] backdrop-blur-lg p-4 space-y-4"
                  : "hidden"
              } md:flex md:space-x-6 md:flex-row md:static md:bg-transparent md:p-0 md:space-y-0`}
              id="navbarItems"
            >
              <a href="#about" className="hover:text-purple-400 transition" onClick={() => setIsMobileMenuOpen(false)}>About</a>
              <a href="#services" className="hover:text-purple-400 transition" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
              <a href="#portfolio" className="hover:text-purple-400 transition" onClick={() => setIsMobileMenuOpen(false)}>Portfolio</a>
              <a href="#contact" className="hover:text-purple-400 transition" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
            </div>
          </div>
        </div>
      </nav>
    </Motion.header>
  );
};

export default Header;
