import React from 'react';
import { Button } from 'reactstrap';
import { Tr } from '../../Translation/Tr';

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
  return <>
    <Button onClick={() => sendEvent(id, 'start.button')}><Tr label="send.event.button.start" /></Button>
    {' '}
    <Button onClick={() => sendEvent(id, 'stop.button')}><Tr label="send.event.button.stop" /></Button>
  </>;
}
