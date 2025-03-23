import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <p className="text-base text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Accessify. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
