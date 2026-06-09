import React from "react";
import { PencilFill, TrashFill } from "react-bootstrap-icons";

const truncateText = (text, length = 60) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

export default function ActualiteTable({ data, onEdit, onDelete }) {
  return (
    <table className="admin-custom-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Titre</th>
          <th>Contenu</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="4" className="admin-table-empty">
              Aucune donnée
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={item.id}>
              <td>
                {item.image && (
                  <img
                    src={
                      item.image.startsWith("http") // Vérifie si l'URL de l'image est une URL complète
                        ? item.image
                        : `http://127.0.0.1:8000${item.image}`
                    }
                    alt=""
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                )}
              </td>
              <td>{item.titre}</td>
              <td>{truncateText(item.contenu)}</td>
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
