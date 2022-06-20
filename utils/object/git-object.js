import fs from "fs"

export class GitObject {
    constructor(repo, data) {
        this.repo = repo;
        if (data) this.deserialize(data)
    }

    serialize() { }

    deserialize(data) { }
}

export class GitBlob extends GitObject {
    fmt = "blob";
    constructor(repo, data) {
        super(repo, data);
        this.blobData = data;
    }

    serialize() {
        return this.blobData
    }
    
    deserialize(data) {
        this.blobData = data;
    }
}

export class GitCommit extends GitObject {
    fmt = "commit";
    constructor(repo, data) {
        super(repo, data);
    }
}

export class GitTag extends GitObject {
    fmt = "tag";
    constructor(repo, data) {
        super(repo, data);
    }
}

export class GitTree extends GitObject {
    fmt = "tree";
    constructor(repo, data) {
        super(repo, data);
    }
}