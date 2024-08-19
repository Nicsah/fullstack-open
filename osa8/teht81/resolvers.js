const { GraphQLError } = require("graphql");
const Author = require("./models/Author");
const Book = require("./models/Book");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => Author.find({}).populate("books"),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        const populatedBooks = await Book.find({}).populate("author");
        return populatedBooks;
      }

      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author }).populate(
          "author"
        );
        return Book.find({
          author: author,
          genres: { $in: [args.genre] },
        });
      }

      if (args.author && !args.genre) {
        const author = await Author.findOne({ name: args.author }).populate(
          "author"
        );
        return Book.find({ author: author });
      }

      if (!args.author && args.genre)
        return Book.find({ genres: { $in: [args.genre] } }).populate("author");
    },
    me: (root, args, context) => context.currentUser,
  },
  Author: {
    bookCount: (root) => root.books.length,
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        if (await Book.findOne({ title: args.title })) {
          throw new GraphQLError("book already exists", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.title,
            },
          });
        }

        let author = await Author.findOne({ name: args.author });
        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          author: author._id,
          genres: args.genres,
        });

        await book.save();

        author.books = author.books.concat(book._id);
        await author.save();
        const populatedBook = await book.populate("author");
        pubsub.publish("BOOK_ADDED", { bookAdded: populatedBook });
        return populatedBook;
      } catch (error) {
        throw new GraphQLError("Adding a book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
    },

    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        throw new GraphQLError("Author not found", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }
      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError("Saving birthday failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
      return author;
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
