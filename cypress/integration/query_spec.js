describe("queries", () => {
    it("User can make queries successfully", () => {
        //visit homepage
        cy.visit("/")
        //select the city of Gila in arizona in the US with a date
        cy.get("#country-select").select("US")
        cy.get("#region-select").select("Arizona")
        cy.get("#city-select").select("Gila")
        cy.get("#date-select").click().type("2021-03-21")
        //submit the form to get the query
        cy.get("[type='submit']").click()
        //verify date properly parsed
        cy.get("#query-date").then((date) => expect("As of: 2021-03-21").to.equal(date[0].innerHTML))
    })
})