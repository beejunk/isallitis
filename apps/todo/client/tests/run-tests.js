async function runTests() {
  mocha.setup("bdd");
  mocha.checkLeaks();

  await import("./suites/models.js");

  mocha.run();
}

runTests();
