import styles from './Skeleton.module.css';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
}

export default function Skeleton({ className, width, height }: SkeletonProps) {
    return (
        <div
            className={`${styles.skeleton} ${className || ''}`}
            style={{ width, height }}
        />
    );
}

export function ChartSkeleton() {
    return (
        <div style={{ width: '100%', height: '100%', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header placeholder */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton width={100} height={24} />
                <Skeleton width={24} height={24} />
            </div>
            {/* Chart Area */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                <Skeleton width="10%" height="40%" />
                <Skeleton width="10%" height="70%" />
                <Skeleton width="10%" height="50%" />
                <Skeleton width="10%" height="80%" />
                <Skeleton width="10%" height="60%" />
                <Skeleton width="10%" height="30%" />
                <Skeleton width="10%" height="90%" />
                <Skeleton width="10%" height="50%" />
            </div>
        </div>
    );
}
