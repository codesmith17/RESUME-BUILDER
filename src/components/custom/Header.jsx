import { useUser, UserButton } from "@clerk/clerk-react";
import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
const Header = () => {
  const { user, isSignedIn } = useUser();
  console.log(user);
  return (
    <div className="p-3 px-5 flex justify-between shadow-md">
      <img src="/logo.svg" alt="logo" />
      {isSignedIn ? (
        <div className="flex flex-row gap-2 items-center">
          <Button>Dashboard</Button>
          <UserButton></UserButton>
        </div>
      ) : (
        <Link to={"/auth/singin"}>
          <Button>Get Started</Button>
        </Link>
      )}{" "}
    </div>
  );
};

export default Header;
