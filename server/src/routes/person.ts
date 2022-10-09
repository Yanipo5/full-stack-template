import { createRouter } from "./context";
import { prisma } from "../dbClient";

export default createRouter()
  .query("getPeople", {
    async resolve() {
      return prisma.person.findMany();
    }
  })

  .mutation("create", {
    resolve: async function () {
      return prisma.person.create({ data: { name: btoa(Math.random().toString()).substring(10, 15) } });
    }
  })

  .mutation("deleteAll", {
    resolve: async () => {
      return prisma.person.deleteMany();
    }
  });
