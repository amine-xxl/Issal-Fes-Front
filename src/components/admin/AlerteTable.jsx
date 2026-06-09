import React from "react";
import { PencilFill, TrashFill } from "react-bootstrap-icons";

const truncateText = (text, length = 60) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

export default function AlerteTable({ data, onEdit, onDelete }) {
  return (
    <table className="admin-custom-table">
      <thead>
        <tr>
          <th>Ligne</th>
          <th>Type</th>
          <th>Message</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="5" className="admin-table-empty">
              Aucune donnée
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={item.id}>
              <td>{item.ligne?.numero || item.ligne_id}</td>
              <td>
                <span
                  className={`admin-badge admin-badge--${
                    item.type === "retard"
                      ? "warning"
                      : item.type === "perturbation"
                      ? "danger"
                      : "info"
                  }`}
                >
                  {item.type}
                </span>
              </td>
              <td>{truncateText(item.message)}</td>
              <td>
                <span
                  className={`admin-badge admin-badge--${
                    item.statut === "active" ? "success" : "muted"
                  }`}
                >
                  {item.statut}
                </span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="admin-action-btn admin-action-btn--edit"
                    onClick={() => onEdit(item)}
                  >
                    <PencilFill size={13} />
                  </button>
                  <button
                    className="admin-action-btn admin-action-btn--delete"
                    onClick={() => onDelete(item.id)}
                  >
                    <TrashFill size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
