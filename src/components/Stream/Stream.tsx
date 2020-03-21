import React, { useState, useEffect, useMemo } from 'react';
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

  interface StreamEventRaw {
    type: string;
    time: number;
    color?: string;
    payload: {
      [any: string]: string
    }
  }

  interface StreamItemRaw {
    name: string;
    events: {
      [id: string]: StreamEventRaw;
    }
  }

  interface StreamGroup {
    timestampMin: number;
    timestampMax: number;
    events: StreamEventRaw[];
  }
export function Stream({id, start, stop}: StreamProps) {
  const [name, setName] = useState<string>('');
  const [rawData, setRawData] = useState<StreamItemRaw['events']>({});
  const [groups, setGroups] = useState<StreamGroup[] | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const streamRef = useMemo(() => firebaseDatabase.ref(`streams/${id}`), [id]);

  useEffect(() => {
    // const awesomeMap = new Map<{[key: string]: string}, StreamEventRaw>();
    setGroups(Object.entries(rawData).reduce((groups, [key, value]) => {
      if (start > value.time || stop < value.time) {
        return groups;
      }

      const lastItem = groups[groups.length-1];
      const isSame = lastItem.events.length === 0 || lastItem.events.some(event => isEqual(event.payload, value.payload));
      // const isSame = lastItem.events.length === 0 || lastItem.events.some(event => isEqual(event.payload, value.payload));

      if(isSame) {
        lastItem.events.push(value);
        if(lastItem.timestampMin > value.time) {
          lastItem.timestampMin = value.time;
        }
        if(lastItem.timestampMax < value.time) {
          lastItem.timestampMax = value.time;
        }
        if(value.type.indexOf('stop.') === 0) {
          groups.push({
            events: [],
            timestampMax: 0,
            timestampMin: 99999999999999,
          });
        }
      }else {
        groups.push({
          events: [value],
          timestampMax: value.time,
          timestampMin: value.time,
        });
        if(lastItem.timestampMax < value.time) {
          lastItem.timestampMax = value.time;
        }
      }

      return groups;
    }, [{
      events: [],
      timestampMax: 0,
      timestampMin: 99999999999999,
    }] as StreamGroup[]));
    console.log({ rawData });
  }, [rawData]);

  useEffect(() => {
    function handler(snapshot: firebase.database.DataSnapshot) {
      const streamData = snapshot.val() as StreamItemRaw;
      setName(streamData.name || '');
      setRawData(streamData.events || {});
    }
    streamRef.on('value', handler);

    return () => streamRef.off('value', handler);
  }, [streamRef]);

  if (groups === null) {
    return <div>{'Loading'}</div>;
  }

  const dayTime = (stop-start) ;
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
        const left = ((item.timestampMin-start))/ dayTime * 100;
        const right = ((item.timestampMax-start))/ dayTime * 100;
        const groupTime = (item.timestampMax-item.timestampMin) ;
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
              {Math.floor(moment.duration(moment(item.timestampMax,'X').diff(moment(item.timestampMin,'X'))).asMinutes())} min
            </div>
          <div 
              className="stream__time stream__time--left"
            >
              {moment(item.timestampMin,'X').format('HH:mm')}
            </div>
            <div 
              className="stream__payload"
            >
              {Object.keys((item.events[0] || {}).payload || {} ).map((key) => <>{key}<br/><strong className="stream__payloadValue">{item.events[0].payload[key]}</strong><br/></>)}
              
            </div>
          {item.events.map((event, index) => {
            const leftSub = ((event.time-item.timestampMin))/ groupTime * 100;
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
              {moment(item.timestampMax,'X').format('HH:mm')}
            </div>
        </div>;
      })}
    </div>
    {selectedGroupId !== null && <div className="stream__group stream__group--selected">
    {groups[selectedGroupId].events.map((event, index) => {
      const groupTime = (groups[selectedGroupId].timestampMax-groups[selectedGroupId].timestampMin) / 1000;
            const leftSub = ((event.time-groups[selectedGroupId].timestampMin)/1000)/ groupTime * 100;
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
