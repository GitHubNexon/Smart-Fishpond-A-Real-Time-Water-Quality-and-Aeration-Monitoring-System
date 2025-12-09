'use client';

import React from 'react';
import {
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import {
  homeSubMenus,
  servicesSubMenus,
  announcementsSubMenus,
  projectsSubMenus,
  aboutSubMenus,
} from './menus';
import { ThemeButtons } from '@/components/customs/theme-buttons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Quick links - combining key menu items
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Announcements', href: '/announcements' },
    { name: 'Projects', href: '/projects' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const services = [
    { name: 'Barangay Clearance', href: '/services#barangay-clearance' },
    {
      name: 'Certificate of Indigency',
      href: '/services#certificate-of-indigency',
    },
    { name: 'Business Permit', href: '/services#business-permit' },
    {
      name: 'Certificate of Residency',
      href: '/services#certificate-of-residency',
    },
  ];

  const resources = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Transparency Reports', href: '/transparency' },
    { name: 'FOI Requests', href: '/foi' },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/idcgov',
      color: 'hover:text-blue-600 dark:hover:text-blue-400',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/idcgov',
      color: 'hover:text-sky-600 dark:hover:text-sky-400',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      href: 'https://youtube.com/idcgov',
      color: 'hover:text-red-600 dark:hover:text-red-400',
    },
  ];

  return (
    <footer className="bg-linear-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 text-gray-700 dark:text-gray-300 border-t border-slate-300 dark:border-slate-700 transition-colors duration-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-blue-600 dark:bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">IDC</span>
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold text-lg">
                  Information & Data Center
                </h3>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Republic of the Philippines
              <br />
              Empowering communities through accessible information and
              innovative data solutions.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 rounded-lg bg-slate-300 dark:bg-slate-700 flex items-center justify-center transition-all duration-300 ${social.color} hover:bg-slate-400 dark:hover:bg-slate-600 hover:scale-110 shadow-sm`}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center">
              <span className="w-8 h-0.5 bg-blue-600 dark:bg-blue-600 mr-2"></span>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 mr-2 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 transition-colors"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center">
              <span className="w-8 h-0.5 bg-blue-600 dark:bg-blue-600 mr-2"></span>
              Services
            </h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 mr-2 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 transition-colors"></span>
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center">
              <span className="w-8 h-0.5 bg-blue-600 dark:bg-blue-600 mr-2"></span>
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  123 Government Center, Pasig City, Metro Manila, Philippines
                  1600
                </span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <a
                  href="tel:+6328123456"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  +63 2 8123 4567
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <a
                  href="mailto:info@idc.gov.ph"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  info@idc.gov.ph
                </a>
              </li>
            </ul>

            {/* Office Hours */}
            <div className="mt-4 p-3 bg-slate-200 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm">
              <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                Office Hours
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Mon - Fri: 8:00 AM - 5:00 PM
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Closed on weekends & holidays
              </p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="border-t border-slate-300 dark:border-slate-700 pt-8 mb-8">
          <h4 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Our Location
          </h4>
          <div className="rounded-lg overflow-hidden shadow-xl border border-slate-300 dark:border-slate-700 h-64">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.3876788429584!2d121.08544931484485!3d14.573729989827716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c839f0000001%3A0x1f34c3f8a7f8f0f8!2sPasig%20City%20Hall!5e0!3m2!1sen!2sph!4v1234567890123!5m2!1sen!2sph"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="IDC Office Location"
            ></iframe>
          </div>
        </div>

        {/* Resources Links */}
        <div className="border-t border-slate-300 dark:border-slate-700 pt-8">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {resources.map((resource) => (
              <a
                key={resource.name}
                href={resource.href}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center"
              >
                {resource.name}
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              <p className="text-gray-800 dark:text-gray-300">
                © {currentYear} Information & Data Center. All rights reserved.
              </p>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-500">
                This is a demonstration website and not an official government
                portal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Theme Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Theme:
                </span>
                <ThemeButtons />
              </div>

              {/* External Links */}
              <div className="flex items-center space-x-4">
                <a
                  href="https://gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Official Gazette
                </a>
                <span className="text-gray-400 dark:text-gray-600">•</span>
                <a
                  href="https://data.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Open Data Portal
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
