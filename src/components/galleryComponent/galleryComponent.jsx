import React, { useState } from "react";
import { ImageList, ImageListItem } from "@mui/material";
import Modal from "@mui/material/Modal";
import styled from "styled-components";
import { photos } from "../../photos/photos";
import CloseIcon from "@mui/icons-material/Close";

const StyledModal = styled(Modal)`
  background: #00000080;
`;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  outline: none;
  max-height: 90vh;
  max-width: 75vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 40px;
`;

const Image = styled.img`
  max-height: inherit;
  max-width: inherit;
`;

const ModalTextContainer = styled.div`
  margin-left: 220px;
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translateY(-50%);
  h3 {
    color: #ffffff;
    font-weight: 400;
  }
  h4 {
    color: #ffffff;
    font-weight: 400;
  }
`;

const StyledCloseIcon = styled(CloseIcon)`
  position: absolute;
  top: 0;
  right: 0;
  transform: scale(3) translate(-100%, 75%);
  cursor: pointer;
  z-index: 1;
  path {
    color: #ffffff;
  }
`;

export default function GalleryComponent() {
  const [modalImage, setModalImage] = useState(0);
  const [open, setOpen] = useState(false);

  const handleOpen = (index) => {
    setModalImage(index);
    setOpen(true);
  };

  const handleClose = () => {
    setModalImage(0);
    setOpen(false);
  };

  return (
    <div>
      <ImageList variant="masonry" cols={3} gap={8}>
        {photos.map((item, index) => (
          <ImageListItem key={item.img}>
            <img
              src={`${item.img}?w=248&fit=crop&auto=format`}
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
              onClick={() => handleOpen(index)}
            />
          </ImageListItem>
        ))}
      </ImageList>
      <StyledModal open={open} onClose={handleClose}>
        <>
          <StyledCloseIcon onClick={handleClose} />
          <ModalContent>
            <Image src={photos[modalImage].img} />
          </ModalContent>
          <ModalTextContainer>
            <h3>Nombre Lorem Ipsum</h3>
            <h4>Ubicación Lorem Ipsum</h4>
          </ModalTextContainer>
        </>
      </StyledModal>
    </div>
  );
}
