import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormGroup } from 'reactstrap';
import { Tr } from '../Translation/Tr';

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
        <ModalHeader toggle={toggle}><Tr label="streamModal.title" name={name}/></ModalHeader>
        <ModalBody>
          <FormGroup>
                <Label for="id"><Tr label="streamModal.id" /> </Label>
                <Input readOnly={true} id="id" type="text" name="text" value={id}/>
          </FormGroup>
          <FormGroup>
                <Label ><Tr label="streamModal.plugins" /> </Label>
                <br/>
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/Bajdzis/life-analytics-browser">
                  <Button color="secondary" ><Tr label="streamModal.plugins.chrome" /></Button>
                </a>
          </FormGroup>
          <FormGroup>
                <Label for="code"><Tr label="streamModal.id" /></Label>
                <Input readOnly={true} id="code" type="textarea" name="text" value={code} style={{minHeight:'250px'}}/>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}><Tr label="modal.close" /></Button>
        </ModalFooter>
      </Modal>
    </>
  );
}