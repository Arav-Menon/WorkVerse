import {randomUUID} from "crypto";

type OrgRegister = {
    id : string;
    name : string;
    slug: string;
    createAt : Date;
    createdBy : string;
}

export function fakeOrgRegister(overrides: Partial<OrgRegister> = {}) : OrgRegister {
 return {
     id : randomUUID(),
     name : "testing-org",
     slug : "#testing-org",
     createAt : new Date(),
     createdBy : "me",
     ...overrides
 }
}