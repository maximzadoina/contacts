import { LegacyRef } from 'react';
import { Contact } from './Contact';

export interface TableContacts {
    contactList: Contact[];
    getContacts: () => void;
    totalContacts: number;
    loading: boolean;
    onSearch: (query: string) => void;
    contactRef: LegacyRef<HTMLTableRowElement> | undefined;
}
