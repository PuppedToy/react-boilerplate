import React from 'react';
import { Link } from 'react-router-dom';

import { Container, Row, Col } from 'react-bootstrap';

export default function Welcome() {
  return (
    <Container>
      <Row>
        <Col>
          <h2>Welcome to RPG Cards!</h2>
          <h3>
            Do you have an account? <Link to="/login">Log in here</Link>.
          </h3>
          <h3>If you don&apos;t have an account yet, consider joining us.</h3>
        </Col>
      </Row>
    </Container>
  );
}
