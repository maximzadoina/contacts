import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { TagTableProps } from '../../models/TagTable';
import DeleteButton from '../Button/DeleteButton';
import CustomToggleButton from '../Button/ToggleButton';
import Input from '../Form/Input';

function TagTable({ title, selectedTags, savedTags, onTagRemove, onTagSelect, onChange }: TagTableProps): JSX.Element {
    const [newTags, setNewTags] = useState<string[]>([...savedTags]);
    useEffect(() => {
        setNewTags([...savedTags]);
    }, [savedTags]);

    return (
        <>
            <div className="custom-tag-table-title">{title}</div>
            <Table className="custom-tag-table" borderless>
                <tbody>
                    {newTags.map((tag, i) => (
                        <tr key={i}>
                            <td className="pl-2">
                                {
                                    <Input
                                        key={i}
                                        disabled={
                                            selectedTags.includes(tag) &&
                                            tag.length > 0 &&
                                            selectedTags.indexOf(tag) === i
                                        }
                                        maxLength={12}
                                        type="text"
                                        className={`tag-table-input ${
                                            tag.length > 0 &&
                                            savedTags.filter((selected) => selected === tag).length > 1
                                                ? 'tag-table-input-error'
                                                : ''
                                        }`}
                                        onChange={(e) => {
                                            const tags = [...newTags];
                                            tags[i] = e.target.value;
                                            onChange(tags);
                                        }}
                                        value={newTags[i]}
                                    />
                                }
                            </td>
                            <td>
                                <div className="d-flex justify-content-end align-items-center">
                                    <DeleteButton
                                        onClick={() => onTagRemove(i)}
                                        className={`mr-3 ${
                                            selectedTags.includes(tag) &&
                                            tag.length > 0 &&
                                            selectedTags.indexOf(tag) === i
                                                ? 'tag-table-btn'
                                                : 'tag-table-btn-hide'
                                        }`}
                                    />

                                    <CustomToggleButton
                                        size="sm"
                                        key={i}
                                        checked={selectedTags.includes(tag)}
                                        onClick={() => onTagSelect(tag, i)}
                                        value={tag + i}
                                        type="checkbox"
                                        id={tag + i}
                                        className={`tag-table-btn mr-2 btn-color-${
                                            (tag.length > 0 &&
                                                selectedTags.includes(tag) &&
                                                selectedTags.indexOf(tag) === i) ||
                                            selectedTags.filter((selectedTag) => selectedTag === tag).length > 1
                                                ? 'green'
                                                : 'gray'
                                        } ${
                                            (
                                                tag.length > 0 && selectedTags.includes(tag)
                                                    ? selectedTags.indexOf(tag) === i
                                                    : tag.length > 0
                                            )
                                                ? 'tag-table-btn'
                                                : 'tag-table-btn-hide'
                                        }`}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}
export default TagTable;
