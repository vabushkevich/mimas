import React from "react";
import { Link } from "react-router-dom";

import { Card, Container, Page, UserContent } from "@components";
import RightIcon from "@assets/svg/arrow-right.svg";
import "./NotFoundPage.scss";

export function NotFoundPage() {
  return (
    <Page title="Page not found">
      <Container>
        <Card>
          <UserContent>
            <div className="not-found-page__body">
              <div className="not-found-page__message">Page not found</div>
              <Link to="/">
                Go back to the home page
                <RightIcon className="not-found-page__link-icon" />
              </Link>
            </div>
          </UserContent>
        </Card>
      </Container>
    </Page>
  );
}
