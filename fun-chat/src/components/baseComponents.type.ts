export type Props = {
  className?: string;
  textContent?: string;
  tag?: string;
  type?: string;
  id?: string;
  placeholder?: string;
  onclick?(e?: MouseEvent): void;
  onkeydown?(e?: KeyboardEvent): void;
  onkeyup?(): void;
  required?: string;
  src?: string;
  alt?: string;
  href?: string;
};
