import React from "react";
import Slider from "./components/Slider";
import Features from "./components/Features";
import OurEventCategories from "./components/OurEventCategories";
import Faq from "./components/Faq";

const Home = () => {
  return (
    <div>
      <Slider />
      <Features/>
      <OurEventCategories/>
      <Faq/>
    </div>
  );
};

export default Home;
