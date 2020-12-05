import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Spinner from 'react-bootstrap/Spinner';

toast.configure();
function RecentHouseBills() {
  const [search, setSearch] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(null);

  const notify = (message, position, type) => {
    if (type === 'success') {
      toast.success(message, { position: position, autoClose: 2000 });
    }
    if (type === 'error') {
      toast.error(message, { position: position, autoClose: 6000 });
    }
  };

  const searchHandler = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .get('/BillSearch', {
        params: { search: search },
      })
      .then((response) => {
        if (!response.data.error) {
          setLoading(false);
          setResults(response.data);
          notify('Search Completed!', toast.POSITION.TOP_CENTER, 'success');
        } else if (response.data.error) {
          console.log(response);
          setLoading(false);
          notify(
            response.data.error.message,
            toast.POSITION.TOP_CENTER,
            'error'
          );
        }
      });
  };

  const searchChangedHandler = (event) => {
    const updatedSearch = event.target.value;
    setSearch(updatedSearch);
  };

  let billsDisplay = null;

  if (loading) {
    billsDisplay = (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  if (results) {
    billsDisplay = results.results[0].bills.map((data) => {
      let introducedDisplay = null;
      let housePassageText = 'House passage date not found';
      let housePassageDisplay = null;
      let senatePassageText = 'Senate passage date not found';
      let senatePassageDisplay = null;
      let enactedText = 'Enacted date not found';
      let enactedDisplay = null;
      let sponsorDisplay = null;
      let congressURLDisplay = null;
      let govTrackURLDisplay = null;
      let summaryDisplay = null;
      let congressBioURL = null;
      let topicDisplay = null;

      if (data.introduced_date) {
        introducedDisplay = (
          <ListGroupItem>Introduced: {data.introduced_date}</ListGroupItem>
        );
      }

      if (data.senate_passage) {
        senatePassageText = data.senate_passage;
      }

      senatePassageDisplay = (
        <ListGroupItem>Senate Passage: {senatePassageText}</ListGroupItem>
      );

      if (data.house_passage) {
        housePassageText = data.house_passage;
      }

      housePassageDisplay = (
        <ListGroupItem>House Passage: {housePassageText}</ListGroupItem>
      );

      if (data.enacted) {
        enactedText = data.enacted;
      }

      enactedDisplay = <ListGroupItem>Enacted: {enactedText}</ListGroupItem>;

      if (
        (data.sponsor_id && data.sponsor_name) ||
        data.sponsor_party ||
        data.sponsor_state ||
        data.sponsor_title
      ) {
        congressBioURL =
          'https://bioguideretro.congress.gov/Home/MemberDetails?memIndex=' +
          data.sponsor_id;
        sponsorDisplay = (
          <ListGroupItem>
            Sponsor:{' '}
            <Card.Link href={congressBioURL}>
              {data.sponsor_title} {data.sponsor_name} ({data.sponsor_party} -{' '}
              {data.sponsor_state})
            </Card.Link>
          </ListGroupItem>
        );
      }
      if (data.congressdotgov_url) {
        congressURLDisplay = (
          <Card.Link href={data.congressdotgov_url}>
            Congress.gov Tracker
          </Card.Link>
        );
      }

      if (data.govtrack_url) {
        govTrackURLDisplay = (
          <Card.Link href={data.govtrack_url}>GovTrack</Card.Link>
        );
      }

      if (data.summary_short) {
        summaryDisplay = <Card.Text>{data.summary_short}</Card.Text>;
      }

      if (!data.summary_short && data.title) {
        summaryDisplay = <Card.Text>{data.title}</Card.Text>;
      }

      if (data.primary_subject) {
        topicDisplay = (
          <ListGroupItem>Topic: {data.primary_subject}</ListGroupItem>
        );
      }
      return (
        <Col md="12" lg="6" key={data.bill_id}>
          <Card>
            <Card.Body>
              <Card.Title>
                {data.short_title} ({data.number})
              </Card.Title>
              <ListGroup className="list-group-flush">
                {introducedDisplay}
                {housePassageDisplay}
                {senatePassageDisplay}
                {enactedDisplay}
                {sponsorDisplay}
                {topicDisplay}
              </ListGroup>
              {summaryDisplay}
            </Card.Body>
            <Card.Body>
              {congressURLDisplay}
              {govTrackURLDisplay}
            </Card.Body>
          </Card>
        </Col>
      );
    });
  }

  return (
    <React.Fragment>
      <Container>
        <Jumbotron>
          <h4>Search for bills</h4>
          <Form onSubmit={searchHandler}>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="search"
                placeholder="Enter your search"
                onChange={(event) => searchChangedHandler(event)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Jumbotron>
      </Container>
      <Container>
        <Row>{billsDisplay}</Row>
      </Container>
    </React.Fragment>
  );
}

export default RecentHouseBills;
