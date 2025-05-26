import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode; // ✅ icon props 추가
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`pl-10 pr-3 py-2 border rounded w-full ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
