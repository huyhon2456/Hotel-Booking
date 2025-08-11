import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets.js'
import { useClerk, UserButton } from '@clerk/clerk-react';
import { useAppContext } from '../context/AppContext.jsx';

const BookIcon = () => (
  <img
    src={assets.logo}
    alt="Đặt phòng của tôi"
    className="w-4 h-4 object-contain opacity-80 "
  />
)

const Navbar = () => {
  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Khách sạn', path: '/rooms' },
  { name: 'Blog', path: '/blog' },
  { name: 'Liên hệ', path: '/contact' },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openSignIn } = useClerk()
  const location = useLocation()
  const { user, navigate, isOwner, setShowHotelReg } = useAppContext()
  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  useEffect(() => {

    if (location.pathname !== '/') {
      setIsScrolled(true);
      return
    } else {
      setIsScrolled(false);
    }
    setIsScrolled(prev => location.pathname !== '/' ? true : prev)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (

    <nav className={`fixed top-0 left-0  w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-[var(--color-2)] shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

      {/* Logo */}
      <Link to='/'>
        <img src={assets.logo} alt="logo" className={`h-12 ${!isScrolled ? "invert" : ""} ${isScrolled && "opacity-80"}`} />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => {
          const active = isActivePath(link.path)
          return (
            <Link
              key={i}
              to={link.path}
              className={`group flex flex-col gap-0.5 ${isScrolled ? "text-black opacity-80" : "text-white"} ${active ? 'font-medium' : ''}`}
            >
              {link.name}
              <div className={`${isScrolled ? "bg-black opacity-80" : "bg-white"} h-0.5 ${active ? 'w-full' : 'w-0'} group-hover:w-full transition-all duration-300`} />
            </Link>
          )
        })}

        {user && (
          <button className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`} onClick={() => isOwner ? navigate('/owner') : setShowHotelReg(true)}>
            {isOwner ? 'Bảng điều khiển' : 'Đăng ký khách sạn'}
          </button>
        )}
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">
       

        {user ?
          (<UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="My Bookings" labelIcon={<BookIcon />} onClick={() => navigate('/my-bookings')} />
            </UserButton.MenuItems>
          </UserButton>)
          :
          (<button onClick={openSignIn} className="bg-[var(--color-1)] text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500">
            Đăng nhập
          </button>)
        }


      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        {user && <UserButton>
          <UserButton.MenuItems>
            <UserButton.Action label="Đặt phòng của tôi" labelIcon={<BookIcon />} onClick={() => navigate('/my-bookings')} />
          </UserButton.MenuItems>
        </UserButton>}
        <img onClick={() => setIsMenuOpen(!isMenuOpen)} src={assets.menuIcon} alt="" className={`${isScrolled && "invert"} h-4`} />
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
          <img src={assets.closeIcon} alt="close-menu" className='h-6.5' />
        </button>

        {navLinks.map((link, i) => (
          <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </Link>
        ))}

      {user && <button onClick={() => isOwner ? navigate('/owner') : setShowHotelReg(true)} className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all">
        {isOwner ? 'Bảng điều khiển' : 'Đăng ký khách sạn'}
        </button>}

      {!user && <button onClick={openSignIn} className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
       Đăng nhập
        </button>}
      </div>
    </nav>

  );
}

export default Navbar
