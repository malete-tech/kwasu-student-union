"use client";

import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About SU */}
        <div className="col-span-1">
          <Link to="/" className="flex items-center focus-visible:ring-brand-gold rounded-md outline-none mb-4">
            <img src="/logo.png" alt="KWASU SU Logo" className="h-12 w-12 object-contain" />
          </Link>
          <p className="text-sm opacity-80">
            Your voice, our mission. Empowering students for a better university experience.
          </p>
          <div className="flex space-x-4 mt-6">
            <a href="https://x.com/thekwasusu" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-xl hover:text-brand-gold transition-colors">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="https://instagram.com/thekwasusu" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-xl hover:text-brand-gold transition-colors">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://facebook.com/thekwasusu" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-xl hover:text-brand-gold transition-colors">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://linkedin.com/company/thekwasusu" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-xl hover:text-brand-gold transition-colors">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="https://tiktok.com/@thekwasusu" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-xl hover:text-brand-gold transition-colors">
              <i className="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <h3 className="text-xl font-semibold mb-4 uppercase">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/news" className="text-sm opacity-80 hover:opacity-100 hover:text-brand-gold transition-opacity">
                News & Announcements
              </Link>
            </li>
            <li>
              <Link to="/events" className="text-sm opacity-80 hover:opacity-100 hover:text-brand-gold transition-opacity">
                Events & Calendar
              </Link>
            </li>
            <li>
              <Link to="/services/downloads" className="text-sm opacity-80 hover:opacity-100 hover:text-brand-gold transition-opacity">
                Downloads
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-sm opacity-80 hover:opacity-100 hover:text-brand-gold transition-opacity">
                Constitution
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-sm opacity-80 hover:opacity-100 hover:text-brand-gold transition-opacity">
                Student Handbook
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div className="col-span-1">
          <h3 className="text-xl font-semibold mb-4 uppercase">Services</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/services/complaints" className="text-sm opacity-80 hover:opacity-100 hover:text-brand-gold transition-opacity">
                Submit Complaint
              </Link>
            </li>
            <li>
              <Link to="/services/opportunities" className="text-sm opacity-80 hover:opacity-100 hover:text-brand-gold transition-opacity">
                Opportunities
              </Link>
            </li>
            <li>
              <Link to="/executives/central" className="text-sm opacity-80 hover:opacity-100 hover:text-brand-gold transition-opacity">
                Meet the Executives
              </Link>
            </li>
            <li>
              <Link to="/services/suggestion-box" className="text-sm opacity-80 hover:opacity-100 hover:text-brand-gold transition-opacity">
                Suggestion Box
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="col-span-1">
          <h3 className="text-xl font-semibold mb-4 uppercase">Newsletter</h3>
          <p className="text-sm opacity-80 mb-4">
            Stay updated with the latest news and events from KWASU SU.
          </p>
          <form className="flex gap-2">
            <Input
              type="email"
              placeholder="Your email"
              className="flex-grow bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/70 focus-visible:ring-brand-gold"
            />
            <Button type="submit" variant="secondary" className="bg-brand-gold text-primary hover:bg-brand-gold/90 focus-visible:ring-brand-gold">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
      <div className="container text-center text-sm opacity-70 mt-10 border-t border-primary-foreground/20 pt-8">
        &copy; {new Date().getFullYear()} KWASU Students' Union. Powered by Malete Tech Forum. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;