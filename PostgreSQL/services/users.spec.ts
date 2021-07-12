import Container from "typedi";
import UserService from "./users.service";
import "reflect-metadata";
import { Users } from "../models/user.postgre";
import { User } from "../models/user.model";

const userServiceInstance = Container.get(UserService);
const user: User = {
  age: 23,
  id: "1234",
  login: "praveen",
  password: "123456",
  isDeleted: false,
};

Users.findAll = jest.fn(async () => {
  return [
    {
      age: 23,
      id: "1f97b3a7-789c-4db1-8212-61485a0f55d4",
      login: "kutumba",
      password: "123123123",
      isDeleted: false,
    },
  ];
}) as any;

Users.update = jest.fn() as any;
Users.findByPk = jest.fn() as any;
Users.create = jest.fn() as any;
Users.findOne = jest.fn() as any;

afterEach(() => {
  jest.clearAllMocks();
});

describe("User Service", () => {
  it("should return auto suggested users", async function () {
    await userServiceInstance.getautoSuggestedUsers("", 2);
    expect(Users.findAll).toBeCalledTimes(1);
  });
});

describe("User Service", () => {
  it("should delete user", async function () {
    await userServiceInstance.deleteUser("123");
    expect(Users.update).toBeCalledTimes(1);
  });
});

describe("User Service", () => {
  it("should get user", async function () {
    await userServiceInstance.getUser("123");
    expect(Users.findByPk).toBeCalledTimes(1);
  });
});

describe("User Service", () => {
  it("should update user", async function () {
    await userServiceInstance.updateUser(user);
    expect(Users.update).toBeCalledTimes(1);
  });
});

describe("User Service", () => {
  it("should create user", async function () {
    await userServiceInstance.createUser(user);
    expect(Users.create).toBeCalledTimes(1);
  });
});

describe("User Service", () => {
  it("should find user", async function () {
    await userServiceInstance.findUser("praveen", "123");
    expect(Users.findOne).toBeCalledTimes(1);
  });
});
