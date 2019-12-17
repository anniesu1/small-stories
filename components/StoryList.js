import React from 'react';
import Fade from 'react-reveal/Fade';

function getImage(sentence) {
    if (sentence.includes("There once")) {
        return "/static/cat.png"
    }
    else if (sentence.includes("alarm")) {
        return "/static/wake.jpg"
    }
    else if (sentence.includes("befriend")) {
        return "/static/friend.jpg";
    } 
    else if (sentence.includes("island")) {
        return "/static/island.jpg";
    }
    else if (sentence.includes("die") || sentence.includes("murders")) {
        return "/static/die.jpg";
    }
    else if (sentence.includes("painter")) {
        return "/static/artist.jpg";
    }
    else if (sentence.includes("writer")) {
        return "/static/author.jpg"
    }
    else if (sentence.includes("defeat")) {
        return "/static/defeat.jpg";
    }
    else if (sentence.includes("dragon")) {
        return "/static/dragon.jpg";
    }
    else if (sentence.includes("The end.")) {
        return "/static/fin.jpg";
    }
    else if (sentence.includes("forest")) {
        return "/static/forest.jpg"
    }
    else if (sentence.includes("love")) {
        return "/static/love.jpg"
    }
    else if (sentence.includes("mice")) {
        return "/static/mice.jpg"
    }
    else if (sentence.includes("president")) {
        return "/static/president.jpg"
    }
    else if (sentence.includes("shortcake")) {
        return "/static/shortcake.jpg"
    }
    else if (sentence.includes("nobel")) {
        return "/static/nobel.jpg"
    }
}
const StoryList = ({ storySentences }) => (
    <div>
        <Fade top>
            <div>
            {storySentences.map((sentence, index) => (
            <Fade top>
            <div className='card'>
                <img src={getImage(sentence)}
                    alt='cat'
                    className='center'
                />
                <h3 className='center'>{sentence}</h3>
            </div>
            </Fade>
            ))}
            </div>
        </Fade>
    
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
      padding: 30px 30px 30px 30px;
      width: 700px;
      text-align: left;
      text-decoration: none;
      color: #434343;
      border: 1px solid #9b9b9b;
      display: inline-block;
      margin: 100px
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
      width: 80%;
    }
  `}</style>
  </div>
);

export default StoryList;