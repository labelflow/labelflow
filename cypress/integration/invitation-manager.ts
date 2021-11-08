describe("Invitation Manager", () => {
  it("should let the user accept an invite", () => {
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.setCookie("hasUserTriedApp", "true");
    cy.setCookie("consentedCookies", "true");
    cy.task("createWorkspaceAndDatasets").then(({ workspaceSlug }: any) => {
      cy.clearCookie("next-auth.session-token");

      cy.task("inviteUser").then(({ inviteUrl }: any) => {
        cy.task("performLogin", {
          name: "UserNotAlreadyAMember",
          email: "test+1@labelflow.ai",
        }).then((token) => {
          cy.setCookie("next-auth.session-token", token as string);
          cy.visit(inviteUrl);
        });
      });

      cy.get(`button[aria-label="Accept invitation"]`)
        .should("be.visible")
        .click();

      cy.get('[role="alert"]').should("contain", "Invitation accepted");
      cy.location("pathname").should("eq", `/${workspaceSlug}/datasets`);
    });
  });

  it("should let the user decline an invite", () => {
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.setCookie("hasUserTriedApp", "true");
    cy.setCookie("consentedCookies", "true");
    cy.task("createWorkspaceAndDatasets");
    cy.clearCookie("next-auth.session-token");

    cy.task("inviteUser").then(({ inviteUrl }: any) => {
      cy.task("performLogin", {
        name: "UserNotAlreadyAMember",
        email: "test+1@labelflow.ai",
      }).then((token) => {
        cy.setCookie("next-auth.session-token", token as string);
        cy.visit(inviteUrl);
      });
    });

    cy.get(`button[aria-label="Decline invitation"]`)
      .should("be.visible")
      .click();

    cy.get('[role="alert"]').should("contain", "Invitation declined");
    cy.location("pathname").should("eq", `/local/datasets`);
  });

  it("shouldn't let a user accept an invitation that has already been accepted", () => {
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.setCookie("hasUserTriedApp", "true");
    cy.setCookie("consentedCookies", "true");
    cy.task("createWorkspaceAndDatasets").then(() => {
      cy.clearCookie("next-auth.session-token");

      cy.task("inviteUser").then(({ inviteUrl }: any) => {
        cy.task("performLogin", {
          name: "UserNotAlreadyAMember",
          email: "test+1@labelflow.ai",
        }).then((token) => {
          cy.setCookie("next-auth.session-token", token as string);
          cy.visit(inviteUrl);
          cy.get(`button[aria-label="Accept invitation"]`)
            .should("be.visible")
            .click();

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
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.setCookie("hasUserTriedApp", "true");
    cy.setCookie("consentedCookies", "true");
    cy.task("createWorkspaceAndDatasets").then(() => {
      cy.clearCookie("next-auth.session-token");

      cy.task("inviteUser").then(({ inviteUrl }: any) => {
        cy.task("performLogin", {
          name: "UserNotAlreadyAMember",
          email: "test+1@labelflow.ai",
        }).then((token) => {
          cy.setCookie("next-auth.session-token", token as string);
          cy.visit(inviteUrl);
          cy.get(`button[aria-label="Decline invitation"]`)
            .should("be.visible")
            .click();

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
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
      cy.setCookie("hasUserTriedApp", "true");
      cy.setCookie("consentedCookies", "true");
    });
    cy.task("createWorkspaceAndDatasets");
    cy.task("inviteUser").then(({ inviteUrl }: any) => {
      cy.visit(inviteUrl);
    });

    cy.get('[role="dialog"]')
      .should("contain", "This invitation is invalid")
      .should(
        "contain",
        'You are already a member of the workspace "Cypress test workspace". If you wanted to accept it with another account, you need to sign out first.'
      );

    cy.get("button").contains("Continue to Home Page").click();
    cy.location("pathname").should("eq", "/local/datasets");
  });

  it("should open the sign in modal if the user isn't logged in", () => {
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.setCookie("hasUserTriedApp", "true");
    cy.setCookie("consentedCookies", "true");
    cy.task("createWorkspaceAndDatasets").then(() => {
      cy.clearCookie("next-auth.session-token");
      cy.task("inviteUser").then(({ inviteUrl }: any) => {
        cy.visit(inviteUrl);
      });
    });
    cy.contains("Sign in to LabelFlow").should("be.visible");
    // need to click twice to loose the focus
    cy.get(`button[aria-label="Close"]`).click();
    cy.get(`button[aria-label="Close"]`).click();

    cy.contains("You need to sign in to continue").should("be.visible");
    cy.get("button").contains("Sign In").click();
    cy.contains("Sign in to LabelFlow").should("be.visible");
    cy.get(`button[aria-label="Close"]`).click();

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
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
      cy.setCookie("hasUserTriedApp", "true");
      cy.setCookie("consentedCookies", "true");
    });
    cy.task("createWorkspaceAndDatasets");
    cy.visit("/test-dataset-cypress/accept-invite?membershipId=fakeId");

    cy.get('[role="dialog"]')
      .should("contain", "This invitation is invalid")
      .should(
        "contain",
        "Couldn't retrieve this invitation. It may have been revoked by the Workspace Administrator."
      );

    cy.get("button").contains("Continue to Home Page").click();
    cy.location("pathname").should("eq", "/local/datasets");
  });
});
