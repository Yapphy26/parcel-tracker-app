"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"

// Icons
import { House, LibraryBig, Contact } from "lucide-react"

const navItems = [
  { icon: House, label: "Home", redirect: "/" },
  { icon: LibraryBig, label: "About", redirect: "/about" },
  { icon: Contact, label: "Contact", redirect: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <footer className="fixed md:relative bottom-0 w-full h-[75px] md:h-[50px] flex flex-col justify-end items-center border-t backdrop-blur-xs px-5 py-3 z-1">

      <div className="md:hidden relative w-full">
        <ul className="absolute flex justify-center items-end gap-5 bottom-[10px] left-1/2 -translate-x-1/2">
          {navItems.map(({ icon: Icon, label, redirect }) => {
            const isActive = pathname === redirect;
            return (
              <li key={label}>
                <Link
                  href={redirect}
                  className={`relative group block bg-card text-card-foreground border shadow-sm rounded-full p-4 
                 transition-all duration-300 
                 ease-[cubic-bezier(0.22,0.86,0.37,1.68)] 
                 active:p-6 hover:p-6 cursor-pointer ${isActive && "bg-[#ccc]! dark:bg-[#888]!"}`}
                >
                  <Icon size={20} />
                  <span className={`absolute transition-all duration-300 bg-card text-xs border rounded-sm px-2 py-1
                   top-[-40px] left-1/2 -translate-x-1/2 whitespace-nowrap shadow ${isActive && "bg-[#ccc]! dark:bg-[#888]!"}`}>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="md:h-full md:flex items-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} Yapphy Yong.</p>
      </div>

    </footer>
  );
}
