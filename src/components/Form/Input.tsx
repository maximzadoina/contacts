import React from 'react';
import { FormControlProps } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

interface InputProps extends FormControlProps {
    maxLength?: number;
}

function Input({ maxLength, ...props }: InputProps): JSX.Element {
    return <Form.Control maxLength={maxLength?.toString()} className="custom-text-input" {...props} />;
}
export default Input;
