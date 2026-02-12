import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    avatar: user?.avatar || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form); // Callback pour envoyer les nouvelles données au parent
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier mon profil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={form.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border"
            />
            <Input
              type="text"
              name="avatar"
              placeholder="URL de la photo de profil"
              value={form.avatar}
              onChange={handleChange}
            />
          </div>

          {/* Nom */}
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Nouveau mot de passe (optionnel)</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
