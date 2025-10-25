"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"

// Icons
import { House, LibraryBig, Contact, Moon, Sun } from "lucide-react"

// UI
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { icon: House, label: "Home", redirect: "/" },
  { icon: LibraryBig, label: "About", redirect: "/about" },
  { icon: Contact, label: "Contact", redirect: "/contact" },
];

export default function Navbar() {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  useEffect(() => {
    // 👇 Replace with your trial end date
    const trialEnd: Date = new Date("2025-10-18T23:59:59")
    const today: Date = new Date()

    const diffTime: number = trialEnd.getTime() - today.getTime()
    const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    setDaysLeft(diffDays > 0 ? diffDays : 0)
  }, [])

  return (
    <nav className="fixed top-0 w-full h-[65px] flex justify-between items-center border-b backdrop-blur-xs px-5 py-3 z-[40]">
      <div className="logo-div flex gap-3 items-center">
        <Link href={"/"}>
          <Image className="w-[65px] md:w-[81px]" src="/images/logos/logo-parcelotw.png" alt="Logo" width={96} height={49} priority />
        </Link>
        <span className="inline-block rounded-sm text-xs bg-[#eee] dark:bg-[#555] px-2 py-1 text-[#555] dark:text-[#ccc]">Free trial ends in: {daysLeft !== null ? `${daysLeft} days` : "..."}</span>
      </div>

      <div className="hidden md:flex">
        <ul className="absolute flex justify-center items-start gap-5 top-[20px] left-1/2 -translate-x-1/2">
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
                   bottom-[-40px] left-1/2 -translate-x-1/2 whitespace-nowrap shadow ${isActive && "bg-[#ccc]! dark:bg-[#888]!"}`}>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="w-[65px] md:w-[81px] flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
