"use client";

import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
}

interface PageProps {
  context: Record<string, any>;
}

export default function Page({ context }: PageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Détails</h1>
      <button
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={() => setIsModalOpen(true)}
      >
        Voir Contexte
      </button>

      {context && (
        <Modal
          isOpen={isModalOpen}
          title="Contexte"
          data={context}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

function Modal({ isOpen, onClose, title, data }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="w-96 overflow-hidden rounded-lg bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b bg-gray-800 p-4 text-white">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            className="text-white transition hover:text-gray-400"
            onClick={onClose}
          >
            ✖
          </button>
        </div>
        <div className="p-4">
          <Form data={data} />
        </div>
      </div>
    </div>
  );
}

// 🔹 FORMULAIRE GÉNÉRIQUE
function Form({ data }: { data: Record<string, any> }) {
  return (
    <form className="space-y-2">
      {Object.entries(data || {}).map(([key, value]) => (
        <FormField key={key} label={key} value={value} />
      ))}
    </form>
  );
}

// 🔹 CHAMP DE FORMULAIRE
function FormField({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-col border-b border-gray-300 py-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        className="w-full rounded border px-2 py-1 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value !== undefined ? String(value) : ""}
        readOnly
      />
    </div>
  );
}
