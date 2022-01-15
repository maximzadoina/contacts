import React from 'react';
import { ToggleButton, ToggleButtonProps } from 'react-bootstrap';

function CustomToggleButton({ size = 'lg', className, ...props }: ToggleButtonProps): JSX.Element {
    return (
        <ToggleButton {...props} className={`custom-toggle-btn ${size} ${className}`}>
            <img src="img/check_toggle.svg" alt="check_toggle" />
        </ToggleButton>
    );
}
export default CustomToggleButton;
