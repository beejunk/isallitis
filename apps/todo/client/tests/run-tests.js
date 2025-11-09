async function runTests() {
  mocha.setup("bdd");
  mocha.checkLeaks();

  await import("./suites/db.js");

  mocha.run();
}

runTests();
