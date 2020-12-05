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

function HouseMembersList() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    axios
      .get('/MembersList', {
        params: { url: 'house' },
      })
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  let representativesDisplay = (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );

  if (results) {
    representativesDisplay = results.map((data) => {
      let facebookLink = null;
      let facebookDisplay = null;
      let twitterLink = null;
      let twitterDisplay = null;
      let websiteDisplay = null;
      let phoneDisplay = null;
      let dobDisplay = null;
      let officeDisplay = null;
      let missedVoteDisplay = null;
      let voteWithPartyDisplay = null;
      let cookPVIDisplay = null;
      let congressBioLink = null;
      let congressBioDisplay = null;
      let fecLink = null;
      let fecDisplay = null;

      if (data.url) {
        websiteDisplay = <Card.Link href={data.url}>Website</Card.Link>;
      }
      if (data.twitter_account) {
        twitterLink = 'https://www.twitter.com/' + data.twitter_account;
        twitterDisplay = <Card.Link href={twitterLink}>Twitter</Card.Link>;
      }
      if (data.facebook_account) {
        facebookLink = 'https://www.facebook.com/' + data.facebook_account;
        facebookDisplay = <Card.Link href={facebookLink}>Facebook</Card.Link>;
      }
      if (data.phone) {
        phoneDisplay = <ListGroupItem>Phone: {data.phone}</ListGroupItem>;
      }
      if (data.date_of_birth) {
        dobDisplay = <ListGroupItem>DOB: {data.date_of_birth}</ListGroupItem>;
      }
      if (data.office) {
        officeDisplay = <ListGroupItem>DC Office: {data.office}</ListGroupItem>;
      }
      if (data.cook_pvi) {
        cookPVIDisplay = (
          <ListGroupItem>
            Cook District Party Lean: {data.cook_pvi}
          </ListGroupItem>
        );
      }
      if (data.votes_with_party_pct) {
        voteWithPartyDisplay = (
          <ListGroupItem>
            Votes with Party: {data.votes_with_party_pct}%
          </ListGroupItem>
        );
      }
      if (data.missed_votes_pct) {
        missedVoteDisplay = (
          <ListGroupItem>Missed Votes: {data.missed_votes_pct}%</ListGroupItem>
        );
      }
      if (data.id) {
        congressBioLink =
          'https://bioguideretro.congress.gov/Home/MemberDetails?memIndex=' +
          data.id;
        congressBioDisplay = (
          <Card.Link href={congressBioLink}>Biography</Card.Link>
        );
      }
      if (data.fec_candidate_id) {
        fecLink = 'https://www.fec.gov/data/candidate/' + data.fec_candidate_id;
        fecDisplay = <Card.Link href={fecLink}>FEC Records</Card.Link>;
      }
      return (
        <Col md="6" lg="4" key={data.id}>
          <Card>
            <Card.Body>
              <Card.Title>
                {data.first_name} {data.last_name} ({data.party}) -
                Representative of {data.state} {data.district}
              </Card.Title>
              <ListGroup className="list-group-flush">
                {phoneDisplay}
                {officeDisplay}
                {dobDisplay}
                {cookPVIDisplay}
                {voteWithPartyDisplay}
                {missedVoteDisplay}
              </ListGroup>
            </Card.Body>
            <Card.Body>
              {websiteDisplay}
              {facebookDisplay}
              {twitterDisplay}
              {congressBioDisplay}
              {fecDisplay}
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
          <h2>Members of the current U.S. House of Representatives</h2>
        </Jumbotron>
      </Container>
      <Container>
        <Row>{representativesDisplay}</Row>
      </Container>
    </React.Fragment>
  );
}

export default HouseMembersList;
