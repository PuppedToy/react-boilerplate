import React from 'react';
import { useHistory, Switch, Route } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Spinner } from 'react-bootstrap';

import Header from 'components/Header';
import CampaignEditor from 'containers/CampaignEditor/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

const GET_USER_QUERY = gql`
  query GetUser {
    getUser {
      id
      name
    }
  }
`;

export default function Dashboard() {
  const history = useHistory();
  const { data, error, loading } = useQuery(GET_USER_QUERY);
  if (error) {
    history.push('/');
  }

  if (loading) return <Spinner animation="border" />;

  const Hello = () => <h3>Hello, {data.getUser.name}</h3>;

  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/dashboard" component={Hello} />
        <Route
          exact
          path="/dashboard/campaign-editor"
          component={CampaignEditor}
        />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}
