import React from 'react';
import { Button } from 'reactstrap';

interface SendEventButtonProps {
  id: string;
}

const sendEvent = (streamId = '-M2TFr_wqRpCnqmBbnM2', type: string = 'start', time:number = (Math.round((new Date()).getTime()/ 1000))) => {
    fetch(`https://auto-time-72f2c.firebaseio.com/streams/${streamId}/events.json`, {
        method:'POST',
        body: JSON.stringify({
            type, 
            time
        })
    })
}

export function SendEventButton({id}: SendEventButtonProps) {
  return <Button onClick={() => sendEvent(id)}>sendEvent</Button>;
}
