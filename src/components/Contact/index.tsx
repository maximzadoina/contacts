import React from 'react';
import { Contact } from '../../models/Contact';
import Image from 'react-bootstrap/Image';

function ContactComponent({ ...props }: Contact): JSX.Element {
    return (
        <>
            <div className="contact">
                <Image className="contact-img" roundedCircle src={props.img?.url || '/img/contact.webp'} />
                <div className="contact-name">{props.name}</div>
                <div className="contact-phone-number">+{props.phoneNumber}</div>
                <div className="contact-line" />
            </div>
        </>
    );
}

export default ContactComponent;
