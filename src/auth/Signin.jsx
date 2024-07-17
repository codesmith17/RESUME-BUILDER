import React from "react";
import { SignIn } from "@clerk/clerk-react";
const Signin = () => {
  return (
    <div className="flex justify-center flex-row my-10 items-center">
      <SignIn></SignIn>
    </div>
  );
};

export default Signin;
