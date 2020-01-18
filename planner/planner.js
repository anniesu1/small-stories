const express = require("express");
const router = express.Router();
const strips = require('strips');

const domainString = "(define (domain cat-world)\
(:requirements :strips)\
(:predicates\
  (CAT ?x)\
  (CHAR ?x)\
  (FOOD ?x)\
  (AWAKE ?x)\
  (ASLEEP ?x)\
  (RESTED ?x)\
  (full-day ?x)\
  (happy ?x)\
  (satiated ?x)\
  (in-love ?x)\
  (friends ?x ?y)\
  (in-forest ?x)\
  (in-danger ?x)\
  (has-power ?x)\
  (won-prize ?x)\
  (is-a-writer ?x)\
  (on-island ?x)\
)\
(:action sleep\
  :parameters (?x)\
  :precondition (and (CAT ?x) (not (RESTED ?x)) (AWAKE ?x)\
    (full-day ?x) (satiated ?x) (not (in-danger ?x)) (not (in-forest ?x)))\
  :effect (and (END ?x))\
)\
(:action wake-up\
  :parameters (?x)\
  :precondition (and (CAT ?x) (ASLEEP ?x))\
  :effect (and (AWAKE ?x)\
              (not (ASLEEP ?x))))\
)\
(:action cook\
  :parameters (?x ?y)\
  :precondition (and (CAT ?x) (FOOD ?y) (AWAKE ?x) (not (satiated ?x)) (not (in-forest ?x)))\
  :effect (and (satiated ?x))\
)\
(:action decide-to-run-for-president\
  :parameters (?x)\
  :precondition (and (CAT ?x) (AWAKE ?x) (not (in-forest ?x)) (satiated ?x) (not (in-danger ?x)))\
  :effect (and (has-power ?x))\
)\
(:action win-a-nobel-prize-for-noble-deeds\
  :parameters (?x)\
  :precondition (and (CAT ?x) (AWAKE ?x) (not (in-forest ?x)) (satiated ?x) (not (in-danger ?x)) (has-power ?x))\
  :effect (and (happy ?x) (won-prize ?x))\
)\
(:action become-the-target-of-an-evil-corporation-of-mice\
  :parameters (?x)\
  :precondition (and (CAT ?x) (AWAKE ?x) (not (in-forest ?x)) (satiated ?x) (not (in-danger ?x)) (has-power ?x) (won-prize ?x))\
  :effect (and (in-danger ?x))\
)\
(:action move-to-a-secluded-island\
  :parameters (?x)\
  :precondition (and (CAT ?x) (AWAKE ?x) (not (in-forest ?x)) (satiated ?x) (not (in-danger ?x)) (won-prize ?x))\
  :effect (and (happy ?x) (on-island ?x))\
)\
(:action become-a-writer-and-poet\
  :parameters (?x)\
  :precondition (and (CAT ?x) (AWAKE ?x) (not (in-forest ?x)) (satiated ?x) (not (in-danger ?x)) (has-power ?x) (not (is-a-painter)))\
  :effect (and (happy ?x) (is-a-writer ?x))\
)\
(:action become-a-painter\
  :parameters (?x)\
  :precondition (and (CAT ?x) (AWAKE ?x) (not (in-forest ?x)) (satiated ?x) (not (in-danger ?x)) (has-power ?x) (on-island ?x) (not (is-a-writer ?x)))\
  :effect (and (happy ?x) (is-a-painter ?x))\
)\
(:action premiere-a-solo-exhibition-at-the-MoMA\
  :parameters (?x)\
  :precondition (and (CAT ?x) (AWAKE ?x) (not (in-forest ?x)) (satiated ?x) (not (in-danger ?x)) (has-power ?x) (on-island ?x) (is-a-painter ?x))\
  :effect (and (happy ?x))\
)\
(:action befriend\
  :parameters (?x ?y)\
  :precondition (and (CAT ?x) (CHAR ?y) (AWAKE ?x) (AWAKE ?y) (not (in-danger ?x)))\
  :effect (and (happy ?x) (happy ?y) (full-day ?x) (full-day ?y) (friends ?x ?y))\
)\
(:action fall-in-love-with\
  :parameters(?x ?y)\
  :precondition (and (CAT ?x) (CHAR ?y) (AWAKE ?x) (AWAKE ?y) (friends ?x ?y) (not (in-danger ?x)))\
  :effect (and (in-love ?x) (END ?x))\
)\
(:action stumble-upon-a-magical-forest-during-a-walk\
  :parameters (?x)\
  :precondition (and (CAT ?x) (AWAKE ?x) (not (in-danger ?x)))\
  :effect (and (in-forest ?x))\
)\
(:action encounter-an-evil-dragon\
  :parameters (?x)\
  :precondition (and (CAT ?x) (AWAKE ?x) (in-forest ?x))\
  :effect (and (in-danger ?x))\
)\
(:action die-in-battle-against-evil-forces\
  :parameters (?x)\
  :precondition (and (CAT ?x) (AWAKE ?x) (in-danger ?x))\
  :effect (and (END ?x))\
)\
(:action defeat-enemy\
  :parameters (?x)\
  :precondition (and (CAT ?x) (AWAKE ?x) (in-danger ?x))\
  :effect (and (END ?x))\
)"

const problemString = "(define (problem cat-problem)\
  (:domain cat-world)\
  (:objects tabby shorthair\
    fried-rice strawberry-shortcake tuna-sandwich\
  )\
  (:init (CAT tabby) (CHAR shorthair)\
    (ASLEEP tabby) (AWAKE shorthair)\
    (FOOD strawberry-shortcake) (FOOD tuna-sandwich) (FOOD fried-rice)\
  )\
  (:goal (and (END tabby))\
)"

// Load the domain and problem.
router.use("/generateStory", async (req, res) => {
  console.log("> Executing story generation");
  strips.load(domainString, problemString,
    function(domain, problem) {
      var solutions = strips.solve(domain, problem, true /* isDFS*/,
                                   70 /*maxNumSolutions*/);
      //console.log('Number of solutions: ' + solutions.length);
      // Display each solution.
      // for (var i in solutions) {
          // var solution = solutions[i];

          // console.log('- Solution found in ' + solution.steps + ' steps!');
          // for (var i = 0; i < solution.path.length; i++) {
          //     console.log((i + 1) + '. ' + solution.path[i]);
          // }
      // }

      // Persistent variables: name and location
      var location = getLocation();
      var leadName = getLeadName();
      var supportingName = getSupportingName();

      // Pick a solution at random and transform it into a coherent story
      var randomIndex = getRandomInt(solutions.length);
      let selectedPlan = solutions[randomIndex];
      let sentences = constructSentences(selectedPlan.path, leadName, 
                                         supportingName, location);
      let story = assembleStory(sentences, leadName, location);
      //console.log(story);
      res.send({
        success: true,
        story: story
      });
  }, true /* isCode */);
})

/*
 * Choose a character name/location from the preset options at random
 */
function getLeadName() {
 let names = ["Momo", "Chi", "Toru", "Maru", "Mabel"];
 let index = getRandomInt(names.length);
 return names[index];
}

function getSupportingName() {
 let names = ["Mittens", "Moo", "Yori, Kumo"];
 let index = getRandomInt(names.length);
 return names[index];
}

function getLocation() {
  var places = ["the hilly city of San Francisco", "the vibrant city of Tokyo",
    "the Eiffel Tower of Paris", "a cottage by the ocean",
    "a university campus"];
  var index = getRandomInt(places.length);
  return places[index];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/*
 * Transform STRIPS planner output into grammatically-correct sentences by
 * applying templates. No periods yet.
 */
function constructSentences(solution, leadName, supportingName, location) {
  let sentences = [];
  for (let i = 0; i < solution.length; i++) {
    let sentence = applyTemplate(solution[i]);
    sentences.push(sentence);
  }
  sentences = stylizeSentences(sentences, leadName, supportingName, location);
  return sentences;
}

function stylizeSentences(sentences, leadName, supportingName, location) {
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

    if (Math.random() > 0.5 && i != 0) {
      // At random, add a transition word
      // TODO: allow for variant transition words
      sentences[i] = "Then, " + sentence.toLowerCase();
    }
    else if (Math.random() > 0.3 && i != 0) {
      // At random, replace proper nouns with pronouns/names
      // TODO: expand
      if (sentence.indexOf("The tabby") != -1) {
        sentences[i] = sentences[i].replace("The tabby", leadName);
      }
      if (sentence.indexOf("the tabby") != -1) {
        sentences[i] = sentences[i].replace("the tabby", leadName);
      }
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

function assembleStory(sentences, leadName, location) {
 let preamble = "There once lived a small tabby cat named " + leadName +
 " who lived in " + location + ". This is the story of her rather ordinary life. ";

 let storySentences = [];
 storySentences.push(preamble);
 for (let i = 0; i < sentences.length; i++) {
   storySentences.push(sentences[i] + ".");
 }

 let ending = "The end."
 storySentences.push(ending);
 return storySentences;
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
