import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        backgroundColor: "white",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      {/* Items per page à gauche */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginLeft: "auto",
        }}
      >
        <button
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid #ccc",
            backgroundColor: currentPage === 1 ? "#f0f0f0" : "white",
            color: currentPage === 1 ? "#ccc" : "black",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "background-color 0.3s, color 0.3s",
          }}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;

          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <button
                key={page}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                  backgroundColor: currentPage === page ? "#007bff" : "white",
                  color: currentPage === page ? "white" : "black",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "background-color 0.3s, color 0.3s",
                }}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            );
          }
          return null;
        })}

        <button
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid #ccc",
            backgroundColor: currentPage === totalPages ? "#f0f0f0" : "white",
            color: currentPage === totalPages ? "#ccc" : "black",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "background-color 0.3s, color 0.3s",
          }}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
