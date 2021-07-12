import Container from "typedi";
import "reflect-metadata";
import UserGroupService from "./userGroup.service";
import { Group, Groups } from "../models/group.model";

const userGroupServiceInstance = Container.get(UserGroupService);
const group: Group = {
  id: "1234",
  name: "admin",
  permissions: ['READ' , 'WRITE' , 'DELETE' , 'SHARE' , 'UPLOAD_FILES']
};

Groups.destroy = jest.fn() as any;
Groups.findByPk = jest.fn() as any;
Groups.findAll = jest.fn() as any;
Groups.update = jest.fn() as any;
Groups.create = jest.fn() as any;

afterEach(() => {
  jest.clearAllMocks();
});

describe("User Group Service", () => {
  it("should delete group", async function () {
    await userGroupServiceInstance.deleteGroup("123");
    expect(Groups.destroy).toBeCalledTimes(1);
  });
});

describe("User Group Service", () => {
  it("should get group", async function () {
    await userGroupServiceInstance.getGroup("123");
    expect(Groups.findByPk).toBeCalledTimes(1);
  });
});

describe("User Group Service", () => {
  it("should get all groups", async function () {
    await userGroupServiceInstance.getAllGroups();
    expect(Groups.findAll).toBeCalledTimes(1);
  });
});

describe("User Group Service", () => {
  it("should create group", async function () {
    await userGroupServiceInstance.createGroup(group);
    expect(Groups.create).toBeCalledTimes(1);
  });
});

describe("User Group Service", () => {
  it("should update group", async function () {
    await userGroupServiceInstance.updateGroup(group);
    expect(Groups.update).toBeCalledTimes(1);
  });
});
