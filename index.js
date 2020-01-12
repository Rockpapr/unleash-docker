"use strict";

const unleash = require("unleash-server");
const basicAuth = require("./basic-auth-hook");

/** unleash options from: https://unleash.github.io/docs/getting_started.html#2-or-programmatically
 * Other options not available due to not being possible to inject through env
 * @param databaseUrl - the postgres database url to connect to. Should include username/password. This value may also be set via the DATABASE_URL environment variable. Alternatively, if you would like to read the database url from a file, you may set the DATABASE_URL_FILE environment variable with the full file path. The contents of the file must be the database url exactly.
databaseSchema - the postgres database schema to use. Defaults to 'public'.
 * @param port - which port the unleash-server should bind to. If port is omitted or is 0, the operating system will assign an arbitrary unused port. Will be ignored if pipe is specified. This value may also be set via the HTTP_PORT environment variable
 * @param host - which host the unleash-server should bind to. If host is omitted, the server will accept connections on the unspecified IPv6 address (::) when IPv6 is available, or the unspecified IPv4 address (0.0.0.0) otherwise. This value may also be set via the HTTP_HOST environment variable
 * @param pipe - parameter to identify IPC endpoints. See https://nodejs.org/api/net.html#net_identifying_paths_for_ipc_connections for more details
 * @param enableLegacyRoutes (boolean) - allows you to turn on/off support for legacy routes to support older clients. Enabled by default.
 * @param serverMetrics (boolean) - use this option to turn on/off prometheus metrics.
 * @param secret (string) - set this when you want to secure unleash. Used to encrypt the user session.
   * @enum none - will disable authentication altogether
   * @enum unsecure - (default) will use simple cookie based authentication. UI will require the user to specify an email in order to use unleash.
   * @enum custom - use this when you implement your own custom authentication logic.
* @param ui (object) - Set of UI specific overrides. You may set the following keys: headerBackground, environment, slogan.
* @param baseUriPath (string) - use to register a base path for all routes on the application. For example my/unleash/base. Defaults to /.
 */

unleash.start({
  databaseUrl: process.env.DATABASE_URL,
  port: parseInt(process.env.PORT || "4242", 10),
  host: process.env.HOST,
  pipe: process.env.PIPE,
  enableLegacyRoutes:
    process.env.ENABLE_LEGACY_ROUTES === "false" ? false : true,
  serverMetrics: process.env.SERVER_METRICS === "false" ? false : true,
  secret: process.env.SECRET,
  adminAuthentication: "custom",
  preRouterHook: basicAuth(process.env.USERNAME, process.env.PASSWORD),
  ui: {
    headerBackground: process.env.UI_HEADER_BACKGROUND,
    environment: process.env.UI_ENVIRONMENT,
    slogan: process.env.UI_SLOGAN
  },
  baseUriPath: process.env.BASE_URI_PATH
});
