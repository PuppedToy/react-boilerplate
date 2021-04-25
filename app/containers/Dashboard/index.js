import React from 'react';
import styled from 'styled-components';

import { Container, Row, Col, Card } from 'react-bootstrap';

const StyledCardBody = styled(Card.Body)`
  max-height: 300px;
  overflow-y: auto;
`;

const lorem =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy Lorem Ipsum.";

export default function Dashboard() {
  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <StyledCardBody>
              <Card.Title>Title</Card.Title>
              <Card.Text>{lorem}</Card.Text>
            </StyledCardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <StyledCardBody>
              <Card.Title>Title</Card.Title>
              <Card.Text>Lorem Ipsum</Card.Text>
            </StyledCardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <StyledCardBody>
              <Card.Title>Title</Card.Title>
              <Card.Text>{lorem}</Card.Text>
            </StyledCardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <StyledCardBody>
              <Card.Title>Title</Card.Title>
              <Card.Text>{lorem}</Card.Text>
            </StyledCardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <StyledCardBody>
              <Card.Title>Title</Card.Title>
              <Card.Text>{lorem}</Card.Text>
            </StyledCardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <StyledCardBody>
              <Card.Title>Title</Card.Title>
              <Card.Text>{lorem}</Card.Text>
            </StyledCardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
