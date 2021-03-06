import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import axios from 'axios';
import Fade from 'react-reveal/Fade';
import StoryList from '../components/StoryList'
//import { GetBFSSolutions } from '../planner/test.js';

function Home() {
  let [story, setStory] = useState([]);

  useEffect(() => {
      axios.post("/api/generateStory").then(response => {
        if (!response.data.success) {
          console.log("error");
        }
        else {
          console.log("> Story was generated");
          setStory(response.data.story);
        }
      });
  }, []); // Second argument: empty array to only execute effect one time

  return (
  <div>
    <Head>
      <title>Home</title>
      <link rel='icon' href='/static/favicon.ico' importance='low' />
    </Head>

    <Nav />

    <div className='hero'>
      <img src="/static/cat.png"
           alt='cat'
           style={{maxWidth: '25%'}}
           className='center'
       />
      <h1 className='title'>Let's make a story !</h1>
      <p className='row'>
        hello! we are hard at work creating a story...
      </p>
      <div style={{textAlign: "center"}}>
        <StoryList storySentences={story}></StoryList>
      </div>
    </div>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 700px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
        display: inline-block;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #000000;
        font-size: 20px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }
      .center {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
      }
    `}</style>
  </div>
  );
}

export default Home;
