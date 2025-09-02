import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName?: string;
}

/**
 * Sets the current user name in the configuration to "Kevin".
 *
 * Reads the existing configuration, modifies the `currentUserName` property,
 * and writes the updated configuration back.
 *
 * @returns {void}
 */
export const setUser = (name: string): void => {
    const currentConfig: Config = readConfig();
    const modifiedConfig: Config = { ...currentConfig };

    modifiedConfig.currentUserName = name;
    writeConfig(modifiedConfig);
}

/**
 * Reads the application configuration from the config file, validates it,
 * and returns a typed `Config` object.
 *
 * @returns {Config} The validated configuration object containing the database URL and current user name.
 * @throws {Error} If the configuration file cannot be read, parsed, or is invalid.
 */
export const readConfig = (): Config => {
    const config = JSON.parse(fs.readFileSync(getConfigFilePath(), { encoding: "utf-8" }));
    return validateConfig(config);
}

/**
 * Returns the absolute file path to the application's configuration file.
 *
 * The configuration file is expected to be located in the user's home directory,
 * under the path: `~/github.com/blogaggregator/.gatorconfig.json`.
 *
 * @returns {string} The absolute path to the `.gatorconfig.json` configuration file.
 */
const getConfigFilePath = (): string => {
    const homeDir = os.homedir();
    const configPath = path.join(homeDir, 'github.com', 'blogaggregator', '.gatorconfig.json')
    return configPath
}

/**
 * Writes the provided configuration object to the configuration file.
 *
 * Serializes the given `Config` object into JSON format, mapping its properties
 * to the expected keys in the configuration file, and writes it synchronously
 * to the file system at the path returned by `getConfigFilePath()`.
 *
 * @param cfg - The configuration object containing the database URL and current user name.
 */
const writeConfig = (cfg: Config): void => {
    const newConfig = JSON.stringify({
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    });
    fs.writeFileSync(getConfigFilePath(), newConfig)
}

/**
 * Validates the provided configuration object to ensure required properties are present.
 *
 * @param rawConfig - The raw configuration object to validate.
 * @returns The validated configuration object, typed as `Config`.
 * @throws {Error} If the `db_url` property is not provided in the configuration.
 */
const validateConfig = (rawConfig: any): Config => {
    const dbUrl = rawConfig.db_url;
    const currentUserName = rawConfig.current_user_name;

    if (!rawConfig || typeof (rawConfig) !== 'object')
        throw new Error('config file must be of type object');

    if (dbUrl === undefined)
        throw new Error('dbUrl was not provided');

    if (currentUserName !== undefined && currentUserName !== null && typeof (currentUserName) !== 'string')
        throw new Error('current_user_name must be of type string')

    return {
        dbUrl,
        currentUserName: currentUserName ?? undefined
    }
} 