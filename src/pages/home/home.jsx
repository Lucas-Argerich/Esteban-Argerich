import React from "react";
import styled from "styled-components";
import HorizontalBackground from "./assets/backgroundOne.jpg";
import VerticalBackground from "./assets/backgroundTwo.jpg";

const Main = styled.main`
  background: url(${VerticalBackground}) no-repeat;
  background-size: cover;
  height: calc(100vh - 130px);

  @media (min-width: 769px) {
    background: url(${HorizontalBackground}) no-repeat;
    background-size: calc(80vw);
    background-position: left center;
  } ;
`;

export default function Home() {
  return <Main />;
}
