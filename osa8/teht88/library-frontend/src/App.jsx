import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useSubscription, useApolloClient } from "@apollo/client";
import LoginForm from "./components/LoginForm";
import Recommend from "./components/Recommend";
import { BOOK_ADDED, ALL_BOOKS } from "./queries";

// eslint-disable-next-line react-refresh/only-export-components
export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      console.log(k);
      return seen.has(k) ? false : seen.add(k);
    });
  };
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);

  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (page === "login" && token) {
    setPage("authors");
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      console.log("uusi", data);
      window.alert(`${addedBook.title} added`);
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
      addedBook.genres.forEach((g) => {
        updateCache(
          client.cache,
          { query: ALL_BOOKS, variables: { genre: g } },
          addedBook
        );
      });
    },
  });

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        )}
        {!token && <button onClick={() => setPage("login")}>login</button>}
      </div>

      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      {token && (
        <>
          <NewBook show={page === "add"} />
          <Recommend show={page === "recommend"} />
        </>
      )}
      {!token && <LoginForm setToken={setToken} show={page === "login"} />}
    </div>
  );
};

export default App;
