import React from "react";
import "./Footer.css";
import {   Github, Mail, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
    <div className="footer-bottom">
      <p>&copy; 2025 Local Explorer. All rights reserved. Made with ❤️ by AYoub Zarda </p>
      <div className="social-links">
        <a href="https://www.linkedin.com/in/zarda-ayoub/" target="_blank" rel="noopener noreferrer" className="social-link">
          <Linkedin className="icon" />
        </a>
        <a href="https://github.com/AYoubZarda" target="_blank" rel="noopener noreferrer" className="social-link">
          <Github className="icon" />
        </a>
        <a href="mailto:zardaayoub1@gmail.com" className="social-link">
          <Mail className="icon" />
        </a>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
