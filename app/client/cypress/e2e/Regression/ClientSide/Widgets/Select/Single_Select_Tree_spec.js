const dsl = require("../../../../../fixtures/TreeSelectDsl.json");
const formWidgetsPage = require("../../../../../locators/FormWidgets.json");
const publish = require("../../../../../locators/publishWidgetspage.json");
const commonlocators = require("../../../../../locators/commonlocators.json");
const widgetsPage = require("../../../../../locators/Widgets.json");

const toggleJSButton = (name) => `.t--property-control-${name} .t--js-toggle`;

describe("Single Select Widget Functionality", function () {
  before(() => {
    cy.addDsl(dsl);
  });

  it("1. Check isDirty meta property", function () {
    cy.openPropertyPane("textwidget");
    cy.updateCodeInput(
      ".t--property-control-text",
      `{{SingleSelectTree1.isDirty}}`,
    );
    // Change defaultText
    cy.openPropertyPane("singleselecttreewidget");
    cy.updateCodeInput(".t--property-control-defaultselectedvalue", "GREEN");
    // Check if isDirty is reset to false
    cy.get(".t--widget-textwidget").should("contain", "false");
    // Interact with UI
    cy.get(formWidgetsPage.treeSelectInput).last().click({ force: true });
    cy.get(formWidgetsPage.treeSelectFilterInput).click().type("light");
    cy.treeSelectDropdown("Light Blue");
    // Check if isDirty is set to true
    cy.get(".t--widget-textwidget").should("contain", "true");
    // Change defaultText
    cy.openPropertyPane("singleselecttreewidget");
    cy.updateCodeInput(".t--property-control-defaultselectedvalue", "RED");
    // Check if isDirty is reset to false
    cy.get(".t--widget-textwidget").should("contain", "false");
  });

  it("2. Selects value with enter in default value", () => {
    cy.openPropertyPane("singleselecttreewidget");
    cy.testJsontext("defaultselectedvalue", "RED\n");
    cy.get(formWidgetsPage.singleselecttreeWidget)
      .find(".rc-tree-select-selection-item")
      .first()
      .should("have.text", "Red");
  });

  it("3. To Validate Options", function () {
    cy.get(formWidgetsPage.treeSelectInput).last().click({ force: true });
    cy.get(formWidgetsPage.treeSelectFilterInput).click().type("light");
    cy.treeSelectDropdown("Light Blue");
  });

  it("4. Clears the search field when widget is closed", () => {
    // Open the widget
    cy.get(formWidgetsPage.treeSelectInput).last().click({ force: true });
    // Search for Green option in the search input
    cy.get(formWidgetsPage.treeSelectFilterInput).click().type("Green");
    // Select the Green Option
    cy.treeSelectDropdown("Green");
    // Assert Green option is selected
    cy.get(formWidgetsPage.singleselecttreeWidget)
      .find(".rc-tree-select-selection-item")
      .first()
      .should("have.text", "Green");
    // Reopen the widget
    cy.get(formWidgetsPage.treeSelectInput).last().click({ force: true });
    // Assert the search input is cleared
    cy.get(formWidgetsPage.treeSelectFilterInput)
      .invoke("val")
      .should("be.empty");
  });

  it("5. To Unchecked Visible Widget", function () {
    cy.togglebarDisable(commonlocators.visibleCheckbox);
    cy.PublishtheApp();
    cy.get(
      publish.singleselecttreewidget + " " + ".rc-tree-select-single",
    ).should("not.exist");
    cy.get(publish.backToEditor).click();
  });

  it("6. To Check Visible Widget", function () {
    cy.openPropertyPane("singleselecttreewidget");
    cy.togglebar(commonlocators.visibleCheckbox);
    cy.PublishtheApp();
    cy.get(
      publish.singleselecttreewidget + " " + ".rc-tree-select-single",
    ).should("be.visible");
    cy.get(publish.backToEditor).click();
  });

  it("7. To Check Option Not Found", function () {
    cy.get(formWidgetsPage.treeSelectInput).last().click({ force: true });
    cy.get(formWidgetsPage.treeSelectFilterInput).click().type("ABCD");
    cy.get(".tree-select-dropdown .rc-tree-select-empty").contains(
      "No Results Found",
    );
  });

  it("8. To Check Clear all functionality", function () {
    cy.openPropertyPane("textwidget");
    cy.updateCodeInput(
      ".t--property-control-text",
      `{{SingleSelectTree1.selectedOptionValue}}`,
    );
    cy.openPropertyPane("singleselecttreewidget");
    cy.togglebar(
      '.t--property-control-allowclearingvalue input[type="checkbox"]',
    );
    cy.get(formWidgetsPage.treeSelectClearAll).last().click({ force: true });
    cy.wait(100);
    cy.get(".t--widget-textwidget").should("contain", "");
    cy.get(formWidgetsPage.treeSelectClearAll).should("not.exist");
    cy.get(formWidgetsPage.treeSelectPlaceholder).should(
      "contain",
      "select option",
    );
  });

  it("9. Select tooltip renders if tooltip prop is not empty", () => {
    cy.openPropertyPane("singleselecttreewidget");
    // enter tooltip in property pan
    cy.get(widgetsPage.inputTooltipControl).type("Helpful text for tooltip !");
    // tooltip help icon shows
    cy.get(".tree-select-tooltip").should("be.visible");
  });

  it("10. To Validate onOptionChange Event gets triggered only when option is changed", () => {
    cy.openPropertyPane("singleselecttreewidget");
    // Click onOptionChange Event from propertypane
    cy.get(toggleJSButton("onoptionchange")).click({ force: true });
    // Add a message to alert event in onOptionChange
    cy.testJsontext("onoptionchange", `{{showAlert('Option Changed')}}`);
    // Open the widget
    cy.get(formWidgetsPage.treeSelectInput).last().click({ force: true });
    // Search for Green option in the search input
    cy.get(formWidgetsPage.treeSelectFilterInput).click().type("Green");
    // Select the Green Option
    cy.treeSelectDropdown("Green");
    // Validate if toast message exists or not
    cy.get(".Toastify__toast-body").should("exist");
    // Validate the toast message
    cy.validateToastMessage("Option Changed");
    // Open the widget
    cy.get(formWidgetsPage.treeSelectInput).last().click({ force: true });
    // Search for Green option (selecting same option) in the search input
    cy.get(formWidgetsPage.treeSelectFilterInput).click().type("Green");
    // Select the Green Option
    cy.treeSelectDropdown("Green");
    cy.wait(400);
    // Validate if toast message exists or not
    cy.get(".Toastify__toast-body").should("not.exist");
  });
});
afterEach(() => {
  // put your clean up code if any
});
