import React from 'react';
import { MinMaxProps } from '../../models/MinMaxInput';
import Input from '../Form/Input';

function MinMaxInput({ min, max, onMinChange, onMaxChange, className, title, ...props }: MinMaxProps): JSX.Element {
    return (
        <div className={className}>
            <div className="mb-1 custom-tag-table-title">{title}</div>
            <div className="d-flex justify-content-between">
                <Input
                    value={min}
                    onChange={(e) => onMinChange(e.target.value)}
                    type="number"
                    placeholder="Min"
                    className="min-max-input"
                    {...props}
                />
                <Input
                    value={max}
                    onChange={(e) => onMaxChange(e.target.value)}
                    type="number"
                    placeholder="Max"
                    className="min-max-input"
                    {...props}
                />
            </div>
        </div>
    );
}
export default MinMaxInput;
