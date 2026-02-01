import { render, screen, fireEvent } from '@testing-library/react';
import MetricDropdown from './MetricDropdown';
import '@testing-library/jest-dom';

describe('MetricDropdown', () => {
    it('renders with the selected metric', () => {
        // Arrange
        const selected = 'Temperature';
        const mockChange = jest.fn();

        // Act
        render(<MetricDropdown selectedMetric={selected} onChange={mockChange} />);

        // Assert
        expect(screen.getByText('Temperature')).toBeInTheDocument();
    });

    it('opens menu when clicked', () => {
        // Arrange
        const selected = 'Temperature';
        const mockChange = jest.fn();
        render(<MetricDropdown selectedMetric={selected} onChange={mockChange} />);

        // Act - Click basic trigger to open (assuming implementation details from previous turn)
        // We check for the dropdown items that should appear.
        const trigger = screen.getByText('Temperature');
        fireEvent.click(trigger);

        // Assert - 'Wind Speed' is one of the options in the list
        expect(screen.getByText('Wind Speed')).toBeInTheDocument();
    });

    it('calls onChange when an option is selected', () => {
        // Arrange
        const selected = 'Temperature';
        const mockChange = jest.fn();
        render(<MetricDropdown selectedMetric={selected} onChange={mockChange} />);

        // Act
        fireEvent.click(screen.getByText('Temperature')); // Open
        fireEvent.click(screen.getByText('Precipitation')); // Select

        // Assert
        expect(mockChange).toHaveBeenCalledWith('Precipitation');
    });
});
