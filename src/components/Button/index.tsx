import { MouseEvent, ReactNode } from 'react';

type ButtonProps = {
  onClick: (event: MouseEvent) => void;
  children: ReactNode;
  disabled?: boolean;
};

const Button = ({ onClick, children, disabled = false }: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
