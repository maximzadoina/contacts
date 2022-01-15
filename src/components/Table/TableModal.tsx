import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { TableModalProps } from '../../models/TableModal';
import ModalComponent from '../Modal';
import { Form, Badge, Button } from 'react-bootstrap';
import debounce from 'lodash/debounce';
import { Contact } from '../../models/Contact';
import axios from 'axios';
import PlusButton from '../Button/PlusButton';
import Input from '../Form/Input';
import SpinnerComponent from '../Spinner';
import Alert from '../Alert';

function TableModal({ visible, onClose, contact }: TableModalProps): JSX.Element {
    const loginUrl: string = process.env.REACT_APP_API_LOGIN_URL || '';
    const updateContactsUrl: string = process.env.REACT_APP_API_UPDATE_CONTACTS_URL || '';
    const createContactsUrl: string = process.env.REACT_APP_API_CREATE_CONTACTS_URL || '';
    const deleteContactsUrl: string = process.env.REACT_APP_API_DELETE_CONTACTS_URL || '';
    const refreshToken: string | undefined = process.env.REACT_APP_API_REFRESH_TOKEN || '';
    const teamId: string | undefined = process.env.REACT_APP_API_TEAM_ID || '';

    const t = useIntl();

    const formRef = useRef<HTMLFormElement>(null);
    const [newContact, setNewContact] = useState<Contact>({
        id: '',
        name: '',
        phoneNumber: '',
        tags: [],
        email: '',
    });
    const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
    const [invalidPhoneNumber, setInvalidPhoneNumber] = useState<boolean>(false);
    const [invalidName, setInvalidName] = useState<boolean>(false);
    const [tag, setTag] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<string>('');

    useEffect(() => {
        setNewContact(
            contact || {
                id: '',
                name: '',
                phoneNumber: '',
                tags: [],
                email: '',
            },
        );
    }, [contact]);

    useEffect(() => {
        setTimeout(() => setAlert(''), 10000);
    }, [alert]);

    const handleDelete = () => {
        setLoading(true);
        debouncedDelete();
    };

    const deleteContact = () => {
        axios.post(loginUrl, { refreshToken: refreshToken, teamId: teamId }).then((response) => {
            axios
                .delete(deleteContactsUrl, {
                    headers: { Authorization: `Bearer ${response.data.access_token}` },
                    params: { contacts: newContact.id },
                })
                .then(() => {
                    setLoading(false);
                    onClose(true);
                });
        });
    };

    const debouncedDelete = debounce(deleteContact, 500);

    const handleSubmit = () => {
        if (!newContact.email) {
            setInvalidEmail(true);
            return;
        }

        const validateEmail = newContact.email
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            );

        if (validateEmail === null) {
            setInvalidEmail(true);
            return;
        }

        if (newContact.phoneNumber.length < 7) {
            setInvalidPhoneNumber(true);
            return;
        }

        if (newContact.name.length < 3) {
            setInvalidName(true);
            return;
        }
        setLoading(true);
        debounceUpdate();
    };

    const updateContacts = () => {
        axios
            .post(loginUrl, { refreshToken: refreshToken, teamId: teamId })
            .then((response) => {
                if (contact) {
                    axios
                        .patch(
                            updateContactsUrl,
                            {
                                patch: {
                                    name: newContact.name,
                                    phoneNumber: newContact.phoneNumber,
                                    email: newContact.email,
                                    tags: newContact.tags,
                                },
                            },
                            {
                                headers: { Authorization: `Bearer ${response.data.access_token}` },
                                params: { contacts: newContact.id },
                            },
                        )
                        .then(() => {
                            setLoading(false);
                            onClose(true);
                        })
                        .catch((err) => {
                            setAlert(err.message);
                            setLoading(false);
                        });
                } else {
                    axios
                        .post(
                            createContactsUrl,
                            {
                                contacts: [
                                    {
                                        name: newContact.name,
                                        email: newContact.email,
                                        phoneNumber: newContact.phoneNumber,
                                        tags: newContact.tags.map((tag) => tag.name),
                                    },
                                ],
                            },
                            {
                                headers: { Authorization: `Bearer ${response.data.access_token}` },
                            },
                        )
                        .then(() => {
                            setLoading(false);
                            onClose(true);
                        })
                        .catch((err) => {
                            setAlert(err.message);
                            setLoading(false);
                        });
                }
            })
            .catch((err) => {
                setAlert(err.message);
                setLoading(false);
            });
    };

    const debounceUpdate = debounce(updateContacts, 500);

    const Body = (
        <>
            {loading && <SpinnerComponent />}
            <Form id="contact-form" ref={formRef}>
                <Form.Group className="mb-3">
                    <Form.Label>{t.formatMessage({ id: 'table.name' })}</Form.Label>
                    <Input
                        isInvalid={invalidName}
                        onChange={(e) => {
                            setInvalidName(false);
                            setNewContact({ ...newContact, name: e.target.value });
                        }}
                        type="text"
                        value={newContact.name || ''}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{t.formatMessage({ id: 'table.email' })}</Form.Label>
                    <Input
                        isInvalid={invalidEmail}
                        onChange={(e) => {
                            setInvalidEmail(false);
                            setNewContact({ ...newContact, email: e.target.value });
                        }}
                        type="email"
                        value={newContact.email || ''}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{t.formatMessage({ id: 'table.phone' })}</Form.Label>
                    <Input
                        type="number"
                        isInvalid={invalidPhoneNumber}
                        value={newContact.phoneNumber || ''}
                        onChange={(e) => {
                            setInvalidPhoneNumber(false);
                            setNewContact({ ...newContact, phoneNumber: e.target.value });
                        }}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{t.formatMessage({ id: 'table.tags' })}</Form.Label>
                    <div className="d-flex justify-content-start align-items-center">
                        <Input
                            value={tag || ''}
                            style={{ borderRadius: '15px', maxWidth: '10rem' }}
                            onChange={(e) => setTag(e.target.value)}
                        />
                        <div className="ml-4">
                            {tag && tag?.length > 1 && (
                                <PlusButton
                                    onClick={() => {
                                        setNewContact({ ...newContact, tags: [...newContact.tags, { name: tag }] });
                                        setTag('');
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    {newContact.tags.map((tag) => (
                        <Badge
                            onClick={() =>
                                setNewContact({
                                    ...newContact,
                                    tags: newContact.tags.map((tagToModify) =>
                                        tag.name === tagToModify.name
                                            ? { ...tagToModify, remove: !tagToModify.remove }
                                            : tagToModify,
                                    ),
                                })
                            }
                            className={`mt-3 mr-3 tag-badge ${tag.remove ? 'tag-badge-removed' : ''}`}
                            key={tag.name}
                        >
                            {tag.name}
                        </Badge>
                    ))}
                </Form.Group>
            </Form>
        </>
    );
    const Footer = (
        <>
            {contact && (
                <>
                    <div className="w-100 d-flex justify-content-center">
                        <Button
                            disabled={loading}
                            onClick={() => handleDelete()}
                            type="submit"
                            className="custom-save-btn btn-color-red"
                        >
                            {t.formatMessage({ id: 'button.delete' })}
                        </Button>
                    </div>
                </>
            )}
            <div className="w-100 d-flex justify-content-center">
                <Button
                    disabled={loading}
                    onClick={() => handleSubmit()}
                    type="submit"
                    className="custom-save-btn btn-color-green"
                >
                    {t.formatMessage({ id: 'button.save' })}
                </Button>
            </div>
            {alert.length > 0 && <Alert>{alert}</Alert>}
        </>
    );

    return (
        <ModalComponent
            title={contact?.name || t.formatMessage({ id: 'table.new_contact' })}
            visible={visible}
            onClose={onClose}
            body={Body}
            footer={Footer}
        />
    );
}
export default TableModal;
