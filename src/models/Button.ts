export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    onChange?: () => void;
    color?: 'gray' | 'green';
    id?: string;
    value?: string;
}
