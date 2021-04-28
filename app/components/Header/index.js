import React from 'react';
import styled from 'styled-components';
import { Nav, Navbar } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { BiPowerOff } from 'react-icons/bi';

const StyledNavbar = styled(Navbar)`
  border-bottom: 1px solid #000;
  margin-bottom: 20px;
`;

const NavLink = styled(Nav.Link)`
  padding: 10px;
  ${({ current }) =>
    current
      ? `
    font-weight: bold;
    text-decoration: underline;
  `
      : null}
`;

function Header() {
  const location = useLocation();
  const { pathname } = location;

  const logout = () => {
    localStorage.removeItem('token');
  };

  const options = [
    {
      key: 0,
      name: 'Campaign Editor',
      path: '/dashboard/campaign-editor',
    },
    {
      key: 1,
      name: 'Friends',
      path: '/dashboard/friends',
    },
    {
      key: 2,
      name: 'Battle',
      path: '/dashboard/battle',
    },
  ];

  return (
    <div>
      <StyledNavbar bg="light" variant="light" expand="lg">
        {options.map(({ key, name, path }) => (
          <NavLink key={key} current={pathname === path ? 1 : 0} href={path}>
            {name}
          </NavLink>
        ))}
        <NavLink onClick={logout} href="/login">
          <BiPowerOff alt="logout" />
        </NavLink>
      </StyledNavbar>
    </div>
  );
}

export default Header;
