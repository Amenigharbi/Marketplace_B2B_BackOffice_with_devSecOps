import { ReactNode } from "react";

export type Props = {
  name?: string;
  onClick?: () => void;
  icon?: ReactNode;
  isActive?: boolean;
  withSubMenu?: boolean;
  isOpen?: boolean;
};
