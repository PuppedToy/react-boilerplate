import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client';
import {
  Container,
  ListGroup,
  Spinner,
  Form,
  Tabs,
  Tab,
  Button,
  Alert,
  Col,
} from 'react-bootstrap';
import {
  AiOutlineSearch,
  AiOutlineUpload,
  AiFillDelete,
  AiOutlineCheck,
} from 'react-icons/ai';
import { BsPersonPlusFill, BsPersonCheckFill } from 'react-icons/bs';

const GET_FRIENDS_QUERY = gql`
  query SearchUser($ids: [ID!]) {
    searchUser(ids: $ids) {
      id
      name
    }
  }
`;

const SEARCH_USERS_QUERY = gql`
  query SearchUser($name: String!) {
    searchUser(name: $name) {
      id
      name
    }
  }
`;

const ADD_FRIEND_MUTATION = gql`
  mutation SendFriendRequest($id: ID!) {
    sendFriendRequest(id: $id)
  }
`;

const RightButton = styled(Button)`
  margin: 0;
  padding: 0;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 60px;
`;

export default function Friends({ user, refetchUser }) {
  const [searchValue, setSearchValue] = useState('');
  const [showError, setShowError] = useState(true);

  // new Set removes duplicates
  const getFriendsQueryVariables = [
    ...new Set([
      ...user.friends,
      ...user.friendRequests,
      ...user.sentFriendRequests,
    ]),
  ];
  const getFriendsResults = useQuery(GET_FRIENDS_QUERY, {
    variables: { ids: getFriendsQueryVariables },
  });
  const [searchUsers, searchUsersResults] = useLazyQuery(SEARCH_USERS_QUERY);

  const [addFriend] = useMutation(ADD_FRIEND_MUTATION, {
    onCompleted: refetchUser,
  });

  const createAddFriendHandler = id => () => addFriend({ variables: { id } });

  const handleSearchButton = () => {
    setShowError(true);
    searchUsers({
      variables: {
        name: searchValue,
      },
    });
  };

  if (getFriendsResults.loading) return <Spinner animation="border" />;

  const getFriendsFromIds = ids =>
    ids
      .map(id =>
        getFriendsResults.data.searchUser.find(
          friendData => friendData.id === id,
        ),
      )
      .filter(name => name !== null);

  const loadStateAction = userId => {
    const areFriendsWithUser = user.friends.includes(userId);
    const isFriendRequestSent = user.sentFriendRequests.includes(userId);

    if (areFriendsWithUser) {
      return (
        <RightButton variant="success">
          <BsPersonCheckFill />
        </RightButton>
      );
    }

    if (isFriendRequestSent) {
      return (
        <RightButton variant="secondary" disabled>
          <AiOutlineUpload />
        </RightButton>
      );
    }

    return (
      <RightButton onClick={createAddFriendHandler(userId)}>
        <BsPersonPlusFill />
      </RightButton>
    );
  };

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
        {searchUsersResults.error && showError ? (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setShowError(false)}
          >
            {searchUsersResults.error.message}
          </Alert>
        ) : null}
        <Tabs id="friend-tabs">
          <Tab eventKey="add-friends-tab" title="Add friends">
            <Form
              onSubmit={e => e.preventDefault()}
              style={{ padding: '20px' }}
            >
              <Form.Row>
                <Col>
                  <Form.Control
                    type="input"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    onKeyUp={e => {
                      if (e.key === 'Enter') {
                        handleSearchButton();
                      }
                    }}
                    placeholder="Search"
                  />
                </Col>
                <Col>
                  <Button onClick={handleSearchButton}>
                    <AiOutlineSearch />
                  </Button>
                </Col>
              </Form.Row>
            </Form>
            {!searchUsersResults.loading &&
            (!searchUsersResults.data ||
              !searchUsersResults.data.searchUser.length) ? (
              <div>No users found</div>
            ) : (
              <ListGroup>
                {searchUsersResults.loading ? (
                  <Spinner animation="border" />
                ) : (
                  searchUsersResults.data.searchUser.map(foundUser =>
                    foundUser.id !== user.id ? (
                      <ListGroup.Item key={foundUser.id}>
                        {foundUser.name}
                        {loadStateAction(foundUser.id)}
                      </ListGroup.Item>
                    ) : null,
                  )
                )}
              </ListGroup>
            )}
          </Tab>
          <Tab eventKey="ongoing-friends-tab" title="Ongoing Friend Requests">
            <ListGroup>
              {getFriendsFromIds(user.sentFriendRequests).map(
                ({ id, name }) => (
                  <ListGroup.Item key={`ongoing-friend-${id}`}>
                    {name}
                  </ListGroup.Item>
                ),
              )}
            </ListGroup>
          </Tab>
          <Tab eventKey="incoming-friends-tab" title="Incoming Friend Requests">
            <ListGroup>
              {getFriendsFromIds(user.friendRequests).map(({ id, name }) => (
                <ListGroup.Item key={`incoming-friend-${id}`}>
                  {name}
                  <RightButton
                    variant="success"
                    onClick={createAddFriendHandler(id)}
                  >
                    <AiOutlineCheck />
                  </RightButton>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Tab>
          <Tab eventKey="my-friends-tab" title="My Friends">
            <ListGroup>
              {getFriendsFromIds(user.friends).map(({ id, name }) => (
                <ListGroup.Item key={`friend-${id}`}>
                  {name}
                  <RightButton variant="danger">
                    <AiFillDelete />
                  </RightButton>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

Friends.propTypes = {
  user: PropTypes.object,
  refetchUser: PropTypes.func,
};
