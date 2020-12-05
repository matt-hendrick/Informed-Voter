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
function Ballot() {
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
  let electionsDisplay = null;
  let normalizedAddressDisplay = null;

  // if results retrieved from API, maps each contest to a Card
  if (results) {
    electionsDisplay = results.contests.map((data) => {
      let candidatesDisplay = null;
      if (data.candidates) {
        candidatesDisplay = data.candidates.map((candidateData) => {
          let emailDisplay = null;
          if (candidateData.email) {
            emailDisplay = <Card.Text>Email: {candidateData.email}</Card.Text>;
          }
          let phoneDisplay = null;
          if (candidateData.phone) {
            phoneDisplay = <Card.Text>Phone: {candidateData.phone}</Card.Text>;
          }
          let websiteDisplay = null;
          if (candidateData.candidateUrl) {
            websiteDisplay = (
              <Card.Text>Website: {candidateData.candidateUrl}</Card.Text>
            );
          }
          return (
            <ListGroupItem key={candidateData.name}>
              <Card.Title>{candidateData.party}</Card.Title>
              <Card.Text>{candidateData.name}</Card.Text>
              {emailDisplay}
              {phoneDisplay}
              {websiteDisplay}
            </ListGroupItem>
          );
        });
      }
      return (
        <Col md="6" key={data.office}>
          <Card>
            <Card.Body>
              <Card.Title>{data.office}</Card.Title>
              <ListGroup className="list-group-flush">
                {candidatesDisplay}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      );
    });
    normalizedAddressDisplay = (
      <h6>
        {results.election.name} ballot for {results.normalizedInput.line1}{' '}
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
          <h4>Enter your address to look up your ballot</h4>
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
        <Row>{electionsDisplay}</Row>
      </Container>
    </React.Fragment>
  );
}

export default Ballot;
