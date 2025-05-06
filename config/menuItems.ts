// config/menuItems.ts
export interface MenuItem {
  name: string;
  href: string;
}

export const menuItems: MenuItem[] = [
  { name: 'About', href: '#about' },
  { name: 'Education', href: '#education' },
  { name: 'Work', href: '#work' },
  { name: 'Skills', href: '#skills' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];
