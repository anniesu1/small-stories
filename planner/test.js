var strips = require('strips');

// Load the domain and problem.
strips.load('./dinner_domain.txt', './dinner_problem.txt',
            function(domain, problem) {
    // Run the problem against the domain.
    // var propValue;
    // for(var propName in domain) {
    //   propValue = domain[propName];
    //   console.log(propName, propValue);
    // }
    var solutions = strips.solve(domain, problem);

    // Display each solution.
    for (var i in solutions) {
        var solution = solutions[i];

        console.log('- Solution found in ' + solution.steps + ' steps!');
        for (var i = 0; i < solution.path.length; i++) {
            console.log((i + 1) + '. ' + solution.path[i]);
        }
    }
});

strips.load('./story_world_domain.txt', './story_world_problem.txt',
            function(domain, problem) {
    var solutions = strips.solve(domain, problem, false /* isDFS*/,
                                 100 /*maxNumSolutions*/);
    console.log('Number of solutions: ' + solutions.length);
    // Display each solution.
    for (var i in solutions) {
        var solution = solutions[i];

        console.log('- Solution found in ' + solution.steps + ' steps!');
        for (var i = 0; i < solution.path.length; i++) {
            console.log((i + 1) + '. ' + solution.path[i]);
        }
    }
});
