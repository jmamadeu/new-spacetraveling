import Link from 'next/link';
import styles from './header.module.scss';

export const Header = (): JSX.Element => (
  <header className={styles.container}>
    <Link href="/">
      <a>
        <img src="/logo.svg" alt="logo" />
      </a>
    </Link>
  </header>
);
