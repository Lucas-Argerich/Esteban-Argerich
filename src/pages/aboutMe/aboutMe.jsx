import React from "react";
import styled from "styled-components";
import imageOne from "./assets/facebook_1566015511278.jpg";
import imageTwo from "./assets/30420156_10156423608440972_8722455173855219770_o.jpg";

const Main = styled.main`
  margin: 50px 10px;

  @media (min-width: 769px) {
    margin: 50px 50px;
  }

  @media (min-width: 1440px) {
    margin: 70px 200px;
  }
`;

const One = styled.div`
  margin: 30px 0;

  @media (min-width: 769px) {
    display: flex;
  }

  p {
    margin: 0 20px 20px 0;
  }
`;

const Image = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  object-fit: contain;
  display: flex;
  justify-content: flex-end;

  @media (min-width: 769px) {
    width: 30vw;
  }

  img {
    width: inherit;
    height: inherit;
    object-fit: cover;
    object-position: center;
  }
`;

const Two = styled.div``;

const Three = styled.div`
  margin: 30px 0;
  padding-bottom: 30px;

  @media (min-width: 769px) {
    display: flex;
  }

  p {
    margin: 20px 0 20px 0px;

    @media (min-width: 769px) {
      margin: 0 0 20px 20px;
    }
  }
`;

export default function AboutMe() {
  return (
    <Main>
      <h2>Esteban Argerich</h2>
      <One>
        <p>
          Mis inicios en la fotografía fueron a los 16 años. Cámara analógica y
          el dormitorio en mi casa materna que de noche mutaba a laboratorio
          blanco y negro. El mayor reto: no gritar como un loco cuando algún
          hermano prendía la luz del pasillo. Me llevo semanas darme cuenta que
          los velos que aparecían en los rollos eran productos de la estática
          que producía la ropa dentro del placard en el que me metía para
          cargarlos en el tanque de revelado…. Jugando con mi ampliadora “Casa
          del Fotógrafo” aprendí muchas de las técnicas y efectos que aun hoy se
          utilizan en su versión digital.
          <br />
          <br />
          Fue recién durante el año 2010 que hice la metamorfosis a fotógrafo
          digital. A partir del año 2010 empecé a dedicarle mas tiempo y mas
          atención a la fotografía de naturaleza y fauna silvestre, con especial
          interés el mundo de las aves. Amante de la naturaleza y de las
          actividades al aire libre esta disciplina me atrapo por completo.
        </p>
        <Image>
          <img src={imageOne} />
        </Image>
      </One>
      <Two>
        <p>
          He impartido charlas y talleres sobre Fotografia a de aves, Fotografia
          de aves en alta velocidad, Fotografia de naturaleza en áreas urbanas.
          <br />
          <br />
          Mis fotos han sido publicadas en muchos libros, guías y revistas.
          <br />
          <br />
          He participado de muchas exposiciones y también he participado como
          jurado en concursos internacionales y nacionales.
        </p>
      </Two>
      <Three>
        <Image>
          <img src={imageTwo} />
        </Image>
        <p>
          Hace unos tres años soy miembro activo de la comisión directiva de
          AFONA (Asociacion de Fotógrafos de Naturaleza de Argentina)
          <br />
          <br /> Fotógrafo voluntario de Proyecto Pantano una ONG
          inter-institucional que trabaja en la conservación del Ciervo de los
          Pantanos en el Delta del Paraná.
          <br />
          <br />
          Soy un firme convencido de que la fotografía es un gran herramienta
          para la conservación.
          <br />
          <br /> He hecho muchas muestras en colegios primarios y secundarios
          para que los jóvenes conozcan, quieran y cuiden las aves de sus
          barrios.
        </p>
      </Three>
    </Main>
  );
}
