import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-purple-900 text-white pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Column 1: Brand */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold tracking-tight text-white">
            Badgerland<span className="text-purple-300">Laundry</span>
          </h3>
          <p className="text-purple-200 text-sm leading-relaxed max-w-xs">
            Premium laundry pickup and delivery service. We handle the dirty work so you can reclaim your time.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-purple-100">Services</h4>
          <ul className="space-y-2 text-purple-200 text-sm">
            <li><Link to="/plans" className="hover:text-white transition">Subscription Plans</Link></li>
            <li><Link to="/residential" className="hover:text-white transition">Residential Laundry</Link></li>
            <li><Link to="/commercial" className="hover:text-white transition">Commercial Service</Link></li>
            <li><Link to="/about" className="hover:text-white transition">Our Story</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact & Support */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-purple-100">Contact</h4>
          <ul className="space-y-2 text-purple-200 text-sm">
            <li>Serving: Sun Prairie & Madison, WI</li>
            <li>Email: hello@badgerlandlaundry.com</li>
            <li className="pt-2">
              <span className="inline-block bg-purple-800 px-3 py-1 rounded-full text-xs font-mono">
                Available Mon - Fri
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-purple-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-purple-300">
        <p>© {new Date().getFullYear()} Badgerland Laundry LLC. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}