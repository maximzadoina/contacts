import React from 'react';
import { Spinner } from 'react-bootstrap';

function SpinnerComponent(): JSX.Element {
    return (
        <Spinner
            style={{ position: 'fixed', top: '50%', left: '50%', zIndex: '2' }}
            animation="border"
            role="status"
            variant="secondary"
        >
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    );
}
export default SpinnerComponent;
