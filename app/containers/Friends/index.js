import React, { useState } from 'react';
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
import { useHistory } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsPersonPlusFill } from 'react-icons/bs';

const GET_FRIENDS_QUERY = gql`
  query GetCampaignsList {
    alive
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

export default function Friends() {
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');
  const [showError, setShowError] = useState(true);
  const { /* data, */ error, loading } = useQuery(GET_FRIENDS_QUERY);
  const [searchUsers, searchUsersResults] = useLazyQuery(SEARCH_USERS_QUERY);

  if (error) {
    history.push('/');
  }

  const handleSearchButton = () => {
    setShowError(true);
    searchUsers({
      variables: {
        name: searchValue,
      },
    });
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <Container>
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
                  searchUsersResults.data.searchUser.map(user => (
                    <ListGroup.Item key={user.id}>
                      {user.name}
                      <RightButton>
                        <BsPersonPlusFill />
                      </RightButton>
                    </ListGroup.Item>
                  ))
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
