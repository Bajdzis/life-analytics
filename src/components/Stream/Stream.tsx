import React, { useState, useEffect } from 'react';
import { ModalCode } from '../ModalCode/ModalCode';
import { firebaseDatabase } from '../../App';
import moment  from 'moment';
import { isEqual } from 'lodash';

import "./Stream.css";
import { SendEventButton } from './components/SendEventButton';

interface StreamProps {
  id: string;
  start: number;
  stop: number;
}

  interface StreamEvent {
    type: string;
    timestamp: number;
    payload: {
      [any: string]: string
    }
  }

  interface StreamItemRaw {
    name: string;
    events: {
      [id: string]: StreamEvent;
    }
  }

  interface StreamGroup {
    timestampMin: number;
    timestampMax: number;
    events: StreamEvent[];
  }
export function Stream({id, start, stop}: StreamProps) {
  const [name, setName] = useState<string>('');
  const [groups, setGroups] = useState<StreamGroup[] | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  useEffect(() => {
    const streamRef = firebaseDatabase.ref(`streams/${id}`);
    streamRef.on('value', function(snapshot) {
      const streamData = snapshot.val() as StreamItemRaw;
      setName(streamData.name);
      setGroups(Object.entries(streamData.events || {}).reduce((groups, [key, value]) => {
        if (start > value.timestamp || stop < value.timestamp) {
          return groups;
        }
        if(value.payload && value.payload.type) {

          delete value.payload.type;
        }
        const lastItem = groups[groups.length-1];
        const isSame = lastItem.events.length === 0 || lastItem.events.some(event => isEqual(event.payload, value.payload));

        if(isSame) {
          lastItem.events.push(value);
          if(lastItem.timestampMin > value.timestamp) {
            lastItem.timestampMin = value.timestamp;
          }
          if(lastItem.timestampMax < value.timestamp) {
            lastItem.timestampMax = value.timestamp;
          }
        }else {
          groups.push({
            events: [value],
            timestampMax: value.timestamp,
            timestampMin: value.timestamp,
          });
          if(lastItem.timestampMax < value.timestamp) {
            lastItem.timestampMax = value.timestamp;
          }
        }

        return groups;
      }, [{
        events: [],
        timestampMax: start,
        timestampMin: stop,
      }] as StreamGroup[]));
      console.log({ streamData });
    });

    return () => streamRef.off('value');
  }, [id, start, stop]);

  if (groups === null) {
    return <div>{'Loading'}</div>;
  }

  const dayTime = (stop-start) / 1000;
  return <div className="stream">
    <div className="stream__meta">
    <h3>Strumień : {name}</h3>
    <SendEventButton id={id} /> {''} <ModalCode id={id} name={name}/>
    </div>
    <div className="stream__timeline">
      {groups.map((item, indexGroup) => {
        if(item.events.length === 0) {
          return null;
        }
        const left = ((item.timestampMin-start)/1000)/ dayTime * 100;
        const right = ((item.timestampMax-start)/1000)/ dayTime * 100;
        const groupTime = (item.timestampMax-item.timestampMin) / 1000;
        const payloadText = Object.keys(item.events[0].payload || {} ).map((key) => `${key}: ${item.events[0].payload[key]}`).join('\n');
        return <div 
        title={payloadText}
        onClick={() => {
          if(selectedGroupId === indexGroup) {
            return setSelectedGroupId(null);
          }
          setSelectedGroupId(indexGroup);
        }}
        className="stream__group" 
        style={{
          left: `${left}%`, 
          width: `${right - left}%`
        }}>
          {/* {item.events.map(event => `${event.payload}`).join(', ')} */}

          
          <div 
              className="stream__time stream__time--bottom"
            >
              {Math.floor(moment.duration(moment(item.timestampMax,'x').diff(moment(item.timestampMin,'x'))).asMinutes())} min
            </div>
          <div 
              className="stream__time stream__time--left"
            >
              {moment(item.timestampMin,'x').format('HH:mm')}
            </div>
            <div 
              className="stream__payload"
            >
              {Object.keys((item.events[0] || {}).payload || {} ).map((key) => <>{key}<br/><strong className="stream__payloadValue">{item.events[0].payload[key]}</strong><br/></>)}
              
            </div>
          {item.events.map((event, index) => {
            const leftSub = ((event.timestamp-item.timestampMin)/1000)/ groupTime * 100;
            return (<div 
              className="stream__event"
              key={index}
              style={{
                left: `${leftSub}%`
              }}
            >

            </div>);
          })}

            <div 
              className="stream__time stream__time--right"
            >
              {moment(item.timestampMax,'x').format('HH:mm')}
            </div>
        </div>;
      })}
    </div>
    {selectedGroupId !== null && <div className="stream__group stream__group--selected">
    {groups[selectedGroupId].events.map((event, index) => {
      const groupTime = (groups[selectedGroupId].timestampMax-groups[selectedGroupId].timestampMin) / 1000;
            const leftSub = ((event.timestamp-groups[selectedGroupId].timestampMin)/1000)/ groupTime * 100;
            return (<div 
              className="stream__event"
              key={index}
              style={{
                left: `${leftSub}%`,
                width:'5px'
              }}
              title={event.type}
            >
              {event.type}
            </div>);})}
    </div>}
  </div>;
}
