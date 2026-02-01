'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './LocationDropdown.module.css';
import { ChevronDown, Check } from 'lucide-react';

const LOCATIONS = [
    'Australia',
    'Belgium',
    'Brazil',
    'China',
    'Denmark',
    'India',
    'Sri Lanka',
    'Thailand'
];

interface LocationDropdownProps {
    // In a real app we'd pass selected items up
    onChange?: (locations: string[]) => void;
}

export default function LocationDropdown({ onChange }: LocationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>(LOCATIONS); // Default all selected
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleLocation = (loc: string) => {
        let newSelected;
        if (selected.includes(loc)) {
            newSelected = selected.filter(l => l !== loc);
        } else {
            newSelected = [...selected, loc];
        }
        setSelected(newSelected);
        onChange?.(newSelected);
    };

    const toggleAll = () => {
        if (selected.length === LOCATIONS.length) {
            setSelected([]);
            onChange?.([]);
        } else {
            setSelected([...LOCATIONS]);
            onChange?.([...LOCATIONS]);
        }
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
                <span>{selected.length === LOCATIONS.length ? 'All Countries Selected' : `${selected.length} Countries Selected`}</span>
                <ChevronDown size={16} style={{ marginLeft: 12, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    {/* Select All Row */}
                    <div className={styles.item} onClick={toggleAll}>
                        <span className={`${styles.label} ${selected.length === LOCATIONS.length ? styles.labelSelected : ''}`}>
                            Select all
                        </span>
                        <div className={`${styles.checkbox} ${selected.length === LOCATIONS.length ? styles.checkboxSelected : ''}`}>
                            {/* Radio circle style for select all */}
                            {selected.length === LOCATIONS.length && <div className={styles.checkboxInner} />}
                        </div>
                    </div>

                    {LOCATIONS.map(loc => {
                        const isSelected = selected.includes(loc);
                        return (
                            <div key={loc} className={styles.item} onClick={() => toggleLocation(loc)}>
                                <span className={styles.label}>{loc}</span>
                                <div className={`${styles.checkbox} ${isSelected ? styles.checkboxSelected : ''}`}>
                                    {/* Checkbox style for items usually, but design shows circles */}
                                    {isSelected && <div className={styles.checkboxInner} />}
                                </div>
                            </div>
                        );
                    })}

                    <div className={styles.footer}>
                        <button className={styles.doneButton} onClick={() => setIsOpen(false)}>Done</button>
                    </div>
                </div>
            )}
        </div>
    );
}
