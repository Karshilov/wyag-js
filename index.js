//@ts-check
import { program, Argument, Option } from "commander";
import { commandCatFile } from "./cat-file.js";
import { commandHashObject } from "./hash-object.js";
import { initRepository } from "./init.js";

const init = program.command('init [path]').description('initialize a new git repository').action((path) => { initRepository(path) });

const add = program.command('add <filepattern>').description('add file(s) to the staging area').action((filepattern) => { });

const commit = program.command('commit <message>').description('record changes to the repository').action((message) => { });

const log = program.command('log').description('show commit logs').action(() => { });

const checkout = program.command('checkout <branch>').description('checkout a branch').action((branch) => { });

const branch = program.command('branch <branch>').description('create a new branch').action((branch) => { });

const merge = program.command('merge <branch>').description('merge two or more branches into a single new branch').action((branch) => { });

const rebase = program.command('rebase <branch>').description('rebase a branch onto another branch').action((branch) => { });

const catFile = program.command('cat-file').description('show the contents of an object')
    .addArgument(new Argument('<type>', 'object type').choices(['blob', 'tree', 'commit', 'tag']))
    .argument('<object>').action((type, object) => { commandCatFile(type, object) });

const hashObject = program.command('hash-object').description('compute the SHA-1 object name of a file')
    .addOption(new Option('-t [type]', 'object type').choices(['blob', 'tree', 'commit', 'tag']).default('blob'))
    .addOption(new Option('-w', 'actually write into the storage'))
    .argument('<file>', 'file path').action((type, actuallyWrite, file) => { 
        commandHashObject(type, actuallyWrite, file)
    });

const revParse = program.command('rev-parse <commit>').description('parse a revision').action((commit) => { });

const status = program.command('status').description('show the working tree status').action(() => { });

const showRef = program.command('show-ref').description('show all references').action(() => { });

const tag = program.command('tag <tag>').description('create a tag').action((tag) => { });

const rm = program.command('rm <file>').description('remove files from the working tree and from the index').action((file) => { });

[init, add,
    commit, log, checkout,
    branch, merge, rebase,
    catFile, hashObject, revParse,
    status, showRef, tag, rm].forEach((cmd) => program.addCommand(cmd));

program.parse();