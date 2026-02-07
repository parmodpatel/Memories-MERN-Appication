import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const Auth = ({ onAuth }) => {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-blue-100">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold">
            M
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-gray-500 mt-1">
            {mode === "login"
              ? "Sign in to keep your memories in sync."
              : "Start saving your best moments in one place."}
          </p>
        </div>

        {mode === "login" ? (
          <Login onLogin={onAuth} onSwitch={() => setMode("signup")} />
        ) : (
          <Signup onSignup={onAuth} onSwitch={() => setMode("login")} />
        )}
      </div>
    </div>
  );
};

export default Auth;
