import { MouseEvent, ReactNode } from 'react';

type ButtonProps = {
  onClick: (event: MouseEvent) => void;
  children: ReactNode;
};

const Button = ({ onClick, children }: ButtonProps) => {
  return <button onClick={onClick}>{children}</button>;
};

export default Button;
