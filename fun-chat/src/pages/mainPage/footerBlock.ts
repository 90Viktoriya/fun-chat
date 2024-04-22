import BaseComponent from '../../components/baseComponent';
import CLASS_NAMES from './mainPage.constants';

const FOOTER = new BaseComponent(
  { tag: 'section', className: CLASS_NAMES.footer },
  new BaseComponent(
    { tag: 'div', className: CLASS_NAMES.github },
    new BaseComponent(
      {
        tag: 'a',
        href: 'https://github.com/90Viktoriya',
        textContent: '90Viktoriya',
        className: CLASS_NAMES.githubLink
      },
      new BaseComponent({
        tag: 'div',
        className: CLASS_NAMES.githubIcon
      })
    )
  ),
  new BaseComponent({ tag: 'div', textContent: '2024', className: CLASS_NAMES.year }),
  new BaseComponent(
    { tag: 'div', className: CLASS_NAMES.logo },
    new BaseComponent(
      {
        tag: 'a',
        href: 'https://rs.school/js/',
        textContent: 'RS School',
        className: CLASS_NAMES.logoLink
      },
      new BaseComponent({
        tag: 'div',
        className: CLASS_NAMES.logoIcon,
      })
    )
  )
);

export default FOOTER;
