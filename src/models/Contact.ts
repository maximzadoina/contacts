import { Img } from './Img';
import { Tag } from './Tag';
export interface Contact {
    id: string;
    accountId?: string;
    type?: string;
    name: string;
    platformNames?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    phoneNumber: string;
    email: string;
    img?: Img;
    tags: Tag[];
    assignee?: string;
    assigner?: string;
    messagesSent?: number;
    messagesReceived?: number;
}
