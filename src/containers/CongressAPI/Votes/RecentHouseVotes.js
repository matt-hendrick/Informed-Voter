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

function RecentHouseVotes() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    axios
      .get('/RecentVotes', {
        params: { link: 'house' },
      })
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  let votesDisplays = (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );

  if (results) {
    votesDisplays = results.results.votes.map((data) => {
      let dateTimeDisplay = (
        <ListGroupItem>
          Date/Time: {data.date} at {data.time}
        </ListGroupItem>
      );
      let voteDisplay = (
        <ListGroupItem>
          Votes: Yes ({data.total.yes}), No ({data.total.no}), Not Voting (
          {data.total.not_voting}), Present ({data.total.present})
        </ListGroupItem>
      );
      let democraticDisplay = (
        <ListGroupItem>
          Democratic Votes: Yes ({data.democratic.yes}), No (
          {data.democratic.no}), Not Voting ({data.democratic.not_voting}),
          Present ({data.democratic.present})
        </ListGroupItem>
      );
      let republicanDisplay = (
        <ListGroupItem>
          Republican Votes: Yes ({data.republican.yes}), No (
          {data.republican.no}), Not Voting ({data.republican.not_voting}),
          Present ({data.republican.present})
        </ListGroupItem>
      );
      let independentDisplay = (
        <ListGroupItem>
          Independent Votes: Yes ({data.independent.yes}), No (
          {data.independent.no}), Not Voting ({data.independent.not_voting}),
          Present ({data.independent.present})
        </ListGroupItem>
      );
      let URLDisplay = (
        <Card.Link href={data.url}>House.gov Vote Summary</Card.Link>
      );

      return (
        <Col md="12" lg="6" key={data.document_number}>
          <Card>
            <Card.Body>
              <Card.Title>
                {data.result} - {data.description}
              </Card.Title>
              <ListGroup className="list-group-flush">
                {voteDisplay}
                {democraticDisplay}
                {republicanDisplay}
                {independentDisplay}
                {dateTimeDisplay}
              </ListGroup>
            </Card.Body>
            <Card.Body>{URLDisplay}</Card.Body>
          </Card>
        </Col>
      );
    });
  }

  return (
    <React.Fragment>
      <Container>
        <Jumbotron>
          <h2>Recent votes by the U.S. House</h2>
        </Jumbotron>
      </Container>
      <Container>
        <Row>{votesDisplays}</Row>
      </Container>
    </React.Fragment>
  );
}

export default RecentHouseVotes;
