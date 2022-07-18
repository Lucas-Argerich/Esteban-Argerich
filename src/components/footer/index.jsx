import React from "react";
import styled from "styled-components";
import { Instagram, Facebook } from "@mui/icons-material";

const FooterContainer = styled.footer`
  background-color: #ffffff00;
  position: absolute;
  bottom: 0;
  gap: 20px;

  margin: 50px 10px 20px;

  @media (min-width: 769px) {
    display: flex;
    margin: 50px 50px 20px;
  }

  @media (min-width: 1440px) {
    margin: 70px 200px 20px;
  }
`;

const Media = styled.a`
  display: flex;
  align-items: center;
  font-size: 1rem;
  white-space: nowrap;
  width: inherit;

  @media (min-width: 769px) {
    font-size: 1.2rem;
  }
`;

export default function Footer() {
  return (
    <FooterContainer>
      <Media href="https://www.facebook.com/esteban.argerich.5" target="_blank">
        <Facebook />
        <span>Esteban Argerich</span>
      </Media>
      <Media href="https://www.instagram.com/argerichesteban/" target="_blank">
        <Instagram />
        <span>@argerichesteban</span>
      </Media>
    </FooterContainer>
  );
}
