import React, { useContext }  from 'react';
import { TranslationContext } from "./TrProvider";

interface TrProps {
    label: string;
    [key:string]: string;
}

export const Tr = ({label, ...variables}:TrProps) => {
    const tr = useContext(TranslationContext);
    return <span>{tr.translate(label, variables)}</span>;
};
