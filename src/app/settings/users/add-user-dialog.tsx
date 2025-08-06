"use client";

import { useState } from "react";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/modal";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Role } from "@/app/types/users";
import { useRouter } from "next/navigation";

interface AddUserFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Role;
}

export function AddUserDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AddUserFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: Role.ADMIN,
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsOpen(false);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          role: Role.ADMIN,
        });
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || "Error al crear usuario");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error al crear usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AddUserFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "role" ? (value as Role) : value,
    }));
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>
        <Button>Agregar Usuario</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Agregar Nuevo Usuario</ModalTitle>
        </ModalHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium mb-1"
              >
                Nombre
              </label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) =>
                  handleInputChange("first_name", e.target.value)
                }
                placeholder="Ingrese el nombre"
                required
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium mb-1"
              >
                Apellido
              </label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                placeholder="Ingrese el apellido"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Correo Electrónico
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Ingrese el correo electrónico"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Ingrese la contraseña"
              required
            />
          </div>
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear Usuario"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
