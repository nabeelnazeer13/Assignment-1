//Tests for truncateDescription function

const { truncateDescription } = require("../truncateDescription");  

test("should truncate long descriptions", () => {
  const result = truncateDescription(
    "This is a very long description that will be truncated",
    30
  );
  expect(result).toBe("This is a very long description...");
});

test("should not truncate short descriptions", () => {
  const result = truncateDescription("Short text", 50);
  expect(result).toBe("Short text");
});

