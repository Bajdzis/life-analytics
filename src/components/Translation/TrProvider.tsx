import React  from 'react';

import plLang from './langs/pl.json';
import enLang from './langs/en.json';

interface TranslationContextData {
    language: { [key: string]: string},
    translate(key: string, variables?: { [key: string]: string} ):string
}

export const TranslationContext = React.createContext<TranslationContextData>({
    language: enLang,
    translate: () => ''
});

interface TrProviderProps {
    children: React.ReactNode;
}

export const TrProvider = ({children}:TrProviderProps) => {
    const language = plLang as { [key: string]: string};
    function translate(key: string, variables: { [key: string]: string} = {}) {
        const regExp = /\$\(([a-z]+)\)/g;

        if (!language[key]) {
            return `${key}`;
        }

        if (typeof language[key] !== 'string') {
            return language[key];
        }

        return language[key].replace(regExp, (match, group) => {
            return variables[group];
        });
    }

    return <TranslationContext.Provider value={{
        translate,
        language
    }}> {children}</TranslationContext.Provider>
}