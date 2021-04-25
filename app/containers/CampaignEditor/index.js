import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, ListGroup, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const GET_CAMPAGINS_QUERY = gql`
  query GetCampaignsList {
    alive
  }
`;

export default function CampaignEditor() {
  const history = useHistory();
  const { /* data, */ error, loading } = useQuery(GET_CAMPAGINS_QUERY);
  if (error) {
    history.push('/');
  }

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <Container>
        <ListGroup>
          <ListGroup.Item>Item 1</ListGroup.Item>
          <ListGroup.Item>Item 2</ListGroup.Item>
        </ListGroup>
      </Container>
    </div>
  );
}
