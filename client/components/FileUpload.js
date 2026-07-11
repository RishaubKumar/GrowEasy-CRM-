"use client";

import { useRef, useState } from "react";

export default function FileUpload({ onFileSelected, darkMode }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(files) {
    const file = files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a .csv file!");
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
      className={`border border-solid p-12 text-center cursor-pointer font-mono transition-all rounded-lg ${
        dragging
          ? (darkMode ? "border-white bg-zinc-800" : "border-black bg-gray-200")
          : (darkMode ? "border-zinc-500 bg-zinc-800" : "border-gray-400 bg-white")
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        hidden
        onChange={(e) => handleFile(e.target.files)}
      />
      <p className="font-extrabold text-base">
         DRAG AND DROP CSV FILE HERE OR CLICK TO BROWSE 
      </p>
      <p className="text-xs mt-2 opacity-70">
        (Note: Only .csv files are allowed)
      </p>
    </div>
  );
}
