import assert from "assert";

import { oidcProvider } from "./index";

import { app } from "../index";

export async function loginController(req, res, next) {
  try {
    const { uid, prompt, params } = await oidcProvider.interactionDetails(
      req,
      res
    );
    assert.strictEqual(prompt.name, "login");
    const client = await oidcProvider.Client.find(String(params.client_id));
    console.log(req.body);
    const accountId = req.body.email;

    if (!accountId || accountId != "test@t.com") {
      app.render(req, res, "/a");
      return;
    }

    const result = {
      login: { accountId },
    };

    await oidcProvider.interactionFinished(req, res, result, {
      mergeWithLastSubmission: false,
    });
  } catch (err) {
    next(err);
  }
}

export async function interactionConfirmController(req, res, next) {
  try {
    const interactionDetails = await oidcProvider.interactionDetails(req, res);
    const accountId: string = String(interactionDetails.session?.accountId);
    const {
      prompt: { name, details },
      params,
    } = interactionDetails;
    assert.strictEqual(name, "consent");

    let { grantId } = interactionDetails;
    let grant;

    if (grantId) {
      // we'll be modifying existing grant in existing session
      grant = await oidcProvider.Grant.find(grantId);
    } else {
      // we're establishing a new grant
      grant = new oidcProvider.Grant({
        accountId,
        clientId: String(params.client_id),
      });
    }

    if (details.missingOIDCScope) {
      grant?.addOIDCScope(Array(details.missingOIDCScope).join(" "));
      // use grant.rejectOIDCScope to reject a subset or the whole thing
    }
    if (details.missingOIDCClaims) {
      grant?.addOIDCClaims(details.missingOIDCClaims as string[]);
      // use grant.rejectOIDCClaims to reject a subset or the whole thing
    }
    if (details.missingResourceScopes) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [indicator, scopes] of Object.entries(
        details.missingResourceScopes as any
      )) {
        grant?.addResourceScope(indicator, Array(scopes).join(" "));
        // use grant.rejectResourceScope to reject a subset or the whole thing
      }
    }

    grantId = await grant?.save();

    const consent: any = {};
    if (!interactionDetails.grantId) {
      // we don't have to pass grantId to consent, we're just modifying existing one
      consent.grantId = grantId;
    }

    const result = { consent };
    await oidcProvider.interactionFinished(req, res, result, {
      mergeWithLastSubmission: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function interactionController(req, res, next) {
  try {
    const details = await oidcProvider.interactionDetails(req, res);

    const { uid, prompt, params } = details;

    const client = await oidcProvider.Client.find("test_app");
    if (prompt.name === "login") {
      return app.render(req, res, "/a");
    }
    return app.render(req, res, "/a");
  } catch (err) {
    return next(err);
  }
}
