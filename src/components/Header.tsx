import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.profileContainer}>
        {/* Placeholder for Search bar if needed later */}
        <div className={styles.profileAvatar}>D</div>
      </div>
    </header>
  );
}
