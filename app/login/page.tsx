"use client";
import dynamic from "next/dynamic";
const LoginComp = dynamic(() => import("@/app/components/LoginComp"), {
  ssr: false,
});

const Login = () => {
  return (
    <div>
      <LoginComp />
    </div>
  );
};

export default Login;
