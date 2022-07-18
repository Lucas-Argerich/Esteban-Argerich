import React from "react";
import styled from "styled-components";
import GalleryComponent from "../../components/galleryComponent/galleryComponent"

const Main = styled.main`
  margin: 50px 10px;
  padding-bottom: 30px;

  @media (min-width: 769px) {
    margin: 50px 50px;
  }

  @media (min-width: 1440px) {
    margin: 70px 200px;
  }
`;

export default function Gallery() {
  return (
    <Main>
      <GalleryComponent />
    </Main>
  );
}
