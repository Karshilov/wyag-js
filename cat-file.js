//@ts-check

import { objectFind, objectRead } from "./utils/object/fn.js";
import { GitBlob, GitCommit, GitTag, GitTree } from "./utils/object/git-object.js";
import { repoFind } from "./utils/repo/fn.js";
import { GitRepository } from "./utils/repo/git-repository.js";

export const commandCatFile = (type, object) => {
    const repo = repoFind();
    catFile(repo, object, type);
}

/**
 * 
 * @param {GitRepository} repo 
 * @param {GitBlob | GitCommit | GitTag | GitTree} object 
 * @param {string} fmt 
 */
const catFile = (repo, object, fmt) => {
    const obj = objectRead(repo, objectFind(repo, object, fmt));
    console.log(obj.serialize());
}