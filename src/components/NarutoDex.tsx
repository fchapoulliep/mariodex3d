/* Importing React and Link from react-router-dom */
import React from "react";

/* Importing Swiper components */
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import SwiperCore from "swiper/core";
SwiperCore.use([Keyboard, Navigation]);
import "swiper/swiper-bundle.css";

/* Importing the CSS file */
import "../css/narutodex.css";

/* Importing the list of Naruto Character */
import narutoCharacterList from "../data/narutocharacters.json";

/* Importing the Footer component */
import Footer from "./Footer";
import NarutoCard from "./NarutoCard";

import narutoLogo from "../assets/logo/narutoLogo.png";

/**
 * NarutoDex component that displays a list of Naruto Characters as links.
 * Each Naruto Character name is converted to lowercase and used as the URL path.
 *
 * @component
 * @example
 * return (
 *   <NarutoDex />
 * )
 */
const NarutoDex: React.FC = () => {
  const [narutoCharacterToShow, setNarutoCharacterToShow] =
    React.useState(narutoCharacterList);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("");

  /**
   * handleInput function that filters the Naruto Characters list based on the search query.
   */
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterNarutoCharacter(query, selectedType);
  };

  /**
   * handleTypeChange function that filters the Naruto Characters list based on the selected type.
   */
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value;
    setSelectedType(type);
    filterNarutoCharacter(searchQuery, type);
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
   * filterNarutoCharacter function that filters the Naruto Characters list based on the search query and type.
   * @param query the search query
   * @param type the selected type
   */
  const filterNarutoCharacter = (query: string, type: string) => {
    const filterednarutoCharacter = narutoCharacterList.filter(
      (narutoCharacter) => {
        const matchesName =
          normalizeText(narutoCharacter.name).startsWith(
            normalizeText(query)
          ) ||
          normalizeText(narutoCharacter.name).includes(normalizeText(query));
        const matchesType =
          type === "" ? true : narutoCharacter.village === type;
        return matchesName && matchesType;
      }
    );
    setNarutoCharacterToShow(filterednarutoCharacter);
  };

  return (
    <div id="narutodex">
      <div id="narutodex-navbar">
        <a
          href={`${import.meta.env.BASE_URL}`}
          style={{ height: "100%", display: "flex", alignItems: "center" }}
        >
          <img
            src={narutoLogo}
            alt="Naruto Logo"
            style={{ width: "120px" }}
          />
        </a>
        <search id="search-bar">
          <input
            name="narutocharacter-name"
            type="text"
            placeholder="Search Character"
            onInput={handleInput}
          />
          <select name="narutocharacter-type" onChange={handleTypeChange}>
            <option value="">All Villages</option>
            {Array.from(
              new Set(
                narutoCharacterList.flatMap(
                  (narutocharacter) => narutocharacter.village
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
      <div id="narutodex-container">
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
          {narutoCharacterToShow.map((narutoCharacter, index) => (
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
              <NarutoCard
                key={index}
                name={narutoCharacter.name}
                id={narutoCharacter.id}
                clan={narutoCharacter.clan}
                village={narutoCharacter.village}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Footer />
    </div>
  );
};

export default NarutoDex;
