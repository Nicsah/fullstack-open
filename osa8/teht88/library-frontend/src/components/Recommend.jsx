/* eslint-disable react/prop-types */
import { useQuery } from "@apollo/client";
import { ME, ALL_BOOKS } from "../queries";

const Recommend = (props) => {
  const resultsMe = useQuery(ME);

  const favoriteGenre = resultsMe.data ? resultsMe.data.me.favoriteGenre : null

  const results = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
  });

  if (!props.show) return null;

  const books = results.data.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{favoriteGenre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              <strong>author</strong>
            </th>
            <th>
              <strong>published</strong>
            </th>
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
    </div>
  );
};

export default Recommend;
