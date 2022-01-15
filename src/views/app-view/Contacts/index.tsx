import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import TableComponent from '../../../components/Table';
import Sidebar from '../../../components/Sidebar';
import { Contact } from '../../../models/Contact';
import { messageCount } from '../../../models/Sidebar';
import Alert from '../../../components/Alert';
import _ from 'lodash';

function Contacts(): JSX.Element {
    const loginUrl: string = process.env.REACT_APP_API_LOGIN_URL || '';
    const getContactsUrl: string = process.env.REACT_APP_API_CONTACTS_URL || '';
    const refreshToken: string | undefined = process.env.REACT_APP_API_REFRESH_TOKEN || '';
    const teamId: string | undefined = process.env.REACT_APP_API_TEAM_ID || '';
    const defaultTags: string[] = ['', '', '', '', ''];

    const [totalContacts, setTotalContacts] = useState<number>(0);
    const [contacts, setContacts] = useState<Contact[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const [tagsToInclude, setTagsToInclude] = useState<string[]>([]);
    const [tagsToExclude, setTagsToExclude] = useState<string[]>([]);
    const [savedIncludedTags, setSavedIncludedTags] = useState<string[]>([]);
    const [savedExcludedTags, setSavedExcludedTags] = useState<string[]>([]);
    const [msgSent, setMsgSent] = useState<messageCount>({ min: '', max: '' });
    const [msgReceived, setMsgReceived] = useState<messageCount>({ min: '', max: '' });

    const [pageNumber, setPageNumber] = useState<number>(1);

    const observer = useRef<IntersectionObserver>();
    const lastContactRef = useCallback(
        (element) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    if (totalContacts > (pageNumber - 1) * 20) {
                        fetchContacts();
                        setPageNumber(pageNumber + 1);
                    }
                }
            });
            if (element) observer.current.observe(element);
        },
        [loading, pageNumber],
    );

    const fetchContacts = (query?: string) => {
        setLoading(true);
        const params = new URLSearchParams();
        tagsToInclude.map((tag) => {
            if (tag.length > 0) {
                params.append('tags', tag);
            }
        });

        tagsToExclude.map((tag) => {
            if (tag.length > 0) {
                params.append('notTags', tag);
            }
        });

        if (msgSent.min.length > 0) {
            params.append('minMessagesSent', msgSent.min);
        }

        if (msgSent.max.length > 0) {
            params.append('maxMessagesSent', msgSent.max);
        }

        if (msgReceived.min.length > 0) {
            params.append('minMessagesRecv', msgReceived.min);
        }

        if (msgReceived.max.length > 0) {
            params.append('maxMessagesRecv', msgReceived.max);
        }

        if (query) {
            params.append('q', query);
        }

        params.append('returnTotalCount', 'true');
        params.append('count', pageNumber * 20 + '');

        axios
            .post(loginUrl, { refreshToken: refreshToken, teamId: teamId })
            .then((response) => {
                axios
                    .get(getContactsUrl, {
                        headers: { Authorization: `Bearer ${response.data.access_token}` },
                        params: params,
                    })
                    .then((response) => {
                        setTotalContacts(response.data.totalCount);
                        setContacts(
                            _.uniqBy([...contacts, ...response.data.contacts], (contact: Contact) => {
                                return contact.id;
                            }),
                        );
                        setLoading(false);
                    })
                    .catch((err) => {
                        setLoading(false);
                        setError(err.message);
                    });
            })
            .catch((err) => {
                setLoading(false);
                setError(err.message);
            });
    };

    useEffect(() => {
        if (localStorage.getItem('contactsFilters') === null) {
            const filters = {
                tagsToInclude: defaultTags,
                tagsToExclude: defaultTags,
                savedIncludedTags: defaultTags,
                savedExcludedTags: defaultTags,
                msgSent: { min: '', max: '' },
                msgReceived: { min: '', max: '' },
            };
            localStorage.setItem('contactsFilters', JSON.stringify(filters));
        }
        const filters = JSON.parse(localStorage.getItem('contactsFilters') || '');
        setTagsToInclude(filters.tagsToInclude);
        setTagsToExclude(filters.tagsToExclude);
        setSavedIncludedTags(filters.savedIncludedTags);
        setSavedExcludedTags(filters.savedExcludedTags);
        setMsgSent(filters.msgSent);
        setMsgReceived(filters.msgReceived);
    }, []);

    useEffect(() => {
        if (tagsToExclude.length > 0 && tagsToExclude.length > 0) fetchContacts();
    }, [tagsToExclude, tagsToExclude]);

    const handleTags = (position: number, type: string, tag?: string) => {
        let tags;
        if (tag) {
            if (type === 'include') {
                tags = tagsToInclude;
                tags[position] = tag;
                setTagsToInclude([...tags]);
            } else {
                tags = tagsToExclude;
                tags[position] = tag;
                setTagsToExclude([...tags]);
            }
        } else {
            if (type === 'include') {
                tags = tagsToInclude;
                tags[position] = '';
                setTagsToInclude([...tags]);
                tags = savedIncludedTags;
                tags[position] = '';
                setSavedIncludedTags([...tags]);
            } else {
                tags = tagsToExclude;
                tags[position] = '';
                setTagsToExclude([...tags]);
                tags = savedExcludedTags;
                tags[position] = '';
                setSavedExcludedTags([...tags]);
            }
        }
    };

    const handleTagSave = () => {
        const filters = {
            tagsToInclude,
            tagsToExclude,
            savedIncludedTags,
            savedExcludedTags,
            msgSent,
            msgReceived,
        };
        localStorage.setItem('contactsFilters', JSON.stringify(filters));
        fetchContacts();
    };

    return (
        <>
            {error.length > 0 && <Alert>{error}</Alert>}

            <div className="contacts-container d-flex justify-content-start align-items-start pr-3 pl-3">
                <Sidebar
                    totalContacts={totalContacts}
                    onChange={(tags, type) => {
                        if (type === 'include') {
                            setSavedIncludedTags(tags);
                        } else {
                            setSavedExcludedTags(tags);
                        }
                    }}
                    onTagSelect={(tag, position, type) => handleTags(position, type, tag)}
                    onTagRemove={(position, type) => handleTags(position, type)}
                    onSave={() => handleTagSave()}
                    tagsToInclude={tagsToInclude}
                    tagsToExclude={tagsToExclude}
                    savedIncludedTags={savedIncludedTags}
                    savedExcludedTags={savedExcludedTags}
                    msgSent={msgSent}
                    msgReceived={msgReceived}
                    onChangeMinSent={(min) => setMsgSent({ ...msgSent, min })}
                    onChangeMaxSent={(max) => setMsgSent({ ...msgSent, max })}
                    onChangeMinReceived={(min) => setMsgReceived({ ...msgReceived, min })}
                    onChangeMaxReceived={(max) => setMsgReceived({ ...msgReceived, max })}
                />
                <TableComponent
                    contactRef={lastContactRef}
                    totalContacts={totalContacts}
                    onSearch={(query) => fetchContacts(query)}
                    loading={loading}
                    getContacts={fetchContacts}
                    contactList={contacts}
                />
            </div>
        </>
    );
}
export default Contacts;
