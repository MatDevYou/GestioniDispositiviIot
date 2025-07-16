import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card/card.jsx";
import { Button } from "./components/ui/button/button.jsx";

export default function App() {
  const apiUrl = "http://flask.localhost";
  const [devices, setDevices] = useState([]);

  const fetchDevices = () => {
    fetch(`${apiUrl}/devices`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Dati ricevuti dal backend:", data);
        setDevices(data);
      })
      .catch((err) => console.error("Errore nel fetch dei devices:", err));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const toggleDevice = (deviceId) => {
    fetch(`${apiUrl}/devices/${deviceId}/toggle`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Dispositivo aggiornato:", data);
        fetchDevices();  // ricarica la lista
      })
      .catch((err) => console.error("Errore nel togglare il dispositivo:", err));
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Lista Devices</h1>
      {devices.length === 0 ? (
        <p>Nessun dispositivo trovato.</p>
      ) : (
        devices.map((device, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <p><strong>Nome:</strong> {device[1]}</p>
              <p><strong>Stato:</strong> {device[2]}</p>
              <p><strong>Tipo:</strong> {device[3]}</p>
              <Button onClick={() => toggleDevice(device[0])}>Toggle Stato</Button>
            </CardContent>
          </Card>
        ))
      )}
      <Button onClick={fetchDevices}>Ricarica Lista</Button>
    </div>
  );
}
