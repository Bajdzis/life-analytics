import React from 'react';
import { Button } from 'reactstrap';

interface SendEventButtonProps {
  id: string;
}

const sendEvent = (streamId = '-M2TFr_wqRpCnqmBbnM2', type: string = 'life-analytics-page', timestamp:number = (new Date()).getTime()) => {
    fetch(`https://auto-time-72f2c.firebaseio.com/streams/${streamId}/events.json`, {
        method:'POST',
        body: JSON.stringify({
            type, 
            timestamp
        })
    })
}

export function SendEventButton({id}: SendEventButtonProps) {
  return <Button onClick={() => sendEvent(id)}>sendEvent</Button>;
}
