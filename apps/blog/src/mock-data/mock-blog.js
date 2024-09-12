/** @type {import("../blog/blog.js").Blog} */
export const mockBlog = {
  title: "Test Blog",
  years: {
    2024: {
      year: 2024,
      months: {
        8: {
          month: 8,
          days: {
            18: {
              day: 18,
              entries: {
                "a-test-is-all-it-is": {
                  slug: "a-test-is-all-it-is",
                  title: "A Test Is All It Is",
                  body: "<p>A test is all it is</p>",
                  hour: 18,
                  minute: 20,
                },
              },
            },
            19: {
              day: 19,
              entries: {
                "a-test-is-all-it-is-part-2": {
                  slug: "a-test-is-all-it-is-part-2",
                  title: "A Test Is All It Is pt. 2",
                  body: "<p>A test is all it is pt. 2</p>",
                  hour: 18,
                  minute: 20,
                },
              },
            },
          },
        },
      },
    },
  },
};
