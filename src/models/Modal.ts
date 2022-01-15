export interface ModalProps {
    visible: boolean;
    onClose: (fetch?: boolean) => void;
    title?: string;
    body?: JSX.Element | string;
    footer?: JSX.Element;
}
