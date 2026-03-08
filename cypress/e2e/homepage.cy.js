describe("Hacker Escape Rooms startsida", () => {

  it("kontrollerar att sidan är uppe och har en h1", () => {

    cy.visit("/")

    cy.url().should("include", "localhost")

    cy.get("h1").should("exist")

  })

})