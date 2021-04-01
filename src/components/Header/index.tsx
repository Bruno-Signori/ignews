import React from 'react'
import { SignInButton } from '../SignInButton'
import styles from './styles.module.scss'
import Link from 'next/link';
import { ActiveLink } from '../ActiveLink';

export function Header() {

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ignews" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
          {/* a expressao a baixo quer dizer: se o caminho é '/' coloco o estilo a seguir senao ' : 'sem estilo  */}
          <a >Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts" prefetch>
          <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}