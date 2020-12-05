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
function Representatives() {
  const [userAddress, setUserAddress] = useState(null);
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
  const userAddressHandler = (event) => {
    event.preventDefault();
    // get request to API via Node backend.
    // passes user's address as a query and representatives to specify the correct URI
    axios
      .get('/VoterInfo', {
        params: { address: userAddress, url: 'representatives' },
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
  const userAddressChangedHandler = (event) => {
    const updatedAddress = event.target.value;
    setUserAddress(updatedAddress);
  };

  // variables for displaying mapped data and normalized address
  let officialsDisplay = null;
  let normalizedAddressDisplay = null;

  if (results) {
    officialsDisplay = results.officials.map((data) => {
      let facebookLink = null;
      let facebookDisplay = null;
      let twitterLink = null;
      let twitterDisplay = null;
      let youtubeLink = null;
      let youtubeDisplay = null;
      let emailDisplay = null;
      let phoneDisplay = null;
      let websiteDisplay = null;
      if (data.emails) {
        emailDisplay = <ListGroupItem>Email: {data.emails}</ListGroupItem>;
      }
      if (data.phones) {
        phoneDisplay = <ListGroupItem>Phone: {data.phones}</ListGroupItem>;
      }
      if (data.urls) {
        websiteDisplay = (
          <Card.Link href={data.urls}>Official Website</Card.Link>
        );
      }
      if (data.channels) {
        facebookLink = 'https://www.facebook.com/' + data.channels[0].id;
        facebookDisplay = <Card.Link href={facebookLink}>Facebook</Card.Link>;
        if (data.channels.length > 1) {
          twitterLink = 'https://www.twitter.com/' + data.channels[1].id;
          twitterDisplay = <Card.Link href={twitterLink}>Twitter</Card.Link>;
        }
        if (data.channels.length > 2) {
          youtubeLink = 'https://www.youtube.com/' + data.channels[2].id;
          youtubeDisplay = <Card.Link href={youtubeLink}>YouTube</Card.Link>;
        }
      }
      return (
        <Col md="4" key={data.name}>
          <Card>
            <Card.Body>
              <Card.Title>{data.name}</Card.Title>
              <ListGroup className="list-group-flush">
                <ListGroupItem>Party: {data.party}</ListGroupItem>
                {phoneDisplay}
                {emailDisplay}
              </ListGroup>
            </Card.Body>
            <Card.Body>
              {websiteDisplay}
              {facebookDisplay}
              {twitterDisplay}
              {youtubeDisplay}
            </Card.Body>
          </Card>
        </Col>
      );
    });
    normalizedAddressDisplay = (
      <h6>
        National, state, and local representatives for{' '}
        {results.normalizedInput.line1} {results.normalizedInput.line2}{' '}
        {results.normalizedInput.city}
        {', '}
        {results.normalizedInput.state} {results.normalizedInput.zip}
      </h6>
    );
  }

  return (
    <React.Fragment>
      <Container>
        <Jumbotron>
          <h4>Enter your address to look up your representatives</h4>
          <Form onSubmit={userAddressHandler}>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="address"
                placeholder="Enter your address"
                onChange={(event) => userAddressChangedHandler(event)}
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
        <Row>{officialsDisplay}</Row>
      </Container>
    </React.Fragment>
  );
}

export default Representatives;
