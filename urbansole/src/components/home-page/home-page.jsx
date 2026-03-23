import React, { useState, useEffect } from 'react'; // Make sure to import useEffect
import { Helmet } from 'react-helmet-async';
import TrendingSection from "../trending-section/trending";
import NewArrivalSection from "../New-Arrival Section/new-arrival-section"
import BrandCarousel from "../brandCardCarousel";
import AdCard from "./adCard1";
import AdCard2 from "./adCard2";
import AdCard3 from "./adCard3";
import ImageSlider from '../ImageSlider';

const Home = () => {
    console.log("Home-page.jsx called...");
    console.log("carouselCard.jsx caled....");
    return (
        <>
            <Helmet>
                <title>UrbanSole | Premium Quality Shoes & Sneakers</title>
                <meta name="description" content="Shop the latest and trending shoes at UrbanSole. Fast delivery, premium materials, and top brands all in one place." />
                <link rel="canonical" href="https://shoeecommercev2.vercel.app/" />
            </Helmet>
            <ImageSlider />
            <TrendingSection />
            <BrandCarousel />
            <NewArrivalSection />
            <AdCard2 />
            <AdCard3 />
            <AdCard />
        </>
    );
}
export default Home;