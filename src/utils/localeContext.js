import React from 'react';

const defaultLocaleContext = ['fr', () => { }];

const LocaleContext = React.createContext(defaultLocaleContext);

export const useLocaleContext = () => {
    const [locale, setLocale] = React.useContext(LocaleContext);
    return {
        locale: locale,
        setLocale: setLocale,
    };
};

export default LocaleContext;
