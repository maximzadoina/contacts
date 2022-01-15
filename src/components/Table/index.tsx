import React, { useEffect, useState } from 'react';
import { TableContacts } from '../../models/TableContacts';
import ContactComponent from '../Contact';
import _ from 'lodash';
import { Contact } from '../../models/Contact';
import { Table, Popover, Badge, OverlayTrigger, Button } from 'react-bootstrap';
import debounce from 'lodash/debounce';
import { jsPDF } from 'jspdf';
import TableModal from './TableModal';
import PlusButton from '../Button/PlusButton';
import SpinnerComponent from '../Spinner';
import CustomToggleButton from '../Button/ToggleButton';
import { useIntl } from 'react-intl';

function TableComponent({
    contactList = [],
    onSearch,
    getContacts,
    loading,
    totalContacts,
    contactRef,
    ...props
}: TableContacts): JSX.Element {
    const [formattedContacts, setFormattedContacts] = useState<{ [key: string]: Contact[] }>({});
    const [contacts, setContacts] = useState<Contact[]>(contactList);
    const [checkedContacts, setCheckedContacts] = useState<string[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact>();
    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const t = useIntl();

    const formatContacts = () => {
        const formatted = _.groupBy(contacts, 'groupLetter');
        setFormattedContacts(formatted);
    };

    const sortAndGroup = () => {
        const sortedContacts = _.sortBy([...contacts], (contact) => contact.name[0]).map((contact) => ({
            ...contact,
            groupLetter: contact.name[0],
        }));
        const sortedGrouped = _.groupBy(sortedContacts, 'groupLetter');
        setFormattedContacts(sortedGrouped);
    };

    useEffect(() => {
        setContacts([...contactList]);
    }, [contactList]);

    useEffect(() => {
        formatContacts();
    }, [contacts]);

    const handleCheck = (checked: boolean, value: string): void => {
        if (checked) {
            setCheckedContacts([...checkedContacts, value]);
        } else {
            setCheckedContacts(checkedContacts.filter((val) => val !== value));
        }
    };

    const handleCheckAll = (checked: boolean): void => {
        if (checked) {
            setCheckedContacts(contacts.map((contact) => contact.id));
        } else {
            setCheckedContacts([]);
        }
    };

    const search = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target?.value;
        onSearch(value);
    };
    const debounceSearch = debounce(search, 600);

    const handleExportContacts = () => {
        const doc = new jsPDF();
        contacts.forEach((contact, i) => {
            doc.text('Name: ' + contact.name + ', Phone Number: +' + contact.phoneNumber, 20, 10 + i * 10);
        });
        doc.save('contacts.pdf');
    };

    return (
        <>
            {loading && <SpinnerComponent />}
            <Table className="mx-2 custom-table" borderless hover {...props}>
                <thead>
                    <tr>
                        <th className="table-header-content" colSpan={2}>
                            <h4> {t.formatMessage({ id: 'table.all_contacts' }) + '(' + totalContacts + ')'}</h4>
                        </th>
                        <th className="text-right">
                            <PlusButton
                                onClick={() => {
                                    setVisibleModal(true);
                                }}
                            />
                        </th>
                    </tr>
                    <tr>
                        <th colSpan={3}>
                            <input
                                onChange={debounceSearch}
                                placeholder="Search contacts"
                                type="text"
                                className="custom-search-input form-control"
                                id="formGroupExampleInput"
                            />
                            <img className="input-search-icon" src="/img/search.svg" alt="search" />
                        </th>
                    </tr>
                    {contacts.length > 0 && (
                        <tr className="table-header-select">
                            <th>
                                <CustomToggleButton
                                    onChange={(e) => handleCheckAll(e.target.checked)}
                                    checked={checkedContacts.length === contactList.length}
                                    value="check_all"
                                    type="checkbox"
                                    id="check_all"
                                    className={`btn-color-${
                                        checkedContacts.length === contactList.length ? 'green' : 'gray'
                                    }`}
                                />
                            </th>

                            <th className="d-flex justify-content-between align-items-center">
                                <h5>{t.formatMessage({ id: 'table.select_all' })}</h5>
                                <Button onClick={() => sortAndGroup()} className="sort-btn btn-color-green">
                                    <img src="/img/sort.svg" alt="sort" />
                                </Button>
                            </th>
                            <th style={{ textAlign: 'right' }}>
                                <Button
                                    onClick={() => handleExportContacts()}
                                    className="custom-export-btn btn-color-green"
                                >
                                    {t.formatMessage({ id: 'button.export_all' })}
                                </Button>
                            </th>
                        </tr>
                    )}
                </thead>
                <tbody>
                    {Object.keys(formattedContacts).map((letter, k) => {
                        let returnElement = null;
                        if (letter !== 'undefined')
                            returnElement = (
                                <tr key={letter} className="group-letter">
                                    <td>{letter}</td>
                                </tr>
                            );
                        else returnElement = null;
                        return [
                            returnElement,
                            ...formattedContacts[letter]?.map((contact, i) => (
                                <tr
                                    ref={
                                        k + 1 === Object.keys(formattedContacts).length &&
                                        formattedContacts[letter].length === i + 1
                                            ? contactRef
                                            : undefined
                                    }
                                    key={contact.id}
                                >
                                    <td className="check-button-td">
                                        <CustomToggleButton
                                            onChange={(e) => handleCheck(e.target.checked, e.target.value)}
                                            checked={checkedContacts.includes(contact.id)}
                                            value={contact.id}
                                            type="checkbox"
                                            id={contact.id}
                                            className={` btn-color-${
                                                checkedContacts.includes(contact.id) ? 'green' : 'gray'
                                            }`}
                                        />
                                    </td>
                                    <td>
                                        <ContactComponent key={contact.id} {...contact} />
                                    </td>
                                    <td className={contact.tags.length > 0 ? 'd-flex' : ''}>
                                        {contact.tags.length > 0 && (
                                            <OverlayTrigger
                                                rootClose
                                                trigger="click"
                                                onToggle={(nextShow) => {
                                                    const tagToggle = document.getElementById(
                                                        `tags-toggle-${contact.id}`,
                                                    );
                                                    if (tagToggle) {
                                                        if (nextShow) {
                                                            tagToggle.classList.add('visible-tags');
                                                        } else {
                                                            tagToggle.classList.remove('visible-tags');
                                                        }
                                                    }
                                                }}
                                                overlay={
                                                    <Popover>
                                                        {contact.tags.map((tag) => (
                                                            <Badge className="m-2 tag-badge" key={tag.name}>
                                                                {tag.name}
                                                            </Badge>
                                                        ))}
                                                    </Popover>
                                                }
                                            >
                                                <Button className="show-hide-tags-btn">
                                                    {t.formatMessage({ id: 'button.tags' })}{' '}
                                                    <div id={`tags-toggle-${contact.id}`}>+</div>
                                                </Button>
                                            </OverlayTrigger>
                                        )}
                                        <PlusButton
                                            className="ml-auto"
                                            onClick={() => {
                                                setSelectedContact(contact);
                                                setVisibleModal(true);
                                            }}
                                        />
                                    </td>
                                </tr>
                            )),
                        ];
                    })}
                </tbody>
            </Table>

            <TableModal
                visible={visibleModal}
                onClose={(fetch) => {
                    setSelectedContact(undefined);
                    setVisibleModal(false);
                    if (fetch) {
                        getContacts();
                    }
                }}
                contact={selectedContact}
            />
        </>
    );
}

export default TableComponent;
