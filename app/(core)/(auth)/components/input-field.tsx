import React, { InputHTMLAttributes } from "react";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";

interface InputFieldProps {
  label?: string;
  error?: string | null;
}

export default function InputField({
  id,
  name,
  placeholder,
  type,
  disabled,
  label,
  value,
  onChange,
  error,
  ...props
}: InputFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid w-full gap-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={error ? "border-red-500" : ""}
        name={name}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
