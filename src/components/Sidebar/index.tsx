import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'react-bootstrap';
import { SidebarProps } from '../../models/Sidebar';
import TagTable from '../TagTable';
import MinMaxInput from '../MinMaxInput';
function Sidebar({
    tagsToInclude,
    tagsToExclude,
    savedIncludedTags,
    savedExcludedTags,
    onTagRemove,
    onTagSelect,
    onChange,
    onSave,
    totalContacts,
    onChangeMinSent,
    onChangeMaxSent,
    onChangeMinReceived,
    onChangeMaxReceived,
    msgSent,
    msgReceived,
}: SidebarProps): JSX.Element {
    const [open, setOpen] = useState<boolean>(false);
    const t = useIntl();
    return (
        <div className={`sidebar-container pt-3 pr-4 pl-1 ${open ? 'open-sidebar' : 'closed-sidebar'}`}>
            <div className="d-flex align-items-center justify-content-between">
                <img
                    className="sidenav-icon"
                    onClick={() => setOpen(!open)}
                    src="/img/sidebar.svg"
                    alt="sidebar_icon"
                />
                <h4 className="ml-5">Audience</h4>
                <div className="sidebar-contacts-count">{totalContacts} Contacts</div>
            </div>

            <div className="pt-1 sidebar-content">
                <TagTable
                    onChange={(tags) => {
                        onChange(tags, 'include');
                    }}
                    onTagRemove={(tagPosition) => onTagRemove(tagPosition, 'include')}
                    onTagSelect={(tag, tagPosition) => onTagSelect(tag, tagPosition, 'include')}
                    title={t.formatMessage({ id: 'tag_table.include_tags' })}
                    selectedTags={tagsToInclude}
                    savedTags={savedIncludedTags}
                />
                <TagTable
                    onChange={(tags) => onChange(tags, 'exclude')}
                    onTagRemove={(tagPosition) => onTagRemove(tagPosition, 'exclude')}
                    onTagSelect={(tag, tagPosition) => onTagSelect(tag, tagPosition, 'exclude')}
                    title={t.formatMessage({ id: 'tag_table.exclude_tags' })}
                    selectedTags={tagsToExclude}
                    savedTags={savedExcludedTags}
                />

                <MinMaxInput
                    min={msgSent.min}
                    max={msgSent.max}
                    onMinChange={(min) => onChangeMinSent(min)}
                    onMaxChange={(max) => onChangeMaxSent(max)}
                    title={t.formatMessage({ id: 'tag_table.message_sent' })}
                />
                <MinMaxInput
                    min={msgReceived.min}
                    max={msgReceived.max}
                    onMinChange={(min) => onChangeMinReceived(min)}
                    onMaxChange={(max) => onChangeMaxReceived(max)}
                    className="mb-2"
                    title={t.formatMessage({ id: 'tag_table.message_received' })}
                />

                <Button
                    onClick={() => {
                        setOpen(false);
                        onSave();
                    }}
                    type="submit"
                    className="save-filters custom-save-btn btn-color-green"
                >
                    {t.formatMessage({ id: 'button.save_filters' })}
                </Button>
            </div>
        </div>
    );
}
export default Sidebar;
