import React from "react";
import OwnerSign from "./assets/Esteban-Argerich-black-high-res.png";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Nav = styled.nav`
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.img`
  height: 100px;
`;

const Wrapper = styled.ul`
  list-style-type: none;
  display: flex;
`;

const StyledLink = styled.li`
  font-weight: 700;
  font-size: 1.2rem;
  margin: 0 50px;

  &::after {
    content: "";
    width: 0%;
    height: 1px;
    background: #363636;
    display: block;
    transition: 200ms;
  }

  &:hover::after {
    width: 100%;
  }
`;

export default function NavBar() {
  return (
    <Nav>
      <Link to="/">
        <Logo src={OwnerSign} alt="Esteban Argerich Sign as Header Icon" />
      </Link>
      <Wrapper>
        <StyledLink>
          <Link to="/"> Home </Link>
        </StyledLink>
        <StyledLink>
          <Link to="/gallery"> Gallery </Link>
        </StyledLink>
        <StyledLink>
          <Link to="/about-me"> About Me </Link>
        </StyledLink>
      </Wrapper>
    </Nav>
  );
}
