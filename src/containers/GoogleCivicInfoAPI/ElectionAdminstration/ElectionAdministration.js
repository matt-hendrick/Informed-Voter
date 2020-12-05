import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

toast.configure();
function ElectionAdminstration() {
  // user's address
  const [address, setAddress] = useState(null);
  // response data from Google Civic Information API
  const [results, setResults] = useState(null);

  const notify = (message, position, type) => {
    if (type === 'success') {
      toast.success(message, { position: position, autoClose: 2000 });
    }
    if (type === 'error') {
      toast.error(message, { position: position, autoClose: 6000 });
    }
  };

  // handles user entry of address and retrieves data from API
  const addressHandler = (event) => {
    event.preventDefault();
    // get request to API via Node backend.
    // passes user's address as a query and voterinfo to specify the correct URI
    axios
      .get('/VoterInfo', {
        params: { address: address, url: 'voterinfo' },
      })
      .then((response) => {
        if (!response.data.error) {
          setResults(response.data);
          notify(
            'Address Entered Successfuly!',
            toast.POSITION.TOP_CENTER,
            'success'
          );
        } else if (response.data.error) {
          notify(
            response.data.error.message +
              '. Please verify that the address was typed correctly. If not included originally, including your city, state, and zip code may improve search results.',
            toast.POSITION.TOP_CENTER,
            'error'
          );
        }
      });
  };

  // handles updating the address as the user types
  const addressChangedHandler = (event) => {
    const updatedAddress = event.target.value;
    setAddress(updatedAddress);
  };

  const toTitleCase = (str) => {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  };

  // variables for displaying mapped data and normalized address
  let stateElectionAdminDisplay = null;
  let normalizedAddressDisplay = null;
  let localElectionAdminDisplay = null;

  if (results) {
    if (results.state[0].electionAdministrationBody) {
      stateElectionAdminDisplay = results.state.map((data) => {
        let stateAdminWebsite = null;
        let stateAbsenteeWebsite = null;
        let stateBallotInfoWebsite = null;
        let stateRegistrationWebsite = null;
        let stateRegistrationConfirmationWebsite = null;
        let stateElectionRulesWebsite = null;
        let stateNoticeText = null;
        let stateElectionsOfficeAddress = null;
        let stateAddressDisplay = null;
        if (data.electionAdministrationBody.electionInfoUrl) {
          stateAdminWebsite = (
            <ListGroupItem>
              Website: {data.electionAdministrationBody.electionInfoUrl}
            </ListGroupItem>
          );
        }
        if (data.electionAdministrationBody.absenteeVotingInfoUrl) {
          stateAbsenteeWebsite = (
            <ListGroupItem>
              Absentee Voting Information:{' '}
              {data.electionAdministrationBody.absenteeVotingInfoUrl}
            </ListGroupItem>
          );
        }
        if (data.electionAdministrationBody.ballotInfoUrl) {
          stateBallotInfoWebsite = (
            <ListGroupItem>
              Ballot Information:{' '}
              {data.electionAdministrationBody.ballotInfoUrl}
            </ListGroupItem>
          );
        }
        if (data.electionAdministrationBody.electionRegistrationUrl) {
          stateRegistrationWebsite = (
            <ListGroupItem>
              Register to Vote:{' '}
              {data.electionAdministrationBody.electionRegistrationUrl}
            </ListGroupItem>
          );
        }
        if (
          data.electionAdministrationBody.electionRegistrationConfirmationUrl
        ) {
          stateRegistrationConfirmationWebsite = (
            <ListGroupItem>
              Check your voter registration status:{' '}
              {
                data.electionAdministrationBody
                  .electionRegistrationConfirmationUrl
              }
            </ListGroupItem>
          );
        }
        if (data.electionAdministrationBody.electionRulesUrl) {
          stateElectionRulesWebsite = (
            <ListGroupItem>
              Election Rules: {data.electionAdministrationBody.electionRulesUrl}
            </ListGroupItem>
          );
        }
        if (data.electionAdministrationBody.electionNoticeText) {
          stateNoticeText = (
            <ListGroupItem>
              Election Notice:{' '}
              {data.electionAdministrationBody.electionNoticeText}
            </ListGroupItem>
          );
        }
        if (data.electionAdministrationBody.physicalAddress) {
          if (data.electionAdministrationBody.physicalAddress.line2) {
            stateElectionsOfficeAddress =
              data.electionAdministrationBody.physicalAddress.line1 +
              ' ' +
              data.electionAdministrationBody.physicalAddress.line2 +
              ' ' +
              data.electionAdministrationBody.physicalAddress.city +
              ' ' +
              data.electionAdministrationBody.physicalAddress.state +
              ' ' +
              data.electionAdministrationBody.physicalAddress.zip;
            stateAddressDisplay = (
              <ListGroupItem>
                Elections Office Address: {stateElectionsOfficeAddress}
              </ListGroupItem>
            );
          } else {
            stateElectionsOfficeAddress =
              data.electionAdministrationBody.physicalAddress.line1 +
              ' ' +
              data.electionAdministrationBody.physicalAddress.city +
              ' ' +
              data.electionAdministrationBody.physicalAddress.state +
              ' ' +
              data.electionAdministrationBody.physicalAddress.zip;
            stateAddressDisplay = (
              <ListGroupItem>
                Elections Office Address: {stateElectionsOfficeAddress}
              </ListGroupItem>
            );
          }
        }

        return (
          <Card
            style={{ width: '25rem' }}
            key={data.electionAdministrationBody.electionInfoUrl}
          >
            <Card.Body>
              <Card.Title>
                {data.name} Election Administration Information
              </Card.Title>
              <ListGroup className="list-group-flush">
                {stateAdminWebsite}
                {stateAbsenteeWebsite}
                {stateBallotInfoWebsite}
                {stateRegistrationWebsite}
                {stateRegistrationConfirmationWebsite}
                {stateElectionRulesWebsite}
                {stateNoticeText}
                {stateAddressDisplay}
              </ListGroup>
            </Card.Body>
          </Card>
        );
      });
    }
    if (!results.state[0].electionAdministrationBody) {
      stateElectionAdminDisplay = (
        <Container>
          No information was found on the election administration in your area
        </Container>
      );
    }
    // local election administration
    if (results.state[0].local_jurisdiction) {
      if (results.state[0].local_jurisdiction.electionAdministrationBody) {
        localElectionAdminDisplay = results.state.map((data) => {
          let localAdminName = 'Local';
          let localAdminWebsite = null;
          let localAdminPhone = null;
          let localAdminEmail = null;
          let localAdminAddress = null;
          let localAddressDisplay = null;
          if (data.local_jurisdiction.name) {
            localAdminName = data.local_jurisdiction.name;
          }
          if (
            data.local_jurisdiction.electionAdministrationBody.electionInfoUrl
          ) {
            localAdminWebsite = (
              <ListGroupItem>
                Website:{' '}
                {
                  data.local_jurisdiction.electionAdministrationBody
                    .electionInfoUrl
                }
              </ListGroupItem>
            );
          }
          if (
            data.local_jurisdiction.electionAdministrationBody
              .electionOfficials[0].officePhoneNumber
          ) {
            localAdminPhone = (
              <ListGroupItem>
                Phone:{' '}
                {
                  data.local_jurisdiction.electionAdministrationBody
                    .electionOfficials[0].officePhoneNumber
                }
              </ListGroupItem>
            );
          }
          if (
            data.local_jurisdiction.electionAdministrationBody
              .electionOfficials[0].emailAddress
          ) {
            localAdminEmail = (
              <ListGroupItem>
                Email:{' '}
                {
                  data.local_jurisdiction.electionAdministrationBody
                    .electionOfficials[0].emailAddress
                }
              </ListGroupItem>
            );
          }
          if (
            data.local_jurisdiction.electionAdministrationBody.physicalAddress
          ) {
            localAdminAddress = toTitleCase(
              data.local_jurisdiction.electionAdministrationBody.physicalAddress
                .line1 +
                ' ' +
                data.local_jurisdiction.electionAdministrationBody
                  .physicalAddress.city +
                ' ' +
                data.local_jurisdiction.electionAdministrationBody
                  .physicalAddress.state +
                ' ' +
                data.local_jurisdiction.electionAdministrationBody
                  .physicalAddress.zip
            );

            localAddressDisplay = (
              <ListGroupItem>Address : {localAdminAddress}</ListGroupItem>
            );
          }
          return (
            <Card key={localAdminName}>
              <Card.Body>
                <Card.Title>
                  {localAdminName} Election Administration Information
                </Card.Title>
                <ListGroup className="list-group-flush">
                  {localAdminWebsite}
                  {localAdminPhone}
                  {localAdminEmail}
                  {localAddressDisplay}
                </ListGroup>
              </Card.Body>
            </Card>
          );
        });
      }
    }
    normalizedAddressDisplay = (
      <h6>
        Election administration information for {results.normalizedInput.line1}{' '}
        {results.normalizedInput.line2} {results.normalizedInput.city}
        {', '}
        {results.normalizedInput.state} {results.normalizedInput.zip}
      </h6>
    );
  }

  return (
    <React.Fragment>
      <Container>
        <Jumbotron>
          <h4>
            Enter your address to look up information about your state and local
            election administration
          </h4>
          <Form onSubmit={addressHandler}>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="address"
                placeholder="Enter your address"
                onChange={(event) => addressChangedHandler(event)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          <br />
          {normalizedAddressDisplay}
        </Jumbotron>
      </Container>
      <Container>
        <Row>
          <Col>{stateElectionAdminDisplay}</Col>
          <Col>{localElectionAdminDisplay}</Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default ElectionAdminstration;
