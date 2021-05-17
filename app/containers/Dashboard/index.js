import React, { useState, useEffect } from 'react';
import { useHistory, Switch, Route } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Spinner, Alert, Button } from 'react-bootstrap';

import Header from 'components/Header';
import CampaignEditor from 'containers/CampaignEditor/Loadable';
import Friends from 'containers/Friends/Loadable';
import Battle from 'containers/Battle/Loadable';
import BattleRoom from 'containers/BattleRoom/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import { useSocket, tryAuthorize } from 'utils/socket';

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
  const socket = useSocket();
  const [inviteData, setInviteData] = useState({});
  const [showBattleInvite, setShowBattleInvite] = useState(false);

  useEffect(() => {
    tryAuthorize();

    socket.on('room-invite', ({ host, roomId }) => {
      setInviteData({ host, roomId });
      setShowBattleInvite(true);
    });

    return () => {
      socket.off('room-invite');
    };
  }, []);

  const { data, error, loading, refetch } = useQuery(GET_USER_QUERY);
  if (error) {
    history.push('/');
  }

  if (loading) return <Spinner animation="border" />;

  const injectUser = Component => props => (
    <Component {...props} user={data.getUser} refetchUser={refetch} />
  );

  const handleAcceptInvite = () => {
    if (inviteData)
      history.push(`/dashboard/battle/rooms/${inviteData.roomId}`);

    setShowBattleInvite(false);
  };

  return (
    <div>
      <Alert variant="primary" show={showBattleInvite}>
        <Alert.Heading>You have been invited to a battle</Alert.Heading>
        <p>User {inviteData && inviteData.name} has invited you to a battle</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button
            onClick={() => setShowBattleInvite(false)}
            variant="danger"
            style={{ marginRight: '20px' }}
          >
            Reject
          </Button>
          <Button onClick={handleAcceptInvite} variant="primary">
            Accept
          </Button>
        </div>
      </Alert>
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
        <Route
          path="/dashboard/battle/rooms/:roomId"
          component={injectUser(BattleRoom)}
        />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}
