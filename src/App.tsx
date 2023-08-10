import React, { useState } from "react";
import "./App.css";

const App = () => {
  // Initial list of classmates
  const initialClassmates = [
    "Baloun Daniel",
    "Blaška Jan",
    "Faltus Ondřej",
    "Hájek Filip",
    "Háva Štěpán",
    "Homola Radim",
    "Holcman Matěj",
    "Horák David",
    "Chalupa Tomáš",
    "Chovanec Ondřej",
    "Kittler Matyáš",
    "Kolouch Martin",
    "Koukal Karel",
    "Koukal Martin",
    "Louša David",
    "Maška Libor",
    "Mareš Lukáš",
    "Maschita Jan",
    "Mikyska Petr",
    "Novák Petr",
    "Pavlík Matyáš",
    "Peroutka Filip",
    "Petrovský David",
    "Pham Phúc Anh",
    "Průcha Štěpán",
    "Rokos Adam",
    "Sedlák Tomáš",
    "Sysel Vojtěch",
    "Vondra Ondřej",
    "Zimola Jiří",
  ];

  // State to store the ordered list of classmates in the right column
  const [orderedClassmates, setOrderedClassmates] = useState<string[]>(Array.from({ length: 30 }, () => ""));

  // Filter out classmates that are already in the right column
  const classmatesForLeftColumn = initialClassmates.filter((classmate) => !orderedClassmates.includes(classmate));

  const handleDrag = (event: React.DragEvent<HTMLDivElement>, index: number, fromLeftColumn: boolean) => {
    event.dataTransfer.setData("text/plain", JSON.stringify({ index, fromLeftColumn }));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    event.preventDefault();
    const draggedData = JSON.parse(event.dataTransfer.getData("text/plain"));
    const draggedIndex = draggedData.index;
    const fromLeftColumn = draggedData.fromLeftColumn;
    const draggedClassmate = fromLeftColumn ? classmatesForLeftColumn[draggedIndex] : orderedClassmates[draggedIndex];

    if (fromLeftColumn) {
      // Classmate dragged from left to right
      const updatedOrderedClassmates = [...orderedClassmates];
      updatedOrderedClassmates[dropIndex] = draggedClassmate;
      setOrderedClassmates(updatedOrderedClassmates);
    } else {
      // Classmate dragged within the right column
      const updatedOrderedClassmates = [...orderedClassmates];
      updatedOrderedClassmates[draggedIndex] = "";
      updatedOrderedClassmates[dropIndex] = draggedClassmate;
      setOrderedClassmates(updatedOrderedClassmates);
    }
  };

  /////////////////////////////////////////////////////////////////////

  const sendOrderedClassmatesToServer = async () => {
    try {
      const response = await fetch("http://chaloupkaa.ddns.net:5000/saveOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderedClassmates),
      });

      if (response.ok) {
        console.log("Ordered classmates sent to the server successfully");
      } else {
        console.error("Error sending ordered classmates to the server");
      }
    } catch (error) {
      console.error("Error sending ordered classmates:", error);
    }
  };

  return (
    <div className="App">
      <div className="column">
        {classmatesForLeftColumn.map((classmate, index) => (
          <div key={index} className="classmate" draggable onDragStart={(e) => handleDrag(e, index, true)}>
            {classmate}
          </div>
        ))}
      </div>
      <div className="column">
        {Array.from({ length: 30 }, (_, index) => (
          <div key={index} className="number-box" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, index)}>
            <div className="number-label">{index + 1}</div>
            {orderedClassmates[index] && (
              <div className="classmate" draggable onDragStart={(e) => handleDrag(e, index, false)}>
                {orderedClassmates[index]}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="save-button">
        <button onClick={sendOrderedClassmatesToServer}>Save Order to server</button>
      </div>
    </div>
  );
};

export default App;
