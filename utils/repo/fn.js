import path from "path"
import fs from "fs"
import ini from "ini"
import assert from "assert"
import { GitRepository } from "./git-repository.js"

/**
 * 
 * @param {GitRepository} repo 
 * @param {Array<string>} path 
 * @returns {string}
 */
export const repoPath = (repo, ...paths) => {
    return path.join(repo.gitDir, paths.join("/"))
}

/**
 * 
 * @param {GitRepository} repo 
 * @param {boolean} mkdir 
 * @param  {Array<string>} path 
 * @returns 
 */
export const repoFile = (repo, mkdir, ...paths) => {
    if (repoDir(repo, mkdir, paths.slice(0, -1))) {
        return repoPath(repo, ...paths)
    }
}

/**
 * 
 * @param {GitRepository} repo 
 * @param {boolean} mkdir 
 * @param  {Array<string>} path 
 * @returns 
 */
export const repoDir = (repo, mkdir, ...paths) => {
    const dirPath = repoPath(repo, ...paths)

    if (fs.existsSync(dirPath)) {
        if (fs.lstatSync(dirPath).isDirectory) return dirPath
        else throw new Error("Not a directory %s" % dirPath)
    }

    if (mkdir) {
        fs.mkdirSync(dirPath, { recursive: true })
        return dirPath
    } else return false
}

export const REPO_DEFAULT_CONFIG = ini.stringify({
    core: {
        repositoryformatversion: "0",
        filemode: "false",
        bare: "false",
    }
})

/**
 * 
 * @param {string} path 
 */
export const repoCreate = (path) => {
    const repo = new GitRepository(path, true)
    if (fs.existsSync(repo.workTree)) {
        if (!fs.lstatSync(repo.workTree).isDirectory)
            throw new Error(`${path} is not a directory!`)
        if (fs.readdirSync(repo.workTree).length > 0)
            throw new Error(`${path} is not empty!`)
    }
    else fs.mkdirSync(repo.workTree, { recursive: true })

    assert(repoDir(repo, true, "branches"))
    assert(repoDir(repo, true, "objects"))
    assert(repoDir(repo, true, "refs", "tags"))
    assert(repoDir(repo, true, "refs", "heads"))

    fs.writeFileSync(repoFile(repo, false, "description"),
        "Unnamed repository; edit this file 'description' to name the repository.\n");

    fs.writeFileSync(repoFile(repo, false, "HEAD"),
        "ref: refs/heads/master\n")

    fs.writeFileSync(repoFile(repo, false, "config"),
        REPO_DEFAULT_CONFIG)

    return repo
}

export const repoFind = (currentPath = ".", required = true) => {
    if (fs.lstatSync(path.join(currentPath, ".git")).isDirectory)
        return GitRepository(path)

    const parent = path.join(currentPath, "..")

    if (parent === currentPath) {
        if (required) throw new Error("No git directory.")
        else return null
    }
    return repoFind(parent, required)
}