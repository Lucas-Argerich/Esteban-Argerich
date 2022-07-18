import React, { useState } from "react";
import OwnerSign from "./assets/Esteban-Argerich-black-high-res.png";
import styled from "styled-components";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery } from "@mui/material";

const Header = styled.header`
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.img`
  height: 80px;
  @media (min-width: 769px) {
    height: 100px;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;

  @media (min-width: 769px) {
    flex-direction: row;
  }
`;

const Wrapper = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 30px;
  transition: 200ms;

  @media (min-width: 769px) {
    flex-direction: row;
    position: static;
  }
`;

const Hamburger = styled.div`
  display: flex;
  justify-content: right;

  @media (min-width: 769px) {
    display: none;
  }
`;

const StyledListItem = styled.li`
  font-weight: 700;
  font-size: 1rem;
  text-align: right;
  margin-top: 5px;

  @media (min-width: 769px) {
    text-align: left;
    font-size: 1.2rem;
    margin: 0 25px;
  }

  &::after {
    content: "";
    width: 0%;
    height: 1px;
    background: #363636;
    display: block;
    transition: 200ms;
    margin-left: auto;
  }

  &:hover::after {
    width: 100%;
  }
`;

const StyledLink = styled(Link)`
  width: 150px;
  white-space: nowrap;
`;

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const lg = useMediaQuery("(min-width: 769px)");

  return (
    <Header>
      <Link to="/">
        <Logo src={OwnerSign} alt="Esteban Argerich Sign as Header Icon" />
      </Link>
      <Nav>
        <Hamburger onClick={() => setOpen(!open)}>
          <MenuIcon />
        </Hamburger>
        <Wrapper style={open || lg ? { minWidth: "100px" } : { width: "0" }}>
          <StyledListItem>
            <StyledLink to="/"> Home </StyledLink>
          </StyledListItem>
          <StyledListItem>
            <StyledLink to="/gallery"> Galería </StyledLink>
          </StyledListItem>
          <StyledListItem>
            <StyledLink to="/about-me"> Sobre mi </StyledLink>
          </StyledListItem>
        </Wrapper>
      </Nav>
    </Header>
  );
}
