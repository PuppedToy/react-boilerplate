import React from 'react';
import { useHistory, Switch, Route } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Spinner } from 'react-bootstrap';

import Header from 'components/Header';
import CampaignEditor from 'containers/CampaignEditor/Loadable';
import Friends from 'containers/Friends/Loadable';
import Battle from 'containers/Battle/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

const GET_USER_QUERY = gql`
  query GetUser {
    getUser {
      id
      name
      friends
      friendRequests
      sentFriendRequests
    }
  }
`;

export default function Dashboard() {
  const history = useHistory();
  const { data, error, loading, refetch } = useQuery(GET_USER_QUERY);
  if (error) {
    history.push('/');
  }

  if (loading) return <Spinner animation="border" />;

  const injectUser = Component => props => (
    <Component {...props} user={data.getUser} refetchUser={refetch} />
  );

  return (
    <div>
      <Header />
      <Switch>
        <Route
          exact
          path="/dashboard/campaign-editor"
          component={CampaignEditor}
        />
        <Route
          exact
          path="/dashboard/friends"
          component={injectUser(Friends)}
        />
        <Route exact path="/dashboard/battle" component={injectUser(Battle)} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}
