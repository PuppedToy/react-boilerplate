import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
// import styled from 'styled-components';
import { useLazyQuery, gql } from '@apollo/client';

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from 'react-bootstrap';

const LOGIN_QUERY = gql`
  query Login($name: String!, $password: String!) {
    login(name: $name, password: $password)
  }
`;

export default function Login() {
  const history = useHistory();
  const onCompleted = results => {
    if (results && results.login) {
      localStorage.setItem('token', results.login);
      history.push('/dashboard');
    }
  };

  const [name, setName] = useState('');
  const [showError, setShowError] = useState(false);
  const [password, setPassword] = useState('');
  const [sendLogin, { loading, error }] = useLazyQuery(LOGIN_QUERY, {
    onCompleted,
  });

  const handleSubmit = () => {
    setShowError(true);
    sendLogin({
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
                  onKeyUp={e =>
                    e && e.key === 'Enter' ? handleSubmit() : null
                  }
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyUp={e =>
                    e && e.key === 'Enter' ? handleSubmit() : null
                  }
                />
              </Form.Group>
              <Button variant="primary" type="button" onClick={handleSubmit}>
                Log in
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}
