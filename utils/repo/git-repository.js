//@ts-check
import path from "path"
import fs from "fs"
import ini from "ini"
import { repoFile } from "./fn.js";

export class GitRepository {
    workTree = '';
    gitDir = '';
    config = {};

    constructor(workPath, force = false) {
        this.workTree = workPath;
        this.gitDir = path.resolve(workPath, ".git");
        if (!((fs.existsSync(this.gitDir) && fs.lstatSync(this.gitDir).isDirectory) || force)) {
            throw new Error(`Not a git repository ${workPath}`);
        }
        const configPath = repoFile(this, false, "config");
        if (configPath && fs.existsSync(configPath)) {
            this.config = ini.parse(fs.readFileSync(configPath, "utf8"));
        } else if (!force) {
            throw new Error("Configuration file missing");
        }

        if (!force) {
            const vers = parseInt(this.config.core.repositoryformatversion);
            if (vers !== 0)
                throw new Error(`Unsupported repositoryformatversion ${vers}`)
        }
    }
}