import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
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
import { AiOutlineSearch } from 'react-icons/ai';
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

const RightButton = styled(Button)`
  margin: 0;
  padding: 0;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 60px;
`;

export default function Friends({ user }) {
  const [searchValue, setSearchValue] = useState('');
  const [showError, setShowError] = useState(true);
  const getFriendsResults = useQuery(GET_FRIENDS_QUERY, {
    variables: { ids: user.friends },
  });
  const [searchUsers, searchUsersResults] = useLazyQuery(SEARCH_USERS_QUERY);

  const handleSearchButton = () => {
    setShowError(true);
    searchUsers({
      variables: {
        name: searchValue,
      },
    });
  };

  if (getFriendsResults.loading) return <Spinner animation="border" />;

  const loadStateAction = userId => {
    if (getFriendsResults.data && getFriendsResults.data.searchUser) {
      const areFriendsWithUser = getFriendsResults.data.searchUser.some(
        ({ id }) => id === userId,
      );

      if (areFriendsWithUser) {
        return (
          <RightButton variant="success">
            <BsPersonCheckFill />
          </RightButton>
        );
      }
    }

    return (
      <RightButton>
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
          <Tab eventKey="my-friends-tab" title="My Friends">
            Hi!
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

Friends.propTypes = {
  user: PropTypes.object,
};
