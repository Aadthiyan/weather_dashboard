'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './MetricDropdown.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

export type MetricType =
    | 'Temperature'
    | 'Relative Humidity'
    | 'Apparent Temperature'
    | 'Precipitation'
    | 'Sea Level Pressure'
    | 'Wind Speed';

const METRICS: MetricType[] = [
    'Temperature',
    'Relative Humidity',
    'Apparent Temperature',
    'Precipitation',
    'Sea Level Pressure',
    'Wind Speed'
];

interface MetricDropdownProps {
    selectedMetric: MetricType;
    onChange: (metric: MetricType) => void;
}

export default function MetricDropdown({ selectedMetric, onChange }: MetricDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (metric: MetricType) => {
        onChange(metric);
        setIsOpen(false);
    };

    return (
        <div className={styles.container} ref={containerRef}>
            {/* When closed, just show the Trigger */}
            {!isOpen && (
                <div className={styles.trigger} onClick={() => setIsOpen(true)}>
                    <span className={styles.selectedText}>{selectedMetric}</span>
                    <div className={styles.arrow}>
                        <ChevronDown size={20} />
                    </div>
                </div>
            )}

            {/* When open, show the Dropdown Menu which INCLUDES the header */}
            {isOpen && (
                <div className={styles.dropdownMenu}>
                    {/* Header Row: Click to Close */}
                    <div
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 4 }}
                        onClick={() => setIsOpen(false)}
                    >
                        <span className={styles.optionSelected}>{selectedMetric}</span>
                        <div className={`${styles.arrow} ${styles.arrowOpen}`}>
                            <ChevronDown size={20} />
                        </div>
                    </div>

                    {/* List of ALL metrics */}
                    {METRICS.map((metric) => (
                        <div
                            key={metric}
                            className={`${styles.option} ${metric === selectedMetric ? styles.activeItem : ''}`}
                            onClick={() => handleSelect(metric)}
                        >
                            {metric}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
