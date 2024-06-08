import React, { Suspense } from "react";
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
import { Separator } from "./ui/separator";
import TeamsSelector from "./TeamsSelector";

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
    <>
      <header className="sticky min-w-full py-4 max-sm:px-4">
        <div className="mx-auto flex max-w-5xl justify-between">
          <div className="flex items-center space-x-4 max-sm:space-x-2">
            <Link href="/one-time">
              <Button className="pl-0 max-sm:px-0" variant={"link"}>
                One Time
              </Button>
            </Link>
            <Link href="/ongoing">
              <Button className="max-sm:px-0" variant={"link"}>
                Ongoing
              </Button>
            </Link>
          </div>
          <div className="flex-1 pt-2 text-center max-sm:hidden">
            <Link href="/">
              <h1 className="text-xl font-semibold text-primary hover:text-blue-900">
                Bettor
              </h1>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
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
              <div className="flex items-center gap-2">
                <Suspense fallback={<></>}>
                  <TeamsSelector />
                </Suspense>
                <ProfileDropdown user={user} />
              </div>
            )}
          </div>
        </div>
      </header>
      <Separator />
    </>
  );
};

export default Header;
