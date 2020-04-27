import React from "react";
import Button from "../button";

const Table = ({ list, onDismiss }) => (
  <div className="table">
    {list.map((item, idx) => (
      <div key={item.objectID} className="table-row">
        <span>{idx + 1}</span>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span> {item.author}</span>
        <span> {item.num_comments}</span>
        <span> {item.points}</span>
        <span>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Отбросить
          </Button>
        </span>
      </div>
    ))}
  </div>
);

export default Table;
