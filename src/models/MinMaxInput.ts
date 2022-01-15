import { FormControlProps } from 'react-bootstrap';

export interface MinMaxProps extends FormControlProps {
    onMinChange: (number: string) => void;
    onMaxChange: (number: string) => void;
    min: string;
    max: string;
}
