//@ts-check
import { GitRepository } from "../repo/git-repository.js"
import zlib from "zlib";
import crypto from "crypto"
import { repoFile } from "../repo/fn.js";
import fs from "fs"
import { GitBlob, GitCommit, GitTag, GitTree } from "./git-object.js";

/**
 * 
 * @param {TemplateStringsArray} str 
 * @returns {Buffer}
 */
 const b = (str) => {
  return Buffer.from(str.join(''), 'utf-8')
}

const HEAD_MARK = b` `[0];

const SIZE_MARK = b`\x00`[0];

/**
 * 
 * @param {GitRepository} repo 
 * @param {string} sha 
 * @returns 
 */
export const objectRead = (repo, sha) => {
  const objPath = repoFile(repo, true, "objects", sha.substring(0, 2), sha.substring(2));
  if (!objPath)
    throw new Error(`Object not found: ${sha}`);
  const data = zlib.unzipSync(fs.readFileSync(objPath));
  const x = data.findIndex((cur) => cur === HEAD_MARK);
  const fmt = data.slice(0, x).toString("utf-8");
  const y = data.slice(x).findIndex((cur) => cur === SIZE_MARK);
  const size = parseInt(data.slice(x, y).toString('ascii'));
  if (size !== data.length - y - 1)
    throw new Error(`Malformed object ${sha}: bad length`)
  switch (fmt) {
    case 'blob':
      return new GitBlob(repo, data.slice(y + 1));
    case 'commit':
      return new GitCommit(repo, data.slice(y + 1));
    case 'tag':
      return new GitTag(repo, data.slice(y + 1));
    case 'tree':
      return new GitTree(repo, data.slice(y + 1));
    default:
      throw new Error(`Unknown type ${fmt} for object ${sha}: unknown format`);
  }
}

/**
 * 
 * @param {GitRepository} repo 
 * @param {*} name 
 * @param {string} fmt 
 * @param {boolean} follow 
 */
export const objectFind = (repo, name, fmt, follow = true) => {
  return name;
}

/**
 * 
 * @param {GitBlob | GitCommit | GitTag | GitTree} obj 
 * @param {boolean} actually_write 
 */
export const objectWrite = (obj, actually_write = true) => {
  const data = obj.serialize();
  const result = Buffer.from(obj.fmt + HEAD_MARK + data.length.toString() + SIZE_MARK + data, 'utf-8');
  const sha = crypto.createHash('sha1').update(result).digest('hex');
  if (actually_write) {
    const objPath = repoFile(obj.repo, actually_write, "objects", sha.substring(0, 2), sha.substring(2));
    fs.writeFileSync(objPath ?? './error', zlib.gzipSync(result));
  }
  return sha
}