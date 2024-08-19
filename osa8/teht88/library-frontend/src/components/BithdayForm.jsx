/* eslint-disable react/prop-types */
import { useState } from "react";
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";
import { useMutation } from "@apollo/client";
import Select from "react-select";

const BirthdayForm = ({ authors }) => {
  const [name, setName] = useState(null);
  const [date, setDate] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!authors) {
    return <div>loading...</div>;
  }

  const submit = (event) => {
    event.preventDefault();
    editAuthor({ variables: { name: name.value, setBornTo: date } });

    setDate("");
  };

  const authorNames = authors.map((a) => ({ value: a.name, label: a.name }));

  return (
    <>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <Select
            defaultValue={name}
            onChange={setName}
            options={authorNames}
          />
        </div>
        born
        <input
          type="number"
          value={date}
          onChange={({ target }) => setDate(Number(target.value))}
        />
        <button type="submit">update author</button>
      </form>
    </>
  );
};
export default BirthdayForm;
