describe("My First Test", function() {
  it("Visits the kitchen sink", function() {
    // Arrange app state
    // visit a page
    // query an  element

    cy.visit("https://example.cypress.io/");
    cy.contains("type");

    // https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file
  });
});
