import React from "react";

import { Card } from "../Card/Card";
import { UserContent } from "../UserContent/UserContent";
import "./Info.scss";

type InfoProps = {
  title?: React.ReactNode;
  children: React.ReactNode;
};

export function Info({ title, children }: InfoProps) {
  return (
    <Card>
      <UserContent>
        <div className="info__body">
          {title && <div className="info__title">{title}</div>}
          <div className="info__message">{children}</div>
        </div>
      </UserContent>
    </Card>
  );
}
