/* eslint-disable react/prop-types */
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";
const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const resultAll = useQuery(ALL_BOOKS)

  const result = useQuery(ALL_BOOKS, {
    variables: selectedGenre ? { genre: selectedGenre} : null,
  });

  if (!props.show) {
    return null;
  }

  if (result.loading || result.allBooks) return <div>loading...</div>

  const books = result.data.allBooks;

  const genres = ([...new Set(resultAll.data.allBooks.flatMap((b) => b.genres))])

  return (
    <div>
      <h2>books</h2>
      {selectedGenre && (
        <p>
          in genre <strong>{selectedGenre}</strong>
        </p>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex" }}>
        <div>
          <input
            type="radio"
            name="genre"
            id="all"
            onChange={() => setSelectedGenre(null)}
          />
          <label htmlFor="all">all</label>
        </div>
        {genres.map((g) => (
          <div key={g}>
            <input
              type="radio"
              name="genre"
              id={g}
              checked={selectedGenre === g}
              onChange={() => setSelectedGenre(g)}
            />
            <label htmlFor={g}>{g}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
