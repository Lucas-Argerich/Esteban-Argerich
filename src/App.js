import { Route, Routes } from "react-router-dom";
import Footer from "./components/footer";
import NavBar from "./components/navBar/navBar";
import AboutMe from "./pages/aboutMe/aboutMe";
import Gallery from "./pages/gallery/gallery";
import Home from "./pages/home/home";

export default function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="about-me" element={<AboutMe />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}