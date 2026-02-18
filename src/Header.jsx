// force cloudflare rebuild

import { useState } from 'react';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { supabase } from './lib/supabaseClient';

function Header({ setShowModal, user, setShowAccount, isAdmin, setShowAdmin }) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openAccount = () => {
    setShowAccount(true);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const handleScheduleClick = () => {
    setShowModal(true);
  };

  return (
    <header className="sticky top-0 z-[1000] bg-gray-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/BL-2.png" alt="BL" className="h-10 w-10" />
          <span className="text-xl font-bold text-purple-800">Badgerland Laundry</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-blue-900 font-medium">
          <a href="/" className="hover:text-blue-600">Home</a>
          <a href="/About" className="hover:text-blue-600">About</a>

          <div className="relative">
            <button
              onClick={() => {
                setServicesOpen(!servicesOpen);
                setUserMenuOpen(false);
              }}
              className="hover:text-blue-600"
            >
              Services
            </button>

            {servicesOpen && (
              <div className="absolute top-full mt-2 bg-white shadow-lg rounded-md p-2 w-40">
                <a href="/Residential" className="block px-4 py-2 hover:bg-blue-50">Residential</a>
                <a href="/Commercial" className="block px-4 py-2 hover:bg-blue-50">Commercial</a>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-6 relative z-[1000]">

          <a href="/cart" aria-label="Cart" className="text-purple-900 hover:text-purple-600">
            <FaShoppingCart size={20} />
          </a>

          {/* Account Button */}
          <button
            aria-label="Account"
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setServicesOpen(false);
            }}
            className="text-purple-900 hover:text-purple-600 relative"
          >
            <FaUser size={20} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md py-2 w-56 z-[1001]">
              {!user ? (
                <>
                  <button className="w-full text-left px-4 py-2 hover:bg-purple-50" onClick={openAccount}>Sign In</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-purple-50" onClick={openAccount}>Create Account</button>
                </>
              ) : (
                <>
                  <button className="w-full text-left px-4 py-2 hover:bg-purple-50" onClick={openAccount}>My Account</button>

                  {isAdmin && (
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-700 font-semibold"
                      onClick={() => {
                        setShowAdmin(true);
                        setUserMenuOpen(false);
                      }}
                    >
                      Admin Dashboard
                    </button>
                  )}

                  <button className="w-full text-left px-4 py-2 hover:bg-purple-50" onClick={handleLogout}>Log Out</button>
                </>
              )}
            </div>
          )}

          {/* Become a Member */}
          <a
            href="/plans"
            className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold border border-purple-300 hover:bg-purple-200 transition whitespace-nowrap"
          >
            Become a Member
          </a>

          {/* Schedule Pickup */}
          <button
            onClick={handleScheduleClick}
            className="bg-purple-700 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-purple-600 whitespace-nowrap"
          >
            Schedule Pickup
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-purple-900"
          onClick={() => setMobileMenuOpen(true)}
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[500] flex justify-end">
          <div
            className="flex-1 bg-black bg-opacity-40"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="w-64 bg-white h-full shadow-xl p-5 flex flex-col gap-4 animate-slide-left">

            <div className="flex justify-end">
              <button onClick={() => setMobileMenuOpen(false)} className="text-purple-900">
                <FaTimes size={24} />
              </button>
            </div>

            <a href="/" className="text-blue-900 font-medium">Home</a>
            <a href="/About" className="text-blue-900 font-medium">About</a>

            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="text-left text-blue-900 font-medium"
            >
              Services
            </button>

            {servicesOpen && (
              <div className="ml-4 space-y-2">
                <a href="/Residential" className="block text-blue-700">Residential</a>
                <a href="/Commercial" className="block text-blue-700">Commercial</a>
              </div>
            )}

            {!user ? (
              <>
                <button className="text-left text-purple-700" onClick={openAccount}>Sign In</button>
                <button className="text-left text-purple-700" onClick={openAccount}>Create Account</button>
              </>
            ) : (
              <>
                <button className="text-left text-purple-700" onClick={openAccount}>My Account</button>

                {isAdmin && (
                  <button
                    className="text-left text-purple-700 font-semibold"
                    onClick={() => {
                      setShowAdmin(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Admin Dashboard
                  </button>
                )}

                <button className="text-left text-purple-700" onClick={handleLogout}>Log Out</button>
              </>
            )}

            <a
              href="/plans"
              className="text-left text-purple-700 font-semibold"
            >
              Become a Member
            </a>

            <button
              onClick={() => {
                handleScheduleClick();
                setMobileMenuOpen(false);
              }}
              className="mt-4 w-full bg-purple-700 text-white py-2 rounded-full font-semibold"
            >
              Schedule Pickup
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;