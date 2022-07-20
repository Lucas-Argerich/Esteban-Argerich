import React from "react";
import styled from "styled-components";
import imageOne from "./assets/facebook_1566015511278.jpg";
import imageTwo from "./assets/30420156_10156423608440972_8722455173855219770_o.jpg";

const Main = styled.main`
  margin: 50px 10px 200px;

  @media (min-width: 769px) {
    margin: 50px 50px 200px;
  }

  @media (min-width: 1440px) {
    margin: 70px 200px 200px;
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

const List = styled.ul`
  border-bottom: solid 1px #36363632;
  margin: 50px 0;

  li {
    margin: 15px 0;
  }
`;

export default function AboutMe() {
  return (
    <Main>
      <h2>Esteban Argerich</h2>
      <One>
        <p>
          Mi inicio en la fotografía fue a los 16 años. Cámara analógica y el
          dormitorio en mi casa materna que de noche mutaba a laboratorio blanco
          y negro. El mayor reto: no gritar como un loco cuando algún hermano
          prendía la luz del pasillo. Me llevó semanas darme cuenta que los
          velos que aparecían en los rollos, eran producto de la estática que
          producía la ropa dentro del placard en el que me metía para cargarlos
          en el tanque de revelado…. Jugando con mi ampliadora “Casa del
          Fotógrafo” aprendí muchas de las técnicas y efectos que aún hoy se
          utilizan en su versión digital.
          <br />
          <br />
          Fue recién durante el año 2010 que hice la metamorfosis a fotógrafo
          digital. A partir de ese año empecé a dedicarle más tiempo y atención
          a la fotografía de naturaleza y fauna silvestre, con especial interés
          en el mundo de las aves. Amante de la naturaleza y de las actividades
          al aire libre, esta disciplina me atrapó por completo.
        </p>
        <Image>
          <img src={imageOne} />
        </Image>
      </One>
      <Two>
        <p>
          Hace poco más de tres años soy miembro activo de la comisión directiva
          de AFONA (Asociacion de Fotógrafos de Naturaleza de Argentina)
          <br />
          <br />
          Soy un firme convencido de que la fotografía es una gran herramienta
          para la conservación.
          <br />
          <br />
          Fotógrafo voluntario de Proyecto Pantano. Una ONG inter-institucional
          que trabaja en la conservación del Ciervo de los Pantanos en el Delta
          del Paraná.
        </p>
      </Two>
      <Three>
        <Image>
          <img src={imageTwo} />
        </Image>
        <p>
          He realizado la muestra unipersonal itinerante “Aves de San Isidro –
          Conociendo a nuestros vecinos” que ha sido exhibida en muchos
          colegios, tanto en primaria como en secundaria, con el objetivo de que
          los jóvenes conozcan, quieran y cuiden las aves de sus barrios. En
          clubes de rugby del municipio, en la plaza de la Municipalidad de San
          Isidro, en un centro de Tercera Edad, en el Palacio de la Legislatura
          de Buenos Aires.
          <br />
          <br />
          He impartido charlas y talleres sobre fotografía de aves, fotografía
          de fauna, fotografía de aves en alta velocidad, fotografía de
          naturaleza en áreas urbanas.
        </p>
      </Three>
      <div>
        <h3>
          Algunos de los libros en los que he participado colaborado con
          imágenes son:
        </h3>
        <br />
        <List>
          <li>Argentina Salvaje , H. Povedano, D. Podesta</li>
          <li>
            Guía Ilustrada de Fauna Silvestre de las Áreas de Operación San
            Alberto, San Antonio e Itaú. Bolivia. Peñaranda, E.M.
          </li>
          <li>
            Hábitos de nidificación de las aves del bosque templado andino de
            Chile. Altamirano, T.A. y otros
          </li>
          <li>
            Aves de Mar Chiquita Provincia de Buenos Aires = Birds of Mar
            Chiquita Provincia de Buenos Aires: guía de campo , Canevari J. y
            otros
          </li>
          <li>
            Ganadería Sustentable de Pastizal. Producir y conservar es posible.
            Miñarro F. y otros.
          </li>
          <li>
            Aves de la provincia de Rio Negro: Identificación, distribución,
            estatus. Povedano H.
          </li>
          <li>
            Aves terrestres de la Patagonia, Tierra del Fuego e Islas del
            Atlántico Sur. Povedano H. y otros
          </li>
          <li>Guía Audiornis de Las Aves de Argentina. López Lanús B.</li>
          <li>
            Aves de Tierra del Fuego Isla Grande e Islas Adyacentes. Alvarado,
            R.L.
          </li>
          <li>
            CANIDS OF THE WORLD Wolves, Wild Dogs, Foxes, Jackals, Coyotes, and
            Their Relatives. Castello J.
          </li>
          <li>
            A Thriving Sanctuary for Bird Watchers in the Bolivian Amazon.
            Taylor Rocc-Mccord
          </li>
          <li>
            Picaflores en Argentina y Sudamérica: historia natural y
            biodiversidad. Povedando H. y otro
          </li>
          <li>
            Los picaflores mas australes del mundo; regiones Neo tropical y
            subantartica de la Argentina. Guller R.
          </li>
          <li>
            Aves de la provincia de Buenos Aires: guía de campo. Tito Narosky y
            otro.
          </li>
          <li>
            Flores y picaflores de Argentina y países limítrofes. De Marzi, V.
          </li>
          <li>
            El Impenetrable del Chaco y sus secretos: un panorama natural y
            cultural . Bertonatti, C.
          </li>
        </List>
        <p>
          He participado como jurado en concursos internacionales y nacionales.
          <br />
          <br />
          He participado en numerosas muestras colectivas de fotografía de
          naturaleza.
          <br />
          <br />
          Colaboración fotográfica en la emisión de sellos conmemorativa de los
          100 años de Aves Argentinas del Correo Argentino.
          <br />
          <br />
          Colaboraciones fotográficas en las revistas de la Fundación Vida
          Silvestre Argentina y de Aves Argentinas.
          <br />
          <br />
          Colaboraciones fotográficas para la Administración de Parques
          Nacionales Colaboración fotográfica en catalogo CABI Invasive Species
          Compendium (CABI.ORG)
        </p>

        <h3 style={{marginTop: "100px"}}>Autor o coautor en los siguientes artículos: </h3>
        <List>
          <li>
            ARGERICH, E.,C 2010. Primer registro de anó grande (Crotophaga
            major) en el parque natural municipal Ribera Norte, San Isidro,
            provincia de Buenos Aires, Argentina. Nótulas Faunísticas (segunda
            serie), 47.
          </li>
          <li>
            ARGERICH E., MANNARINO L.Y LA GROTTERIA J., ECOREGISTROS REVISTA N°
            1 - Artículo Nº 18 - 2011 Registros actuales del Playero de Ala
            Blanca (Tringa semipalmata) en la provincia de Buenos Aires.
          </li>
          <li>
            DI FIORE, E., C. F. DANTI, M. A. RODA, J. APARICIO, E. ARGERICH Y J.
            GARCIA. 2013. Nuevos registros de Pato Crestudo (Sarkidiornis
            melanotos) para el sur de Entre Ríos y para la provincia de Buenos
            Aires, Argentina. EcoRegistros Revista, 3(6): 24-28.
          </li>
        </List>
        <p>
          También he tenida la satisfacción del reconocimiento a mi trabajo en
          premios de numerosos concursos de fotografía tanto nacionales como
          internacionales.
        </p>
      </div>
    </Main>
  );
}
