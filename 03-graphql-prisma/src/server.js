import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";

const prisma = new PrismaClient();

const typeDefs = /* GraphQL */ `
  type Query {
    users: [User!]!
  }

  type Mutation {
    signUp(data: SignUpInput): SignUpPayload!
  }

  input SignUpInput {
    name: String!
    email: String!
    password: String!
    age: Int!
    role: Role
  }
  type SignUpPayload {
    name: String!
    email: String!
    age: Int!
    id: ID!
  }

  type User {
    id: ID!
    name: String!
    age: Int!
    email: String!
    password: String!
    role: Role
  }

  enum Role {
    ANALYST
    DEVELOPER
    MANAGER
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      try {
        const allUsers = await prisma.user.findMany();
        return allUsers;
      } catch (err) {
        throw new GraphQLError(err);
      }
    },
  },
  Mutation: {
    signUp: async (parent, args, context, info) => {
      try {
        let { name, age, email, password, role } = args.data;
        role = role || "ANALYST";

        const createdUser = await prisma.user.create({
          data: {
            name,
            age,
            email,
            password,
            role,
          },
        });
        //   const { name, age, email, id} = createdUser;
        return {
          name: createdUser.name,
          age: createdUser.age,
          email: createdUser.email,
          id: createdUser.id,
        };
      } catch (err) {
        throw new GraphQLError(err);
      }
    },
  },
};

async function main() {
  const schema = createSchema({
    typeDefs,
    resolvers,
  });

  const yoga = createYoga({
    schema,
  });

  const server = createServer(yoga);

  server.listen(4040, () => console.log("Graphql Yoga running on PORT : 4040"));
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
