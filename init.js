import { repoCreate } from "./utils/repo/fn.js";

export function initRepository(path) {
  repoCreate(path ?? './')
}