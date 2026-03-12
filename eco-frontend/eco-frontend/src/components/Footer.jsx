import React from "react";
import { Linkedin, Twitter, Facebook, Instagram, Leaf } from "lucide-react";

const Footer = () => {
  const resources = [
    { name: "Why EcoLens?", href: "#" },
    { name: "Sustainability Guide", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Product Database", href: "#" },
    { name: "Eco-Friendly Tips", href: "#" },
    { name: "Carbon Footprint", href: "#" },
  ];

  const company = [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Our Mission", href: "#" },
    { name: "Partners", href: "#" },
    { name: "Press", href: "#" },
    { name: "Contact Us", href: "#" },
  ];

  const social = [
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Instagram", href: "#", icon: Instagram },
  ];

  const legal = [
    { name: "Support", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Use", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ];

  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">EcoLens AI</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Because if your workplace elevates your thinking in the current disruption rather will your workdays.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Social</h3>
            <ul className="space-y-2">
              {social.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} EcoLens AI Software Inc.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {legal.map((item, index) => (
                <React.Fragment key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                  {index < legal.length - 1 && (
                    <span className="text-gray-600">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
