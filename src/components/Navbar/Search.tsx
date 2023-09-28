import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSearchParams } from "@hooks";

import MagnifierIcon from "@assets/svg/magnifier.svg";
import "./Search.scss";

type SearchProps = {
  autoFocus?: boolean;
};

export function Search({ autoFocus }: SearchProps) {
  const [{ q: queryParam = "" }] = useSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(queryParam);
  const { push } = useHistory();

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  return (
    <form
      className="search"
      onSubmit={(e) => {
        e.preventDefault();
        const queryTrimmed = query?.trim();
        if (queryTrimmed && queryTrimmed != queryParam) {
          push(`/search?q=${queryTrimmed}`);
        }
      }}
    >
      <MagnifierIcon className="search__input-icon" />
      <input
        autoComplete="off"
        autoFocus={autoFocus}
        className="search__input"
        placeholder="Search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
