import styles from './ChartCard.module.css';
import { ReactNode } from 'react';

interface ChartCardProps {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
    action?: ReactNode;
    onClick?: () => void;
}

export default function ChartCard({ title, icon, children, className, action, onClick }: ChartCardProps) {
    return (
        <div className={`${styles.card} ${className || ''}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    {icon}
                    <span className={styles.title}>{title}</span>
                </div>
                {action && <div className={styles.action}>{action}</div>}
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                {children}
            </div>
        </div>
    );
}
