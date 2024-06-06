import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { stackServerApp } from "@/stack";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CurrentUser } from "@stackframe/stack";

export const ProfileDropdown = ({ user }: { user: CurrentUser }) => {
  return (
    <div className="cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={user.profileImageUrl || undefined} />
            <AvatarFallback>
              {user.displayName
                ? user.displayName[0].toUpperCase()
                : user.primaryEmail
                  ? user.primaryEmail[0].toUpperCase()
                  : "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/handler/account-settings">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Money Situation</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <Link href={stackServerApp.urls.signOut}>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const Header = async () => {
  const user = await stackServerApp.getUser();

  return (
    <header className="sticky min-w-full border-b-2 py-4">
      <div className="mx-auto flex max-w-5xl justify-between">
        <div className="flex items-center justify-between">
          <Link href="/one-time">
            <Button variant={"link"}>One Time</Button>
          </Link>
          <Link href="/ongoing">
            <Button variant={"link"}>Ongoing</Button>
          </Link>
        </div>
        <Link href="/" className="pt-2">
          <h1 className="text-xl font-semibold">Bettor</h1>
        </Link>
        <div className="flex items-center justify-between gap-2">
          {!user ? (
            <>
              <Link href={stackServerApp.urls.signIn}>
                <Button variant={"default"}>Login</Button>
              </Link>
              <Link href={stackServerApp.urls.signUp}>
                <Button variant={"ghost"}>Sign Up</Button>
              </Link>
            </>
          ) : (
            <ProfileDropdown user={user} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
