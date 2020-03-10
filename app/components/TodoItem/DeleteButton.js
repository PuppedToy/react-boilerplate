import styled from 'styled-components';
import img from './delete.png';

const DeleteButton = styled.div`
  width: 35px;
  height: 35px;
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url(${img});
`;

export default DeleteButton;
