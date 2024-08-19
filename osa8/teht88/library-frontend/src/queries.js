import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query allBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      title
      published
      author {
        name
        born
        bookCount
      }
      genres
    }
  }
`;

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      title
      published
      author {
        name
        born
        bookCount
      }
      genres
    }
  }
`;
export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const ME = gql`
  query {
    me {
    favoriteGenre
    }
  }
`

export const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    name
    born
    bookCount
  }
`

export const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {
      ...AuthorDetails
    }
    genres
  }
  ${AUTHOR_DETAILS}
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`