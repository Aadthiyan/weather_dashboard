'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './DateRangePicker.module.css';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, getDay, startOfWeek, endOfWeek } from 'date-fns';

interface DateRangePickerProps {
    // In real app, pass selected dates
    startDate?: Date;
    endDate?: Date;
    onChange?: (start: Date, end: Date) => void;
}

export default function DateRangePicker({
    startDate: initialStart = new Date(2025, 0, 1),
    endDate: initialEnd = new Date(2025, 0, 19),
    onChange
}: DateRangePickerProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date | null }>({ start: initialStart, end: initialEnd });
    // View state: Show 2 consecutive months. 'viewDate' is the 1st of the left month.
    const [viewDate, setViewDate] = useState(startOfMonth(initialStart));

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

    const handleDayClick = (day: Date) => {
        if (!dateRange.start || (dateRange.start && dateRange.end)) {
            // Start new selection
            setDateRange({ start: day, end: null });
        } else {
            // Complete selection
            let newStart = dateRange.start;
            let newEnd = day;
            if (day < newStart) {
                newStart = day;
                newEnd = dateRange.start;
            }
            setDateRange({ start: newStart, end: newEnd });
            if (onChange) onChange(newStart, newEnd);
            setTimeout(() => setIsOpen(false), 500); // Close after brief delay
        }
    };

    const renderMonth = (monthDate: Date) => {
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

        // Header for Month
        const header = (
            <div className={styles.header}>
                <button className={styles.navButton} onClick={() => setViewDate(addMonths(viewDate, -1))}>
                    {isSameMonth(monthDate, viewDate) ? <ChevronLeft size={16} /> : null} {/* Only left arrow on left month */}
                </button>
                <span className={styles.monthTitle}>{format(monthDate, 'MMMM yyyy')}</span>
                <button className={styles.navButton} onClick={() => setViewDate(addMonths(viewDate, 1))}>
                    {!isSameMonth(monthDate, viewDate) ? <ChevronRight size={16} /> : null} {/* Only right arrow on right month */}
                </button>
            </div>
        );

        // Days Header
        const daysHeader = (
            <div className={styles.grid} style={{ marginBottom: 8 }}>
                {weekDays.map((d, i) => <div key={i} className={styles.dayLabel}>{d}</div>)}
            </div>
        );

        const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className={styles.calendarCol}>
                {header}
                {daysHeader}
                <div className={styles.grid}>
                    {daysInMonth.map((dayItem, idx) => {
                        const isCurrentMonth = isSameMonth(dayItem, monthStart);
                        const isSelectedStart = dateRange.start && isSameDay(dayItem, dateRange.start);
                        const isSelectedEnd = dateRange.end && isSameDay(dayItem, dateRange.end);
                        const isInRange = dateRange.start && dateRange.end && isWithinInterval(dayItem, { start: dateRange.start, end: dateRange.end });

                        let cellClass = styles.cell;
                        if (isSelectedStart) cellClass += ` ${styles.rangeStart}`;
                        else if (isSelectedEnd) cellClass += ` ${styles.rangeEnd}`;
                        else if (isInRange) cellClass += ` ${styles.inRange}`;

                        return (
                            <div
                                key={idx}
                                className={cellClass}
                                onClick={() => handleDayClick(dayItem)}
                                style={{ opacity: isCurrentMonth ? 1 : 0.3 }}
                            >
                                <span className={styles.dayNumber}>{format(dayItem, 'd')}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const formattedRange = dateRange.end
        ? `${format(dateRange.start, 'MMM d, yyyy')} - ${format(dateRange.end, 'MMM d, yyyy')}`
        : format(dateRange.start, 'MMM d, yyyy');

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
                <span>{formattedRange}</span>
                <ChevronDown size={16} style={{ marginLeft: 12, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {isOpen && (
                <div className={styles.popup}>
                    {renderMonth(viewDate)}
                    {renderMonth(addMonths(viewDate, 1))}
                </div>
            )}
        </div>
    );
}
