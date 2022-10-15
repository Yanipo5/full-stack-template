import { createRouter } from "./context";
import { prisma } from "../dbClient";

export default createRouter()
  .query("getPeople", {
    meta: { permission: "person.getAll" },
    async resolve() {
      return prisma.person.findMany();
    }
  })

  .mutation("create", {
    meta: { permission: "person.create" },
    resolve: async function () {
      return prisma.person.create({ data: { name: btoa(Math.random().toString()).substring(10, 15) } });
    }
  })

  .mutation("deleteAll", {
    meta: { permission: "person.deleteAll" },
    resolve: async () => {
      return prisma.person.deleteMany();
    }
  });
