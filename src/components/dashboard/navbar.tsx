"use client";

import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { LogOut, LayoutDashboard } from "lucide-react";

interface NavbarProps {
  userEmail: string;
  fullName?: string;
}

export function Navbar({ userEmail, fullName }: NavbarProps) {
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : userEmail[0].toUpperCase();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-white"
            >
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            TaskFlow
          </span>
        </Link>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex h-10 items-center gap-2 rounded-full border border-white/10 px-2 pr-3 hover:bg-white/5">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium text-slate-300 sm:inline-block">
              {fullName || userEmail}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-white/10 bg-slate-900"
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-white">
                {fullName || "Kullanıcı"}
              </p>
              <p className="text-xs text-slate-400">{userEmail}</p>
            </div>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="cursor-pointer">
              <Link
                href="/dashboard"
                className="flex w-full items-center gap-2 text-slate-300"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-red-400 focus:text-red-300"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
