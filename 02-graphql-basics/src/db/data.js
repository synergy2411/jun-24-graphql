let users = [
  { id: "u001", name: "Monica Geller", age: 23 },
  { id: "u002", name: "Rachel Green", age: 22 },
  { id: "u003", name: "Chandler Bing", age: 24 },
];

let posts = [
  {
    id: "p001",
    title: "GraphQL 101",
    body: "Awesome book",
    published: false,
    author: "u003",
  },
  {
    id: "p002",
    title: "Beginning React",
    body: "Great Library",
    published: true,
    author: "u002",
  },
  {
    id: "p003",
    title: "Advanced Angular",
    body: "Super-heroic framework",
    published: false,
    author: "u001",
  },
  {
    id: "p004",
    title: "Mastering NodeJS",
    body: "For advanced users",
    published: true,
    author: "u002",
  },
];

let comments = [
  { id: "c001", text: "I like it", postId: "p004", creator: "u001" },
  { id: "c002", text: "Luv it", postId: "p003", creator: "u003" },
  { id: "c003", text: "Nice books", postId: "p002", creator: "u001" },
  { id: "c004", text: "How i read it", postId: "p003", creator: "u002" },
];

let db = { users, posts, comments };

export default db;
