import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormGroup } from 'reactstrap';

interface ModalCodeProps {
  id: string;
  name: string;
};

export function ModalCode ({id, name}:ModalCodeProps)  {
    const code = `fetch(\`https://auto-time-72f2c.firebaseio.com/streams/${id}/events.json\`, {
    method:'POST',
    body: JSON.stringify({
        type: 'some.name', 
        timestamp: (new Date()).getTime()
    })
})`;
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <>
      <Button color="success" onClick={toggle}>Pobierz kod</Button>
      <Modal isOpen={modal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Stream {name}</ModalHeader>
        <ModalBody>
          <FormGroup>
                <Label for="exampleText">Ten strumień posiada id:</Label>
                <Input readOnly={true} type="text" name="text" value={id}/>
          </FormGroup>
          <FormGroup>
                <Label for="exampleText">Example JS integration</Label>
                <Input readOnly={true} type="textarea" name="text" value={code} style={{minHeight:'250px'}}/>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}