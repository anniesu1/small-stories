const express = require("express");
const router = express.Router();
const strips = require('strips');

/*
 * Planner-script is used to tune the story world domain and problem
 * quickly by outputting steps in the terminal.
 *
 * 1. Open your terminal. Navigate to the project directory /planner
 * 2. Run the following
 *    > node planner-script.js
 */
 // Load the constant variables in the story
 const location = getLocation(); // Global setting variable
 const leadName = getLeadName();
 const supportingName = getSupportingName();

 console.log("> Running planner script");
 strips.load("./story_world_domain.txt", "./story_world_problem.txt",
   function(domain, problem) {
     var solutions = strips.solve(domain, problem, true /* isDFS*/,
                                  100 /*maxNumSolutions*/);
     console.log('Number of solutions: ' + solutions.length);
     // Display each solution.
     // for (var i in solutions) {
         // var solution = solutions[i];

         // console.log('- Solution found in ' + solution.steps + ' steps!');
         // for (var i = 0; i < solution.path.length; i++) {
         //     console.log((i + 1) + '. ' + solution.path[i]);
         // }
     // }

     // Pick a solution at random
     var randomIndex = getRandomInt(solutions.length);
     let selectedPlan = solutions[randomIndex];
     let sentences = constructSentences(selectedPlan.path);
     let story = assembleStory(sentences);
     console.log(story);

 }, false /* isCode */);

 /*
  * Choose a location from the preset options at random
  */
function getLeadName() {
  let names = ["Momo", "Chi", "Toru", "Maru", "Mabel"];
  let index = getRandomInt(names.length);
  return names[index];
}

function getSupportingName() {
  let names = ["Mittens", "Moo", "Yori"];
  let index = getRandomInt(names.length);
  return names[index];
}

 function getLocation() {
   let places = ["the hilly city of San Francisco", "the vibrant city of Tokyo",
     "the Eiffel Tower of Paris", "a cottage by the ocean",
     "a university campus"];
   let index = getRandomInt(places.length);
   return places[index];
 }

 function getRandomInt(max) {
   return Math.floor(Math.random() * Math.floor(max));
 }

 /*
  * Transform STRIPS planner output into grammatically-correct sentences by
  * applying templates. No periods yet.
  */
 function constructSentences(solution) {
   let sentences = [];
   for (let i = 0; i < solution.length; i++) {
     let sentence = applyTemplate(solution[i]);
     sentences.push(sentence);
   }
   sentences = stylizeSentences(sentences);
   return sentences;
 }

 function stylizeSentences(sentences) {
   // Incorporate pronoun replacement, narrative voice, transition words
   let previouslyUsedName = false;
   for (let i = 0; i < sentences.length; i++) {
     let sentence = sentences[i];
     if (sentence.indexOf("wake") != -1) {
       sentences[i] = sentences[i] + " at the sound of her alarm";
       continue;
     }
     if (sentence.indexOf("befriend") != -1) {
       sentences[i] = sentences[i] + " named " + supportingName;
       sentences[i] = sentences[i] + ", and the two begin spending a lot of time together";
       continue;
     }
     // At random, add a transition word
     if (Math.random() > 0.5 && i != 0) {
       sentences[i] = "Then, " + sentences[i].toLowerCase();
     }
     else if (Math.random() > 0.3 && i != 0) {
       sentences[i] = sentences[i].replace("The tabby", leadName);
     }

     //console.log(sentences[i]);
     // if (previouslyUsedNoun && (Math.random() > 0.5)) {
     //   // Replace with pronoun
     //   previouslyUsedNoun = false;
     //
     //   // At random, decide whether to change to pronoun or name
     //   if (sentence.indexOf())
     // }
     // else {
     //   previouslyUsedNoun = true;
     // }
   }
   return sentences;
 }

function assembleStory(sentences) {
  let preamble = "There once lived a small tabby cat named " + leadName +
  " who lived in " + location + ". This is the story of her rather ordinary life. ";

  let storySentences = "";
  for (let i = 0; i < sentences.length; i++) {
    storySentences += sentences[i] + ". ";
  }

  let ending = "The end."
  let story = preamble + storySentences + ending;
  return story;
}

 /*
  * Transform a single step into a sentence (in present tense).
  */
 function applyTemplate(step) {
   // TODO: allow for variation within the templates.
   let sentence = "";
   let tokens = step.split(" ");

   if (tokens.length == 2) {
     // Length 2: simple swap of subject and verb
     let verb = applyVerbTense("PRESENT", tokens[0]);
     sentence += "The " + tokens[1] + " " + verb;
   }
   else if (tokens.length == 3) {
     // Length 3: subject, verb, direct object
     let verb = applyVerbTense("PRESENT", tokens[0]);
     sentence += "The " + tokens[1] + " " + verb + " the " + tokens[2];
   }
   return sentence;
 }

 /*
  * Properly format a verb. Then, apply a specified verb tense to a given verb.
  * Currently supported verb tenses are PAST, PRESENT, and FUTURE.
  */
 function applyVerbTense(tense, verb) {
   // Find the first occurrence of "-", which we use to denote space in PDDL
   let index = verb.indexOf("-");
   let leftover = "";
   if (index != -1) {
     leftover = " " + verb.substring(index + 1).replace(/-/g, " ");
     verb = verb.substring(0, index);
   }
   if (tense === "PAST") {
     let output = "" + verb + "ed" + leftover;
     return output;
   }
   else if (tense === "PRESENT") {
     let output = "" + verb + "s" + leftover;
     return output;
   }
   else if (tense === "FUTURE") {
     let output = "will " + verb + leftover;
     return output;
   }
 }

 module.exports = router;
