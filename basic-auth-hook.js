"use strict";

/**
 * implementation from
 * https://www.npmjs.com/package/basic-auth
 * https://github.com/Unleash/unleash/blob/master/examples/basic-auth-hook.js
 */

const auth = require("basic-auth");
const compare = require("tsscmp");
const { User } = require("../lib/server-impl.js");

const basicAuthentication = (userName, password) => app => {
  app.use("/api/admin/", (req, res, next) => {
    const credentials = auth(req);

    if (credentials && check(credentials.name, credentials.pass)) {
      // you will need to do some verification of credentials here.
      const user = new User({ email: `${credentials.name}@domain.com` });
      req.user = user;
      next();
    } else {
      return res
        .status("401")
        .set({ "WWW-Authenticate": 'Basic realm="example"' })
        .end("access denied");
    }
  });

  app.use((req, res, next) => {
    // Updates active sessions every hour
    req.session.nowInHours = Math.floor(Date.now() / 3600e3);
    next();
  });

  function check(inputUserName, inputUserPassword) {
    let valid = true;

    valid = compare(inputUserName, userName) && valid;
    valid = compare(inputUserPassword, password) && valid;

    return valid;
  }
};

module.exports = basicAuthentication;
