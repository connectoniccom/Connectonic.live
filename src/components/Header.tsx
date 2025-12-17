
'use client';

import React from 'react';
import { Menu, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './ModeToggle';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import Image from 'next/image';
import Link from 'next/link';
import InstallPrompt from './InstallPrompt';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center h-16 px-4 border-b bg-background/95 backdrop-blur-sm">
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
        <Menu />
      </Button>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <InstallPrompt />
        <ModeToggle />
        {user ? (
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Image
                  src={user.photoURL || `https://placehold.co/40x40.png`}
                  alt={user.displayName || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                <div className="font-medium">{user.displayName}</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="ghost" size="sm">
            <Link href="/auth">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
