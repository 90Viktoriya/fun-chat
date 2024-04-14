export type Props = {
  className?: string;
  textContent?: string;
  tag?: string;
  type?: string;
  id?: string;
  onclick?(e?: MouseEvent): void;
  onkeydown?(e?: KeyboardEvent): void;
  required?: string;
  src?: string;
  alt?: string;
  href?: string;
};
