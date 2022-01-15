import React from 'react';
import { AlertProps } from 'react-bootstrap';

function Alert({ className, children, ...props }: AlertProps): JSX.Element {
    return (
        <div
            {...props}
            id="alert-danger-component"
            className={`${className} w-100 alert alert-danger alert-dismissible fade show`}
            role="alert"
        >
            <strong>Oops! </strong> {children}
        </div>
    );
}

export default Alert;
