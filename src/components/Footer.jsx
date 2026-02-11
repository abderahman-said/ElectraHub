import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-primary text-white py-12 sm:py-16 mt-auto">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
                    <div>
                        <div className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-tighter mb-4 text-white">
                            ELECTRA<span className="font-normal text-accent">HUB</span>
                        </div>
                        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed opacity-80">
                            The leading B2B marketplace for electrical appliances. Connecting importers with traders globally.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">Explore</h4>
                        <ul className="space-y-3">
                            <li><Link to="/shop" className="text-xs sm:text-sm text-blue-100/60 hover:text-accent transition-colors">Marketplace</Link></li>
                            <li><Link to="/" className="text-xs sm:text-sm text-blue-100/60 hover:text-accent transition-colors">Categories</Link></li>
                            <li><Link to="/" className="text-xs sm:text-sm text-blue-100/60 hover:text-accent transition-colors">Featured Importers</Link></li>
                            <li><Link to="/" className="text-xs sm:text-sm text-blue-100/60 hover:text-accent transition-colors">Wholesale Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">Support</h4>
                        <ul className="space-y-3">
                            <li><a href="#faq" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">FAQs</a></li>
                            <li><a href="#shipping" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">Shipping</a></li>
                            <li><a href="#returns" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">Returns</a></li>
                            <li><a href="#contact" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><a href="#about" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">About Us</a></li>
                            <li><a href="#sustainability" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">Sustainability</a></li>
                            <li><a href="#careers" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">Careers</a></li>
                            <li><a href="#press" className="text-xs sm:text-sm text-gray-400 hover:text-accent transition-colors">Press</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-6 sm:pt-8 border-t border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm text-blue-100/60">&copy; 2026 ElectraHub B2B Platform. All rights reserved.</p>
                    <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                        <a href="#privacy" className="text-gray-400 hover:text-accent transition-colors">Privacy Policy</a>
                        <span className="text-gray-700">|</span>
                        <a href="#terms" className="text-gray-400 hover:text-accent transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
