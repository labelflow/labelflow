import { WORKSPACE_SLUG } from "../fixtures";

describe("Invitation Manager (online)", () => {
  it("should let the user accept an invite", () => {
    // log in as the default user
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.setCookie("consentedCookies", "true");
    cy.task("createWorkspaceAndDatasets").then(() => {
      cy.clearCookie("next-auth.session-token");

      // invite a new user to the workspace
      cy.task("inviteUser").then(({ inviteUrl }: any) => {
        cy.task("performLogin", {
          name: "UserNotAlreadyAMember",
          email: "test+1@labelflow.ai",
        }).then((token) => {
          cy.setCookie("next-auth.session-token", token as string).then(() => {
            // visit the url from the invite mail
            cy.visit(inviteUrl);
          });
        });
      });

      // accept the invite
      cy.get(`button[aria-label="Accept invitation"]`)
        .should("be.visible")
        .click();

      // check for the toast to be present
      cy.get('[role="alert"]').should("contain", "Invitation accepted");
      cy.location("pathname").should("eq", `/${WORKSPACE_SLUG}/datasets`);
    });
  });

  it("should let the user decline an invite", () => {
    // log in as the default user
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.setCookie("consentedCookies", "true");
    cy.task("createWorkspaceAndDatasets");
    cy.clearCookie("next-auth.session-token");

    // invite a new user to the workspace
    cy.task("inviteUser").then(({ inviteUrl }: any) => {
      cy.task("performLogin", {
        name: "UserNotAlreadyAMember",
        email: "test+1@labelflow.ai",
      }).then((token) => {
        cy.setCookie("next-auth.session-token", token as string);
        // visit the url from the invite mail
        cy.visit(inviteUrl);
      });
    });

    // decline the invite
    cy.get(`button[aria-label="Decline invitation"]`)
      .should("be.visible")
      .click();

    // check for the toast to be present
    cy.get('[role="alert"]').should("contain", "Invitation declined");
    cy.location("pathname").should("eq", `/`);
  });

  it("shouldn't let a user accept an invitation that has already been accepted", () => {
    // log in as the default user
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.setCookie("consentedCookies", "true");
    cy.task("createWorkspaceAndDatasets").then(() => {
      cy.clearCookie("next-auth.session-token");

      // invite a new user to the workspace
      cy.task("inviteUser").then(({ inviteUrl }: any) => {
        cy.task("performLogin", {
          name: "UserNotAlreadyAMember",
          email: "test+1@labelflow.ai",
        }).then((token) => {
          cy.setCookie("next-auth.session-token", token as string);
          cy.visit(inviteUrl);
          // accept the invitation
          cy.get(`button[aria-label="Accept invitation"]`)
            .should("be.visible")
            .click();

          // log in as another user
          cy.clearCookie("next-auth.session-token");
          cy.task("performLogin", {
            name: "Another",
            email: "test+2@labelflow.ai",
            // eslint-disable-next-line @typescript-eslint/no-shadow
          }).then((token) => {
            cy.setCookie("next-auth.session-token", token as string);
            cy.visit(inviteUrl);
          });
        });
      });
    });
    cy.get('[role="dialog"]')
      .should("contain", "This invitation is invalid")
      .should(
        "contain",
        "It looks like someone has already accepted this invitation. If it wasn't you, contact your Workspace Administrator."
      );
  });

  it("shouldn't let a user accept an invitation that has already been declined", () => {
    // log in as the default user
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.setCookie("consentedCookies", "true");
    cy.task("createWorkspaceAndDatasets").then(() => {
      cy.clearCookie("next-auth.session-token");
      // invite a new user to the workspace
      cy.task("inviteUser").then(({ inviteUrl }: any) => {
        cy.task("performLogin", {
          name: "UserNotAlreadyAMember",
          email: "test+1@labelflow.ai",
        }).then((token) => {
          cy.setCookie("next-auth.session-token", token as string);
          cy.visit(inviteUrl);
          // decline the invitation
          cy.get(`button[aria-label="Decline invitation"]`)
            .should("be.visible")
            .click();

          // log in as another user
          cy.clearCookie("next-auth.session-token");
          cy.task("performLogin", {
            name: "Another",
            email: "test+2@labelflow.ai",
            // eslint-disable-next-line @typescript-eslint/no-shadow
          }).then((token) => {
            cy.setCookie("next-auth.session-token", token as string);
            cy.visit(inviteUrl);
          });
        });
      });
    });

    cy.get('[role="dialog"]')
      .should("contain", "This invitation is invalid")
      .should(
        "contain",
        "This invitation has already been declined. If it wasn't you, contact your Workspace Administrator."
      );
  });

  it("should tell the user they can't join the workspace if they are already in", () => {
    // log in as the default user
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
      cy.setCookie("consentedCookies", "true");
    });
    cy.task("createWorkspaceAndDatasets");

    // invite a new user to the workspace
    cy.task("inviteUser").then(({ inviteUrl }: any) => {
      // visit the url from the invite mail, but as the default user (already in the workspace)
      cy.visit(inviteUrl);
    });

    cy.get('[role="dialog"]')
      .should("contain", "This invitation is invalid")
      .should(
        "contain",
        'You are already a member of the workspace "Cypress test workspace". If you wanted to accept it with another account, you need to sign out first.'
      );

    cy.get("button").contains("Continue to Home Page").click();
    cy.location("pathname").should("eq", "/");
  });

  it("should redirect to the sign-in page if the user isn't logged in", () => {
    // log in as the default user
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.setCookie("consentedCookies", "true");
    cy.task("createWorkspaceAndDatasets").then(() => {
      // sign out
      cy.clearCookie("next-auth.session-token");
      // invite a new user to the workspace
      cy.task("inviteUser").then(({ inviteUrl }: any) => {
        // visit the url from the invite mail, but without being logged in
        cy.visit(inviteUrl);
      });
    });

    cy.contains("Sign in to LabelFlow").should("be.visible");

    // log in as another user
    cy.task("performLogin", {
      name: "UserNotAlreadyAMember",
      email: "test+1@labelflow.ai",
    }).then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.reload();

    cy.get(`button[aria-label="Accept invitation"]`).should("be.visible");
  });

  it("should tell the user they can't join the workspace if the invite doesn't exist", () => {
    // log in as the default user
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
      cy.setCookie("consentedCookies", "true");
    });
    cy.task("createWorkspaceAndDatasets");

    // visit a invite url with a membership id that doesn't exist
    cy.visit("/test-dataset-cypress/accept-invite?membershipId=fakeId");

    cy.get('[role="dialog"]')
      .should("contain", "This invitation is invalid")
      .should(
        "contain",
        "Couldn't retrieve this invitation. It may have been revoked by the Workspace Administrator."
      );

    cy.get("button").contains("Continue to Home Page").click();
    cy.location("pathname").should("eq", "/");
  });
});
