import React from 'react';
import { useTranslate } from "./TrProvider";


export const TrChoice = () => {
    const { changeLang } = useTranslate();
    return <span>
        <span onClick={() => changeLang('pl')}>PL</span>
        <span onClick={() => changeLang('en')}>EN</span>
    </span>;
};
