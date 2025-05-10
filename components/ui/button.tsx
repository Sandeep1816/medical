// components/ui/button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'default' | 'ghost'; // Add "ghost" variant
  size?: 'sm' | 'md' | 'lg'; // Optional: Adjust sizes based on your needs
  children: ReactNode;
}

export const Button = ({ variant = 'default', size = 'md', children, ...props }: ButtonProps) => {
  // Define classes for different variants and sizes
  const variantClasses = variant === 'outline'
    ? 'border border-gray-300 text-gray-700'
    : variant === 'ghost'
    ? 'bg-transparent text-gray-700 hover:bg-gray-100' // Define ghost variant style
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

// Export the buttonVariants function
export const buttonVariants = ({ variant = 'default', size = 'md' }: { variant?: 'outline' | 'default' | 'ghost'; size?: 'sm' | 'md' | 'lg' }) => {
  const variantClasses = variant === 'outline'
    ? 'border border-gray-300 text-gray-700'
    : variant === 'ghost'
    ? 'bg-transparent text-gray-700 hover:bg-gray-100'
    : 'bg-blue-500 text-white';

  const sizeClasses = size === 'sm'
    ? 'px-3 py-1'
    : size === 'lg'
    ? 'px-6 py-3'
    : 'px-4 py-2'; // Default size

  return `${variantClasses} ${sizeClasses} rounded`; // Return combined classes
};
