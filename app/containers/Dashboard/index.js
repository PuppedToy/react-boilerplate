import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery, gql } from '@apollo/client';

import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';

const StyledCardBody = styled(Card.Body)`
  max-height: 300px;
  overflow-y: auto;
`;

const lorem =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy Lorem Ipsum.";

const GET_USER_QUERY = gql`
  query GetUser {
    getUser {
      id
      name
    }
  }
`;

export default function Dashboard() {
  const history = useHistory();
  const { data, error, loading } = useQuery(GET_USER_QUERY);
  if (error) {
    history.push('/');
  }

  if (loading) return <Spinner animation="border" />;

  return (
    <Container>
      <Row>
        <Col>
          <h2>Welcome, {data && data.getUser ? data.getUser.name : null}</h2>
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
