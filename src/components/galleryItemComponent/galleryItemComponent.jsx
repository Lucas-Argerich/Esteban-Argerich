import React from "react";
import { ImageListItem } from "@mui/material";

export default function GalleryItemComponent(props) {
  return (
    <>
      <ImageListItem key={props.item.id}>
        <img
          src={`${props.item.url}?w=248&fit=crop&auto=format`}
          srcSet={`${props.item.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
          /*alt={item.title}*/
          onClick={() => props.handleOpen(props.index)}
        />
      </ImageListItem>
    </>
  );
}
