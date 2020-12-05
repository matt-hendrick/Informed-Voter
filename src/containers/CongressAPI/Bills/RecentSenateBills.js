import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Spinner from 'react-bootstrap/Spinner';

function RecentSenateBills() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    axios
      .get('/RecentBills', {
        params: { link: 'senate' },
      })
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  let billsDisplay = (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );

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
          <h2>Recent bills passed by the U.S. Senate</h2>
        </Jumbotron>
      </Container>
      <Container>
        <Row>{billsDisplay}</Row>
      </Container>
    </React.Fragment>
  );
}

export default RecentSenateBills;
