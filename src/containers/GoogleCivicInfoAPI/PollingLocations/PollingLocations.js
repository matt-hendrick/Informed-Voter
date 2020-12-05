import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

toast.configure();
function PollingLocations() {
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
  let pollingLocationsDisplay = null;
  let normalizedAddressDisplay = null;

  if (results) {
    let noteDisplay = null;
    let pollingLocationAddress = null;
    let addressLocationName = null;
    if (results.pollingLocations) {
      pollingLocationsDisplay = results.pollingLocations.map((data) => {
        if (data.address.locationName) {
          addressLocationName = toTitleCase(data.address.locationName) + ', ';
        }
        pollingLocationAddress =
          addressLocationName +
          data.address.line1 +
          ' ' +
          data.address.city +
          ' ' +
          data.address.state +
          ' ' +
          data.address.zip;
        if (data.notes) {
          let noteText = toTitleCase(data.notes);
          noteDisplay = <Card.Text>{noteText}</Card.Text>;
        }
        return (
          <Col md="6">
            <Card key={pollingLocationAddress}>
              <Card.Body>
                <Card.Title>Address: {pollingLocationAddress}</Card.Title>
                <Card.Text>Polling Hours: {data.pollingHours}</Card.Text>
                {noteDisplay}
              </Card.Body>
            </Card>
          </Col>
        );
      });
    } else {
      pollingLocationsDisplay = (
        <Container>There are no polling places in your area</Container>
      );
    }
    normalizedAddressDisplay = (
      <h6>
        Election day polling locations for {results.normalizedInput.line1}{' '}
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
          <h4>Enter your address to look up your polling location(s)</h4>
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
        <Row>{pollingLocationsDisplay}</Row>
      </Container>
    </React.Fragment>
  );
}

export default PollingLocations;
