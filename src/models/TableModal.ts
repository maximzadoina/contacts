import { Contact } from './Contact';
import { ModalProps } from './Modal';

export interface TableModalProps extends ModalProps {
    contact?: Contact;
}
