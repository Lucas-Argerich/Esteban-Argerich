import React from "react";
import styled from "styled-components";
import GalleryComponent from "../../components/galleryComponent/galleryComponent"

const Main = styled.main`
  margin: 70px 200px;
`;

export default function Gallery() {
  return (
    <Main>
      <GalleryComponent />
    </Main>
  );
}
