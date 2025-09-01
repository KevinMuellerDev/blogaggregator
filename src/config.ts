import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName?: string;
}

export const setUser = (): void => {
    const currentConfig = readConfig();
    const modifiedConfig = currentConfig;
    modifiedConfig.currentUserName = "Kevin"
    writeConfig(modifiedConfig);

}

export const readConfig = (): Config => {
    const config = JSON.parse(fs.readFileSync(getConfigFilePath(), { encoding: "utf-8" }));
    validateConfig(config);
    return {
        dbUrl: config.db_url,
        currentUserName: config.current_user_name
    }
}

const getConfigFilePath = (): string => {
    const homeDir = os.homedir();
    const configPath = path.join(homeDir, 'github.com', 'blogaggregator', '.gatorconfig.json')
    return configPath
}

const writeConfig = (cfg: Config): void => {
    const newConfig = JSON.stringify({
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    });
    fs.writeFileSync(getConfigFilePath(), newConfig)
}

const validateConfig = (rawConfig: any): Config => {
    if (rawConfig.db_url === undefined)
        throw new Error('dbUrl was not provided')

    return rawConfig
} 