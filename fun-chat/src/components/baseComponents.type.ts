export type Props = {
  className?: string;
  textContent?: string;
  tag?: string;
  type?: string;
  id?: string;
  placeholder?: string;
  isLogined?: boolean;
  onclick?(e?: MouseEvent): void;
  onkeydown?(e?: KeyboardEvent): void;
  onwheel?(): void;
  onkeyup?(): void;
  required?: string;
  pattern?: string;
  src?: string;
  alt?: string;
  href?: string;
  name?: string;
};
