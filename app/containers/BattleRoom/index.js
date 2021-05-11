import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client';
import { Container, Spinner, Button, Alert, ListGroup } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import {
  AiOutlineEllipsis,
  AiOutlineCheck,
  AiTwotoneCrown,
} from 'react-icons/ai';

import { useSocket } from 'utils/socket';

const GET_ROOM_QUERY = gql`
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      userList {
        id
        state
      }
      ownerId
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

const JOIN_ROOM_MUTATION = gql`
  mutation JoinRoom($id: ID!) {
    joinRoom(id: $id)
  }
`;

const READY_ROOM_MUTATION = gql`
  mutation ReadyRoom($id: ID!, $ready: Boolean!) {
    readyRoom(id: $id, ready: $ready)
  }
`;

const CREATE_BATTLE_MUTATION = gql`
  mutation CreateBattle($users: [ID!]!) {
    createBattle(users: $users)
  }
`;

// TODO on dismount, leave user
// TOD on disconnect, leave user (this might have to send a disconnect-user event to every user in a room automatically)
export default function BattleRoom({ user }) {
  const location = useLocation();
  const history = useHistory();
  const socket = useSocket();

  const roomId = parseInt(location.pathname.replace(/^.*\//, ''), 10);

  const [showError, setShowError] = useState(true);
  const [iAmReady, setIAmReady] = useState(false);

  const [getUserNames, getUserNamesResults] = useLazyQuery(
    GET_USER_NAMES_QUERY,
  );
  const getRoomResults = useQuery(GET_ROOM_QUERY, {
    variables: { id: roomId },
    onCompleted: ({ getRoom }) =>
      getUserNames({
        variables: {
          ids: getRoom.userList.map(({ id }) => id),
        },
      }),
  });
  const [joinRoom] = useMutation(JOIN_ROOM_MUTATION, {
    variables: {
      id: roomId,
    },
  });
  const [readyRoom] = useMutation(READY_ROOM_MUTATION);
  const [createBattle] = useMutation(CREATE_BATTLE_MUTATION, {
    variables: {
      users: getRoomResults.data.getRoom.userList.map(({ id }) => id),
    },
  });

  useEffect(() => {
    socket.on('room-join', () => {
      if (getRoomResults.refetch) {
        getRoomResults.refetch();
      }
    });
    socket.on('room-ready', () => {
      if (getRoomResults.refetch) {
        getRoomResults.refetch();
      }
    });
    socket.on('battle-start', ({ battleId }) => {
      const win = window.open(
        `/api/public/battle.html?battleId=${battleId}`,
        '_blank',
      );
      win.focus();
      history.push('/dashboard');
    });

    return () => {
      socket.off('room-join');
      socket.off('room-ready');
      socket.off('battle-start');
    };
  }, []);

  if (
    getRoomResults.loading ||
    !getUserNamesResults.data ||
    getUserNamesResults.loading
  )
    return <Spinner animation="border" />;

  const myFoundUser = getRoomResults.data.getRoom.userList.find(
    ({ id }) => user.id === id,
  );
  if (!myFoundUser) {
    return <div>404 Not found</div>;
  }

  if (myFoundUser.state === 'DISCONNECTED') {
    joinRoom();
  }

  const userList = getRoomResults.data.getRoom.userList.map(currentUser => {
    const foundUser = getUserNamesResults.data.searchUser.find(
      ({ id }) => currentUser.id === id,
    );
    const name = foundUser ? foundUser.name : null;
    return {
      ...currentUser,
      name,
    };
  });

  const readyHandler = () => {
    readyRoom({
      variables: {
        id: roomId,
        ready: !iAmReady,
      },
    });
    setIAmReady(!iAmReady);
  };

  const startHandler = () => {
    createBattle();
  };

  const everyoneIsReady = userList.every(({ state }) => state === 'READY');

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
        {userList ? (
          <div>
            <ListGroup>
              {userList.map(({ name, id, state }) => (
                <ListGroup.Item
                  key={id}
                  style={state === 'DISCONNECTED' ? { opacity: 0.7 } : {}}
                >
                  {state === 'DISCONNECTED' ? <AiOutlineEllipsis /> : null}
                  {state === 'READY' ? <AiOutlineCheck /> : null}{' '}
                  {getRoomResults.data.getRoom.ownerId === id ? (
                    <AiTwotoneCrown />
                  ) : null}{' '}
                  {name}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button onClick={readyHandler}>Ready</Button>{' '}
            {getRoomResults.data.getRoom.ownerId === user.id ? (
              <Button onClick={startHandler} disabled={!everyoneIsReady}>
                Start
              </Button>
            ) : null}
          </div>
        ) : null}
      </Container>
    </div>
  );
}

BattleRoom.propTypes = {
  user: PropTypes.object,
};
