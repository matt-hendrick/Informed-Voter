import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

function BootstrapNavbar() {
  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
      <Navbar.Brand href="/">Informed Voter</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Your Representatives</Nav.Link>
          <NavDropdown
            title="Congressional Members Lists"
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item href="/SenateMembersList">
              Senate Members List
            </NavDropdown.Item>
            <NavDropdown.Item href="/HouseMembersList">
              House Members List
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Bills" id="basic-nav-dropdown">
            <NavDropdown.Item href="/SearchBills">
              Search Bills
            </NavDropdown.Item>
            <NavDropdown.Item href="/RecentSenateBills">
              Recent Bills Passed by the Senate
            </NavDropdown.Item>
            <NavDropdown.Item href="/RecentHouseBills">
              Recent Bills Passed by the House
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Votes" id="basic-nav-dropdown">
            <NavDropdown.Item href="/RecentSenateVotes">
              Recent Votes in the Senate
            </NavDropdown.Item>
            <NavDropdown.Item href="/RecentHouseVotes">
              Recent Votes in the House
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title="Voting and Election Information"
            id="basic-nav-dropdown"
          >
            <NavDropdown.Item href="/Ballot">Your Ballot</NavDropdown.Item>
            <NavDropdown.Item href="/ElectionAdminstration">
              Your Election Administration
            </NavDropdown.Item>
            <NavDropdown.Item href="/MailVoteDropoffLocations">
              Mail Dropoff Locations
            </NavDropdown.Item>
            <NavDropdown.Item href="/EarlyVotingInformation">
              Early Voting Information
            </NavDropdown.Item>
            <NavDropdown.Item href="/PollingLocations">
              Your Polling Locations
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default BootstrapNavbar;
