const express = require("express");
const router = express.Router();
const strips = require('strips');


// Load the domain and problem.
router.use("/generateStory", (req, res) => {
  console.log("WE HERE!!");
  var domainString = "(define (domain cat-world) \
    (:requirements :strips) \
    (:predicates \
      (CAT ?x) \
      (FOOD ?x) \
      (AWAKE ?x) \
      (ASLEEP ?x) \
      (RESTED ?x) \
      (full-day ?x) \
      (happy ?x) \
      (satiated ?x) \
    ) \
    (:action sleep \
      :parameters (?x) \
      :precondition (and (CAT ?x) (not (RESTED ?x)) (AWAKE ?x) \
        (full-day ?x) (satiated ?x)) \
      :effect (and (ASLEEP ?x) (RESTED ?x) \
                  (not (AWAKE ?x)))) \
    ) \
    (:action wakeup \
      :parameters (?x) \
      :precondition (and (CAT ?x) (ASLEEP ?x)) \
      :effect (and (AWAKE ?x) \
                  (not (ASLEEP ?x)))) \
    ) \
    (:action befriend \
      :parameters (?x ?y) \
      :precondition (and (CAT ?x) (CAT ?y) (AWAKE ?x) (AWAKE ?y)) \
      :effect (and (happy ?x) (happy ?y) (full-day ?x) (full-day ?y)) \
    ) \
    (:action cook \
      :parameters (?x ?y) \
      :precondition (and (CAT ?x) (FOOD ?y) (AWAKE ?x) (not (satiated ?x))) \
      :effect (and (satiated ?x)) \
    )";
  var problemString = "(define (problem cat-problem) \
    (:domain cat-world) \
    (:objects tabby shorthair \
      fried-rice strawberry-shortcake tuna-sandwich \
    ) \
    (:init (CAT tabby) (CAT shorthair) \
      (ASLEEP tabby) (ASLEEP shorthair)\
      (FOOD strawberry-shortcake) (FOOD tuna-sandwich) (FOOD fried-rice)\
    )\
    (:goal (and (ASLEEP tabby) (ASLEEP shorthair) (full-day tabby) (full-day shorthair)))\
  )"
  strips.load(domainString, problemString,
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
      var selectedPlan = solutions[randomIndex];
      var sentences = constructSentences(selectedPlan.path);
      var story = assembleStory(sentences);
      console.log(story);
  }, true /* isCode */);
  res.send({
    success: true,
    story: story
  });
})

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/*
 * Transform STRIPS planner output into grammatically-correct sentences by
 * applying templates.
 */
function constructSentences(solution) {
  let sentences = [];
  for (let i = 0; i < solution.length; i++) {
    let sentence = applyTemplate(solution[i]);
    sentences.push(sentence);
  }
  return sentences;
}

function assembleStory(sentences) {
  let preamble = "There once lived a small tabby cat named Momo. Momo lived in the bustling city of San Francisco."

  let ending = "The end."
  let story = preamble + sentences + ending;
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
    sentence += "The " + tokens[1] + " " + verb + ".";
  }
  else if (tokens.length == 3) {
    // Length 3: subject, verb, direct object
    let verb = applyVerbTense("PRESENT", tokens[0]);
    sentence += "The " + tokens[1] + " " + verb + " the " + tokens[2] + ".";
  }
  return sentence;
}

/*
 * Apply a specified verb tense to a given verb. Currently supported verb tenses
 * are PAST, PRESENT, and FUTURE.
 */
function applyVerbTense(tense, verb) {
  if (tense === "PAST") {
    let output = "" + verb + "ed";
    return output;
  }
  else if (tense === "PRESENT") {
    let output = "" + verb + "s";
    if (verb === "wakeup") {
      output = "wakes up";
    }
    return output;
  }
  else if (tense === "FUTURE") {
    let output = "will " + verb
    return output;
  }
}

module.exports = router;
