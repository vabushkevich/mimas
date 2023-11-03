import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSearchParams } from "@hooks";

import MagnifierIcon from "@assets/svg/magnifier.svg";
import CrossIcon from "@assets/svg/cross.svg";
import "./Search.scss";

type SearchProps = {
  autoFocus?: boolean;
};

export function Search({ autoFocus }: SearchProps) {
  const [{ q: queryParam = "" }] = useSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(queryParam);
  const inputRef = useRef<HTMLInputElement>(null);
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
        inputRef.current?.blur();
      }}
    >
      <MagnifierIcon className="search__input-icon search__magnifier-icon" />
      <input
        autoComplete="off"
        autoFocus={autoFocus}
        className="search__input"
        placeholder="Search"
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          className="search__clear-button"
          type="button"
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
        >
          <CrossIcon className="search__input-icon" />
        </button>
      )}
    </form>
  );
}
