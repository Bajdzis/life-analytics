import React from 'react';
import { useTranslate } from "./TrProvider";

interface TrProps {
    label: string;
    [key:string]: string;
}

export const Tr = ({label, ...variables}:TrProps) => {
    const { translate, labels } = useTranslate();
    console.log({translate, labels}, label);
    return <span>{translate(label, variables)}</span>;
};
