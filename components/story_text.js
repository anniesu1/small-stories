// import React, { Component } from 'react';
// var strips = require('strips');
//
// class StoryText extends Component {
//   // static async getInitialProps({ req }) {
//   //   const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
//   //   return { userAgent }
//   // }
//   constructor(props) {
//     super(props);
//     console.log("props.text = " + props.text);
//     console.log("domain:" + domain);
//     this.state = {
//       text: props.text,
//     };
//     this.getStory = this.getStory.bind(this);
//   }
//
//   getStory() {
//     // Load the domain and problem.
//     strips.load('../planner/dinner_domain.txt', '../planner/dinner_problem.txt',
//                 function(domain, problem) {
//         // Run the problem against the domain.
//         var solutions = strips.solve(domain, problem);
//
//         // Display each solution.
//         for (var i in solutions) {
//             var solution = solutions[i];
//
//             console.log('- Solution found in ' + solution.steps + ' steps!');
//             for (var i = 0; i < solution.path.length; i++) {
//                 console.log((i + 1) + '. ' + solution.path[i]);
//             }
//         }
//     }, false);
//     return "hello goobs";
//   }
//
//   getInitialProps() {
//     return {
//       text: "blah blah",
//     };
//   }
//
//   render() {
//     const story = this.getStory();
//     console.log("story: " + story);
//     return (<div>Hello World!!</div>);
//   }
// }
//
// export default StoryText
