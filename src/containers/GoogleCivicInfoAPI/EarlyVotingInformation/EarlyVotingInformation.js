import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

toast.configure();
function EarlyVotingInformation() {
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

  // variables for displaying mapped data and normalized address
  let earlyVotingSitesDisplay = null;
  let normalizedAddressDisplay = null;

  if (results) {
    if (results.earlyVoteSites) {
      earlyVotingSitesDisplay = results.earlyVoteSites.map((data) => {
        let noteDisplay = null;
        let earlyVotingAddress = null;
        let addressLocationName = null;
        if (data.address.locationName) {
          addressLocationName = data.address.locationName + ', ';
        }
        earlyVotingAddress =
          addressLocationName +
          data.address.line1 +
          ' ' +
          data.address.city +
          ' ' +
          data.address.state +
          ' ' +
          data.address.zip;
        if (data.notes) {
          noteDisplay = <ListGroupItem>{data.notes}</ListGroupItem>;
        }
        return (
          <Col md="6">
            <Card key={earlyVotingAddress}>
              <Card.Body>
                <Card.Title>Address: {earlyVotingAddress}</Card.Title>
                <ListGroup className="list-group-flush">
                  <ListGroupItem>
                    Polling Hours: {data.pollingHours}
                  </ListGroupItem>
                  <ListGroupItem>
                    Early Voting End Date: {data.endDate}
                  </ListGroupItem>
                  <ListGroupItem>
                    Early Voting Start Date: {data.startDate}
                  </ListGroupItem>
                  {noteDisplay}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        );
      });
    } else {
      earlyVotingSitesDisplay = (
        <Container>There are no early voting sites in your area</Container>
      );
    }
    normalizedAddressDisplay = (
      <h6>
        Early voting locations for {results.normalizedInput.line1}{' '}
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
          <h4>Enter your address to look up early voting locations near you</h4>
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
        <Row>{earlyVotingSitesDisplay}</Row>
      </Container>
    </React.Fragment>
  );
}

export default EarlyVotingInformation;
