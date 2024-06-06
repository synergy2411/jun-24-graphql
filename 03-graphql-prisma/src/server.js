import { createSchema, createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { hashSync, compareSync } = bcrypt;
const { sign, verify } = jwt;

const SECRET_KEY = "MY_SUPER_SECRET_KEY";

const prisma = new PrismaClient();

const typeDefs = /* GraphQL */ `
  type Query {
    users: [User!]!
    posts: [Post!]!
  }

  type Mutation {
    signUp(data: SignUpInput): SignUpPayload!
    signIn(data: SignInInput): SignInPayload!
    createPost(data: CreatePostInput!): CreatePostPayload!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean
  }

  type CreatePostPayload {
    id: ID!
    title: String!
    body: String!
    published: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }
  type SignInPayload {
    token: String!
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
    posts: async (parent, args, context, info) => {
      try {
        const allPost = await prisma.post.findMany();
        return allPost;
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

        const hashedPassword = hashSync(password, 12);

        const createdUser = await prisma.user.create({
          data: {
            name,
            age,
            email,
            password: hashedPassword,
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

    signIn: async (parent, args, context, info) => {
      try {
        const { email, password } = args.data;
        const foundUser = await prisma.user.findUnique({ where: { email } });
        if (!foundUser) {
          throw new GraphQLError(
            "Unable to find the user for email - " + email
          );
        }

        const isMatch = compareSync(password, foundUser.password);

        if (!isMatch) {
          throw new GraphQLError("Password does not match. Try again!");
        }

        //   Generate and return the token
        const token = sign({ id: foundUser.id }, SECRET_KEY);
        return { token };
      } catch (err) {
        throw new GraphQLError(err);
      }
    },

    createPost: async (parent, args, { token }, info) => {
      try {
        if (!token) {
          throw new GraphQLError("Please Login First. Auth token required.");
        }
        const { id } = verify(token, SECRET_KEY);

        const { title, body, published } = args.data;

        // const foundUser = await prisma.user.findUnique({
        //   where: { id },
        // });

        // if (!foundUser) {
        //   throw new GraphQLError("Unable to find user for ID - " + authorId);
        // }

        const createdPost = await prisma.post.create({
          data: {
            title,
            body,
            published,
            authorId: id,
          },
        });

        return { ...createdPost };
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
    context: ({ request }) => {
      const authHeader = request.headers.get("authorization");
      let token = null;

      if (authHeader) {
        token = authHeader.split(" ")[1]; // "Bearer tokenValue" => ["Bearer", "tokenValue"]
      }

      return {
        token,
      };
    },
  });

  const server = createServer(yoga);

  server.listen(4040, () => console.log("Graphql Yoga running on PORT : 4040"));
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
