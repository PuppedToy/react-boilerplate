import styled from 'styled-components';
import PropTypes from 'prop-types';
import imgChecked from './checkbox-checked.png';
import imgUnchecked from './checkbox-unchecked.png';

const Checkbox = styled.div`
  width: 40px;
  height: 40px;
  overflow-y: auto;
  cursor: pointer;
  border-style: none;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: ${({ done }) => `url(${done ? imgChecked : imgUnchecked})`};

  &:first-child {
    border-top: none;
  }
`;

Checkbox.propTypes = {
  done: PropTypes.bool,
};

export default Checkbox;
