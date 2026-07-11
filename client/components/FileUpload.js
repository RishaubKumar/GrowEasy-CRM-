"use client";

import { useRef, useState } from "react";

export default function FileUpload({ onFileSelected }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(files) {
    const file = files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a .csv file");
      return;
    }
    onFileSelected(file);
  }

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files);
      }}
      className={`border-2 border-dashed rounded-md p-10 text-center cursor-pointer ${
        dragging ? "border-primary bg-blue-50" : "border-gray-300 bg-white"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        hidden
        onChange={(e) => handleFile(e.target.files)}
      />
      <p className="text-gray-700 font-medium">
        Drag & drop your CSV here, or click to browse
      </p>
      <p className="text-sm text-gray-500 mt-1">Only .csv files are supported</p>
    </div>
  );
}
