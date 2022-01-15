import React from 'react';
import Views from './views';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/scss/style.scss';
import { IntlProvider } from 'react-intl';
import EN from './locales/en/translation.json';

function App(): JSX.Element {
    //here will be eventually redux and router wrapper
    return (
        <IntlProvider messages={EN} locale={'en'} defaultLocale="en">
            <div className="App">
                <Views />
            </div>
        </IntlProvider>
    );
}

export default App;
