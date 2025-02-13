/* Importing React and Link from react-router-dom */
import React from "react";

/* Importing Swiper components */
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import SwiperCore from "swiper/core";
SwiperCore.use([Keyboard, Navigation]);
import "swiper/swiper-bundle.css";

/* Importing the CSS file */
import "../css/mariodex.css";

/* Importing the list of Mario Character */
import marioCharacterList from "../data/mariocharacters.json";

/* Importing the Footer component */
import Footer from "./Footer";
import MarioCard from "./MarioCard";

import marioLogo from "../assets/logo/marioLogo.png";

/**
 * MarioDex component that displays a list of Mario Characters as links.
 * Each Mario Character name is converted to lowercase and used as the URL path.
 *
 * @component
 * @example
 * return (
 *   <MarioDex />
 * )
 */
const MarioDex: React.FC = () => {
  const [marioCharacterToShow, setMarioCharacterToShow] =
    React.useState(marioCharacterList);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("");

  /**
   * handleInput function that filters the Mario Characters list based on the search query.
   */
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterMarioCharacter(query, selectedType);
  };

  /**
   * handleTypeChange function that filters the Mario Characters list based on the selected type.
   */
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value;
    setSelectedType(type);
    filterMarioCharacter(searchQuery, type);
  };

  /**
   * Normalizes a given text string by:
   * 1. Decomposing combined graphemes into their constituent parts (NFD normalization).
   * 2. Removing diacritical marks (accents).
   * 3. Converting the text to lowercase.
   *
   * @param text - The input string to be normalized.
   * @returns The normalized string.
   */
  const normalizeText = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  /**
   * filterMarioCharacter function that filters the Mario Characters list based on the search query and type.
   * @param query the search query
   * @param type the selected type
   */
  const filterMarioCharacter = (query: string, type: string) => {
    const filteredmarioCharacter = marioCharacterList.filter(
      (marioCharacter) => {
        const matchesName =
          normalizeText(marioCharacter.name).startsWith(normalizeText(query)) ||
          normalizeText(marioCharacter.name).includes(normalizeText(query));
        const matchesType =
          type === "" ? true : marioCharacter.city.includes(type);
        return matchesName && matchesType;
      }
    );
    setMarioCharacterToShow(filteredmarioCharacter);
  };

  return (
    <div id="mariodex">
      <div id="mariodex-navbar">
        <a
          href={`${import.meta.env.BASE_URL}`}
          style={{ height: "100%", display: "flex", alignItems: "center" }}
        >
          <img src={marioLogo} alt="Mario Logo" style={{ width: "100px" }} />
        </a>
        <search id="search-bar">
          <input
            name="mariocharacter-name"
            type="text"
            placeholder="Search Character"
            onInput={handleInput}
          />
          <select name="mariocharacter-type" onChange={handleTypeChange}>
            <option value="">All Kingdoms</option>
            {Array.from(
              new Set(
                marioCharacterList.flatMap(
                  (marioCharacter) => marioCharacter.city
                )
              )
            ).map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </search>
      </div>
      <div id="mariodex-container">
        <Swiper
          spaceBetween={30}
          slidesPerView="auto"
          centeredSlides={true}
          freeMode={true}
          navigation={true}
          initialSlide={2}
          keyboard
          cssMode
        >
          {marioCharacterToShow.map((marioCharacter, index) => (
            <SwiperSlide
              style={{
                width: "300px",
                textAlign: "center",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              key={index}
            >
              <MarioCard
                key={index}
                name={marioCharacter.name}
                id={marioCharacter.id}
                city={marioCharacter.city}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Footer />
    </div>
  );
};

export default MarioDex;
