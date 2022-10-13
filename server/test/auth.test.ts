import { describe, expect, test, afterEach } from "@jest/globals";
import { trpcClient, trpcClientBasicAuth, TrpcClientAuthenticated, prisma } from "./_utils";

describe("Auth: User", function () {
  const userIds: string[] = [];

  test("signUp (create user)", async function () {
    const email = "test1@gmail.com";
    const password = "123456";
    const res = await trpcClient.mutation("auth.signUp", { email, password });
    userIds.push(res.id);
    expect(res.email).toBe(email);
    expect(password !== res.password_hash).toBe(true);
  });

  test("User login", async function () {
    const email = "test20@gmail.com";
    const password = "123456";
    const res = await trpcClient.mutation("auth.signUp", { email, password });
    userIds.push(res.id);
    await trpcClientBasicAuth(email, password).query("auth.login");
  });

  test("User verify cookie", async function () {
    const trpcClient = new TrpcClientAuthenticated();
    await trpcClient.init();
    await trpcClient.client.query("auth.validate");
    await trpcClient.delete();
  });

  afterEach(async () => {
    await Promise.all(userIds.map((id) => prisma.user.delete({ where: { id } })));
    userIds.length = 0;
  });
});

describe("Auth: Admin", function () {
  test("Admin login", async function () {
    await trpcClientBasicAuth("admin", "admin").query("auth.login");
  });

  test("Admin verify cookie", async function () {
    const trpcClient = new TrpcClientAuthenticated({ admin: true });
    await trpcClient.init();
    await trpcClient.client.query("auth.validate");
  });
});
