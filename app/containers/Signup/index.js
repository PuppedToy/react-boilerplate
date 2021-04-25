import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
// import styled from 'styled-components';
import { useMutation, gql } from '@apollo/client';

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from 'react-bootstrap';

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($name: String!, $password: String!) {
    createUser(name: $name, password: $password)
  }
`;

export default function Signup() {
  const history = useHistory();
  const onCompleted = results => {
    if (results && results.createUser) {
      localStorage.setItem('token', results.createUser);
      history.push('/dashboard');
    }
  };

  const [name, setName] = useState('');
  const [showError, setShowError] = useState(false);
  const [password, setPassword] = useState('');
  const [createUser, { loading, error }] = useMutation(CREATE_USER_MUTATION, {
    onCompleted,
  });

  const handleSubmit = () => {
    setShowError(true);
    createUser({
      variables: {
        name,
        password,
      },
    });
  };

  return (
    <Container>
      <Row>
        <Col>
          {error && showError ? (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setShowError(false)}
            >
              {error.message}
            </Alert>
          ) : null}
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="input"
                  placeholder="Username"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="button" onClick={handleSubmit}>
                Join Us!
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}
