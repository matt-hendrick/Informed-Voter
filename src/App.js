import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Representatives from './containers/GoogleCivicInfoAPI/Representatives/Representatives';
import EarlyVotingInformation from './containers/GoogleCivicInfoAPI/EarlyVotingInformation/EarlyVotingInformation';
import Ballot from './containers/GoogleCivicInfoAPI/Ballot/Ballot';
import PollingLocations from './containers/GoogleCivicInfoAPI/PollingLocations/PollingLocations';
import MailVoteDropoffLocations from './containers/GoogleCivicInfoAPI/MailVoteDropoffLocations/MailVoteDropoffLocations';
import ElectionAdminstration from './containers/GoogleCivicInfoAPI/ElectionAdminstration/ElectionAdministration';
import HouseMembersList from './containers/CongressAPI/MembersLists/HouseMembersList';
import SenateMembersList from './containers/CongressAPI/MembersLists/SenateMembersList';
import RecentHouseBills from './containers/CongressAPI/Bills/RecentHouseBills';
import RecentSenateBills from './containers/CongressAPI/Bills/RecentSenateBills';
import SearchBills from './containers/CongressAPI/Bills/SearchBills';
import RecentHouseVotes from './containers/CongressAPI/Votes/RecentHouseVotes';
import RecentSenateVotes from './containers/CongressAPI/Votes/RecentSenateVotes';
import Test from './containers/TabbedPages/Test';

function App() {
  return (
    <React.Fragment>
      <Navbar />
      <Switch>
        <Route
          path="/ElectionAdminstration"
          exact
          component={ElectionAdminstration}
        />
        <Route path="/Ballot" exact component={Ballot} />
        <Route
          path="/EarlyVotingInformation"
          exact
          component={EarlyVotingInformation}
        />
        <Route path="/PollingLocations" exact component={PollingLocations} />
        <Route
          path="/MailVoteDropoffLocations"
          exact
          component={MailVoteDropoffLocations}
        />
        <Route path="/" exact component={Representatives} />
        <Route path="/HouseMembersList" exact component={HouseMembersList} />
        <Route path="/SenateMembersList" exact component={SenateMembersList} />
        <Route path="/RecentHouseBills" exact component={RecentHouseBills} />
        <Route path="/RecentSenateBills" exact component={RecentSenateBills} />
        <Route path="/SearchBills" exact component={SearchBills} />
        <Route path="/RecentHouseVotes" exact component={RecentHouseVotes} />
        <Route path="/RecentSenateVotes" exact component={RecentSenateVotes} />
        <Route path="/Test" exact component={Test} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
