import React, { useState } from 'react';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import { Container, Spinner, Button, Alert, ListGroup } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

// import { useSocket } from 'utils/socket';

const GET_ROOM_QUERY = gql`
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      userList
    }
  }
`;

const GET_USER_NAMES_QUERY = gql`
  query SearchUser($ids: [ID!]) {
    searchUser(ids: $ids) {
      id
      name
    }
  }
`;

export default function BattleRoom() {
  const location = useLocation();
  // const socket = useSocket();
  // TODO socket things and logics

  const roomId = parseInt(location.pathname.replace(/^.*\//, ''), 10);

  const [showError, setShowError] = useState(true);

  const [getUserNames, getUserNamesResults] = useLazyQuery(
    GET_USER_NAMES_QUERY,
  );
  const getRoomResults = useQuery(GET_ROOM_QUERY, {
    variables: { id: roomId },
    onCompleted: ({ getRoom }) =>
      getUserNames({
        variables: {
          ids: getRoom.userList,
        },
      }),
  });

  if (getRoomResults.loading || getUserNamesResults.loading)
    return <Spinner animation="border" />;

  return (
    <div>
      <Container>
        {getRoomResults.error && showError ? (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setShowError(false)}
          >
            {getRoomResults.error.message}
          </Alert>
        ) : null}
        {getUserNamesResults.error && showError ? (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setShowError(false)}
          >
            {getUserNamesResults.error.message}
          </Alert>
        ) : null}
        {getUserNamesResults && getUserNamesResults.data ? (
          <div>
            <ListGroup>
              {getUserNamesResults.data.searchUser.map(({ name, id }) => (
                <ListGroup.Item key={id}>{name}</ListGroup.Item>
              ))}
            </ListGroup>
            <Button>Ready</Button>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
