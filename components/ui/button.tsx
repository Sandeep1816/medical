// components/ui/button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'default'; // Add the variant types you use
  size?: 'sm' | 'md' | 'lg'; // Optional: Adjust sizes based on your needs
  children: ReactNode;
}

export const Button = ({ variant = 'default', size = 'md', children, ...props }: ButtonProps) => {
  // Define classes for different variants and sizes
  const variantClasses = variant === 'outline' 
    ? 'border border-gray-300 text-gray-700' 
    : 'bg-blue-500 text-white';

  const sizeClasses = size === 'sm' 
    ? 'px-3 py-1' 
    : size === 'lg' 
    ? 'px-6 py-3' 
    : 'px-4 py-2'; // Default size

  return (
    <button className={`${variantClasses} ${sizeClasses} rounded`} {...props}>
      {children}
    </button>
  );
};
