import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card/card.jsx";
import { Button } from "./components/ui/button/button.jsx";


export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Lista Utenti</h1>
      {users.length === 0 ? (
        <p>Nessun utente trovato.</p>
      ) : (
        users.map((user, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <p>Nome: {user[1]}</p>
              <p>Email: {user[2]}</p>
            </CardContent>
          </Card>
        ))
      )}
      <Button onClick={() => window.location.reload()}>Ricarica</Button>
    </div>
  );
}
