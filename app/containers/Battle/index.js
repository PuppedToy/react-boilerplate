import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';
import {
  Container,
  Spinner,
  Button,
  Alert,
  Dropdown,
  ListGroup,
  Form,
} from 'react-bootstrap';

const GET_FRIENDS_QUERY = gql`
  query SearchUser($ids: [ID!]) {
    searchUser(ids: $ids) {
      id
      name
    }
  }
`;

export default function Battle({ user }) {
  const dropdownOptions = [
    {
      key: '1',
      name: 'Test Battle',
    },
  ];

  const [currentBattleOption, setCurrentBattleOption] = useState({
    ...dropdownOptions[0],
  });
  const [showError, setShowError] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const getFriendsResults = useQuery(GET_FRIENDS_QUERY, {
    variables: { ids: user.friends },
  });

  if (getFriendsResults.loading) return <Spinner animation="border" />;

  const selectBattleOptionHandler = key => {
    const battleOption = dropdownOptions.find(option => option.key === key);
    if (battleOption) {
      setCurrentBattleOption({ ...battleOption });
    } else {
      setCurrentBattleOption({ ...dropdownOptions[0] });
    }
  };

  const handleSelectUser = e => {
    const { id, checked } = e.target;
    const userId = id.replace('battle-user-', '');
    if (checked) {
      setSelectedUsers([...new Set([...selectedUsers, userId])]);
    } else {
      const newUsers = [...selectedUsers];
      newUsers.splice(newUsers.indexOf(userId), 1);
      setSelectedUsers(newUsers);
    }
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
        <Dropdown onSelect={selectBattleOptionHandler}>
          <Dropdown.Toggle>{currentBattleOption.name}</Dropdown.Toggle>
          <Dropdown.Menu>
            {dropdownOptions.map(({ key, name }) => (
              <Dropdown.Item key={key} eventKey={key}>
                {name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Form>
          <ListGroup>
            {getFriendsResults.data.searchUser.map(foundUser =>
              foundUser.id !== user.id ? (
                <ListGroup.Item key={foundUser.id}>
                  <Form.Check
                    type="checkbox"
                    id={`battle-user-${foundUser.id}`}
                    label={foundUser.name}
                    onChange={handleSelectUser}
                    checked={selectedUsers.includes(foundUser.id)}
                  />
                </ListGroup.Item>
              ) : null,
            )}
          </ListGroup>
        </Form>
        <Button>Battle!</Button>
      </Container>
    </div>
  );
}

Battle.propTypes = {
  user: PropTypes.object,
};
