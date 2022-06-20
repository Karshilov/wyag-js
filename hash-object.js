//@ts-check

import { objectWrite } from "./utils/object/fn.js";
import { GitBlob, GitCommit, GitTag, GitTree } from "./utils/object/git-object.js";
import { GitRepository } from "./utils/repo/git-repository.js";
import fs from "fs"

export const commandHashObject = (type, actuallyWrite, file) => {
    let repo = null;
    if (actuallyWrite)
        repo = new GitRepository(".")

    const sha = objectHash(fs.readFileSync(file), type, repo)
    console.log(sha)
}

const objectHash = (data, fmt, repo) => {
    switch (fmt) {
        case 'blob':
            return objectWrite(new GitBlob(repo, data), repo);
        case 'commit':
            return objectWrite(new GitCommit(repo, data), repo);
        case 'tag':
            return objectWrite(new GitTag(repo, data), repo);
        case 'tree':
            return objectWrite(new GitTree(repo, data), repo);
        default:
            throw new Error(`Unknown type ${fmt}`);
    }
}