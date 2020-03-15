import React, { useState, useEffect } from 'react';
import { ModalCode } from '../ModalCode/ModalCode';
import { firebaseDatabase } from '../../App';
import { Button } from 'reactstrap';

interface StreamProps {
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
  
export function Stream({id}: StreamProps) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {

    const streamRef = firebaseDatabase.ref(`streams/${id}`);
    streamRef.on('value', function(snapshot) {
      const streamData = snapshot.val();
      setData(streamData);
      console.log({ streamData });
    });

    return () => streamRef.off('value');
  }, [id]);

  if (data === null) {
    return <div>{'Loading'}</div>;
  }

  return <div><h3>Strumień : {data.name}</h3><Button onClick={() => sendEvent(id)}>sendEvent</Button> {''} <ModalCode id={id} name={data.name}/><pre>{JSON.stringify(data.events, null,4)}</pre></div>;
}
