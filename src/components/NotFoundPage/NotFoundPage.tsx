import React from "react";
import { Link } from "react-router-dom";

import { Container } from "../Container/Container";
import { Info } from "../Info/Info";
import { Page } from "../Page/Page";
import RightIcon from "@assets/svg/arrow-right.svg";
import "./NotFoundPage.scss";

export function NotFoundPage() {
  return (
    <Page title="Page not found">
      <Container>
        <Info title="Page not found">
          <Link to="/">
            Go back to the home page
            <RightIcon className="not-found-page__link-icon" />
          </Link>
        </Info>
      </Container>
    </Page>
  );
}
