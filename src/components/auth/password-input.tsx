"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
export function PasswordInput({
  name = "password",
  label = "Password",
  autoComplete,
  minLength,
  maxLength,
}: {
  name?: string;
  label?: string;
  autoComplete: "current-password" | "new-password";
  minLength?: number;
  maxLength?: number;
}) {
  const [visible, setVisible] = useState(false);
  const inputId = `${name}-input`;
  return (
    <div className="password-control">
      <label htmlFor={inputId}>{label}</label>
      <span className="password-field">
        <input
          id={inputId}
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={minLength}
          maxLength={maxLength}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          data-no-theme-gesture
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </div>
  );
}
