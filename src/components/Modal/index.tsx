import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { ModalProps } from '../../models/Modal';

function ModalComponent({ onClose, visible, title, body, footer }: ModalProps): JSX.Element {
    return (
        <Modal className="custom-modal" show={visible} onHide={() => onClose()} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>{footer}</Modal.Footer>
        </Modal>
    );
}
export default ModalComponent;
