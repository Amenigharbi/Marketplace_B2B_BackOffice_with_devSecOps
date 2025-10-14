describe("Some Tests", () => {
  it("is true", () => {
    expect(true).to.be.true; // yup, fine
  });

  it("is false", () => {
    expect(false).to.be.false; // yup, also fine
  });

  context("some nested tests", () => {
    // oops you forgot to write an it(...) here!
    // these cypress commands below
    // are running outside of a test and cypress
    // throws an error
    cy.get("h1").should("contain", "todos");
  });
});
