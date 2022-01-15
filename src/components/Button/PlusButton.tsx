import React from 'react';
import Button from 'react-bootstrap/Button';
import { ButtonProps } from '../../models/Button';

function PlusButton({ ...props }: ButtonProps): JSX.Element {
    return (
        <Button {...props} className="custom-plus-btn btn-color-green">
            +
        </Button>
    );
}
export default PlusButton;
