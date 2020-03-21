import React, { useState, useContext, useEffect }  from 'react';


const loadPlLang = () => import('./langs/pl.json');
const loadEnLang = () => import('./langs/en.json');

const langLoaders: {[key: string]: (typeof loadPlLang | typeof loadEnLang)} = {
    'pl': loadPlLang,
    'pl-PL': loadPlLang,
    'en': loadEnLang,
    'en-EN': loadEnLang,
    'en-US': loadEnLang,
}

interface TranslationContextData {
    labels: { [key: string]: string},
    translate(key: string, variables?: { [key: string]: string} ):string
    changeLang(lang: string): void;
}

const TranslationContext = React.createContext<TranslationContextData>({
    labels: {},
    translate: () => '',
    changeLang: () => {},
});

export function useTranslate() {
    return useContext(TranslationContext);
}

interface TrProviderProps {
    children: React.ReactNode;
}

export const TrProvider = ({children}:TrProviderProps) => {
    const [lang, setLang] = useState<keyof typeof langLoaders>('en');
    const [labels, setLabels] = useState<{ [key: string]: string}>({});

    useEffect(() => {
        let currentLanguage = 'en';
        for (const langKey of navigator.languages) {
            if(langLoaders[langKey]) {
                currentLanguage = langKey;
                break;
            }
        }
        setLang(currentLanguage);
    }, []);

    useEffect(() => {
        let block = false;
        langLoaders[lang]().then((labels) => {
            if(block){
                return;
            } 
            setLabels(labels.default);
        });
        return () => {
            block = true;
        }
    }, [lang]);

    function translate(key: string, variables: { [key: string]: string} = {}) {
        const regExp = /\$\(([a-z]+)\)/g;

        if (!labels[key]) {
            return `${key}`;
        }

        if (typeof labels[key] !== 'string') {
            return labels[key];
        }

        return labels[key].replace(regExp, (match, group) => {
            return variables[group];
        });
    }

    function changeLang(lang: string) {
        if(langLoaders[lang]) {
            setLang(lang);
        } else {
            console.error(`Unknown language ${lang}`);
        }
    } 

    return <TranslationContext.Provider value={{
        labels, 
        translate,
        changeLang
    }}> {children}</TranslationContext.Provider>
}