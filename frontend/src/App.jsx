import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card/card.jsx";
import { Button } from "./components/ui/button/button.jsx";
import './index.css';

export default function App() {
  const apiUrl = "http://flask.localhost";
  const [devices, setDevices] = useState([]);

  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const [newStatus, setNewStatus] = useState("offline");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editDevice, setEditDevice] = useState(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [editStatus, setEditStatus] = useState("offline");

  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 3;

  const fetchDevices = () => {
    fetch(`${apiUrl}/devices`)
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((err) => console.error("Errore nel fetch dei devices:", err));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const toggleDevice = (deviceId) => {
    fetch(`${apiUrl}/devices/${deviceId}/toggle`, { method: "POST" })
      .then(() => fetchDevices())
      .catch((err) => console.error("Errore nel togglare il dispositivo:", err));
  };

  const deleteDevice = (deviceId) => {
    fetch(`${apiUrl}/devices/${deviceId}`, { method: "DELETE" })
      .then(() => fetchDevices())
      .catch((err) => console.error("Errore nella cancellazione dispositivo:", err));
  };

  const openEditModal = (device) => {
    setEditDevice(device);
    setEditName(device[1]);
    setEditStatus(device[2]);
    setEditType(device[3]);
    setShowEditModal(true);
  };

  const updateDevice = () => {
    fetch(`${apiUrl}/devices/${editDevice[0]}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        status: editStatus,
        type: editType,
      }),
    })
      .then(() => {
        fetchDevices();
        setShowEditModal(false);
      })
      .catch((err) => console.error("Errore nell'aggiornamento dispositivo:", err));
  };

  const createDevice = () => {
    fetch(`${apiUrl}/devices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, status: newStatus, type: newType }),
    })
      .then(() => {
        fetchDevices();
        setNewName("");
        setNewType("");
        setNewStatus("offline");
        setShowCreateModal(false);
      })
      .catch((err) => console.error("Errore nella creazione dispositivo:", err));
  };

  const indexOfLastDevice = currentPage * devicesPerPage;
  const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
  const currentDevices = devices.slice(indexOfFirstDevice, indexOfLastDevice);
  const totalPages = Math.ceil(devices.length / devicesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Lista Devices (Pagina {currentPage})</h1>

      <div className="mb-4">
        <Button onClick={() => setShowCreateModal(true)}>➕ Aggiungi Dispositivo</Button>
      </div>
<br />
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Crea Nuovo Dispositivo</h2>
            <input type="text" placeholder="Nome" value={newName} onChange={(e) => setNewName(e.target.value)} required className="block mb-2" />
            <input type="text" placeholder="Tipo" value={newType} onChange={(e) => setNewType(e.target.value)} className="block mb-2" />
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="block mb-2">
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
            <div className="space-x-2 mt-4">
              <br />
              <Button onClick={createDevice}>✅ Crea</Button>
              <span className="spacer-horizontal"></span>
              <Button onClick={() => setShowCreateModal(false)}>❌ Annulla</Button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Modifica Dispositivo</h2>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="block mb-2" />
            <input type="text" value={editType} onChange={(e) => setEditType(e.target.value)} className="block mb-2" />
            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="block mb-2">
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
            <div className="space-x-2 mt-4">
              <br />
              <Button onClick={updateDevice} className="bg-green-500 text-white">💾 Salva</Button>
              <span className="spacer-horizontal"></span>
              <Button onClick={() => setShowEditModal(false)} className="bg-red-500 text-white">❌ Annulla</Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {currentDevices.length === 0 ? (
          <p>Nessun dispositivo trovato.</p>
        ) : (
          currentDevices.map((device, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <p><strong>Nome:</strong> {device[1]}</p>
                <p><strong>Stato:</strong> {device[2]}</p>
                <p><strong>Tipo:</strong> {device[3]}</p>
                <div className="flex space-x-2 mt-2">
                  <Button onClick={() => toggleDevice(device[0])}>🔄 Cambia Stato</Button>
                  <span className="spacer-horizontal"></span>
                  <Button onClick={() => deleteDevice(device[0])} className="btn-delete">🗑️ Elimina</Button>
                  <span className="spacer-horizontal"></span>
                  <Button onClick={() => openEditModal(device)} className="bg-yellow-500 text-white">✏️ Modifica</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex space-x-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            disabled={currentPage === i + 1}
          >
            {i + 1}
          </Button>
        ))}
        <span className="spacer-horizontal"></span>
      </div>
<br />
      <div className="mt-4">
        <Button onClick={fetchDevices}>🔁 Ricarica Lista</Button>
      </div>
    </div>
  );
}
