import React from 'react';
import { Button, ButtonProps } from 'react-bootstrap';

function DeleteButton({ size = 'sm', className, ...props }: ButtonProps): JSX.Element {
    return (
        <Button {...props} className={`delete-btn ${size} ${className}`}>
            <img src="img/trash-fill.svg" alt="delete_button" />
        </Button>
    );
}
export default DeleteButton;
