async function runTests() {
  mocha.setup("bdd");
  mocha.checkLeaks();

  await import("./suites/button.test.js");
  await import("./suites/dialog.test.js");
  await import("./suites/card.test.js");
  await import("./suites/text-input.test.js");

  mocha.run();
}

runTests();
