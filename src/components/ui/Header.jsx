import React from 'react';
import { Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-white px-6 py-4 shadow-sm border-b">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-gray-800">
          Ai<span className="text-yellow-500">inhome</span> | CB
        </span>
      </div>
      <div className="text-sm text-gray-500">
        September 24 &nbsp;|&nbsp; <span className="font-medium">Wednesday</span> &nbsp;16:36 PM
      </div>
    </header>
  );
}