import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';
import { Container, Spinner, Button, Alert, ListGroup } from 'react-bootstrap';

const GET_FRIENDS_QUERY = gql`
  query SearchUser($ids: [ID!]) {
    searchUser(ids: $ids) {
      id
      name
    }
  }
`;

export default function BattleRoom({ user }) {
  const [showError, setShowError] = useState(true);

  const getFriendsResults = useQuery(GET_FRIENDS_QUERY, {
    variables: { ids: user.friends },
  });

  if (getFriendsResults.loading) return <Spinner animation="border" />;

  return (
    <div>
      <Container>
        {getFriendsResults.error && showError ? (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setShowError(false)}
          >
            {getFriendsResults.error.message}
          </Alert>
        ) : null}
        <ListGroup>
          <ListGroup.Item>User 1</ListGroup.Item>
          <ListGroup.Item>User 2</ListGroup.Item>
        </ListGroup>
        <Button>Battle!</Button>
      </Container>
    </div>
  );
}

BattleRoom.propTypes = {
  user: PropTypes.object,
};
