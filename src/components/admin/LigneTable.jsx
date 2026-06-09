import React from "react";
import { PencilFill, TrashFill } from "react-bootstrap-icons";

const truncateText = (text, length = 60) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

export default function LigneTable({ data, onEdit, onDelete }) {
  return (
    <table className="admin-custom-table">
      <thead>
        <tr>
          <th>Numéro</th>
          <th>Départ</th>
          <th>Arrivée</th>
          <th>Prix</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="6" className="admin-table-empty">
              Aucune donnée
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={item.id}>
              <td>{item.numero}</td>
              <td>{item.depart}</td>
              <td>{item.arrivee}</td>
              <td>{item.prix} MAD</td>
              <td>{truncateText(item.description)}</td>
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
