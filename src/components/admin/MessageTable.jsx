import React from "react";
import { TrashFill } from "react-bootstrap-icons";

const truncateText = (text, length = 60) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

export default function MessageTable({ data, onDelete }) {
  return (
    <table className="admin-custom-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Sujet</th>
          <th>Message</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="5" className="admin-table-empty">
              Aucun message
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.subject}</td>
              <td>{truncateText(item.message)}</td>
              <td>
                <button
                  className="admin-action-btn admin-action-btn--delete"
                  onClick={() => onDelete(item.id)}
                >
                  <TrashFill size={13} />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
