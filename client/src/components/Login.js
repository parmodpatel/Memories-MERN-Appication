import React, { useMemo, useState } from "react";
import { signIn } from "../api";

const Login = ({ onLogin, onSwitch }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailLooksValid = useMemo(() => {
    const email = form.email.trim();
    return email.length > 3 && email.includes("@") && email.includes(".");
  }, [form.email]);

  const passwordLooksValid = useMemo(() => form.password.length >= 8, [form.password]);

  const canSubmit = emailLooksValid && passwordLooksValid && !isSubmitting;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true });

    if (!emailLooksValid) {
      setError("Enter a valid email address.");
      return;
    }
    if (!passwordLooksValid) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await signIn({
        email: form.email.trim(),
        password: form.password,
      });
      onLogin({ token: data.token, user: data.user });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="you@company.com"
            autoComplete="email"
          />
          {touched.email && !emailLooksValid && (
            <p className="text-xs text-red-500 mt-1">Please enter a valid email.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          {touched.password && !passwordLooksValid && (
            <p className="text-xs text-red-500 mt-1">Use at least 8 characters.</p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-200"
            />
            Show password
          </label>
          <button type="button" className="text-blue-600 hover:text-blue-700">
            Forgot password?
          </button>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-lg bg-blue-600 text-white py-2 font-semibold disabled:opacity-60 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <span>New here?</span>
        <button
          type="button"
          onClick={onSwitch}
          className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          Create an account
        </button>
      </div>
    </>
  );
};

export default Login;
