import styles from './Sidebar.module.css';
import { BarChart2 } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={`${styles.navItem} ${styles.active}`}>
                <BarChart2 className={styles.icon} size={20} />
            </div>
            {/* Other nav items could go here */}
        </aside>
    );
}
