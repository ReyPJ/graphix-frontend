"use client";
import {
  Box,
  Container,
  Input,
  Stack,
  StackSeparator,
  Text,
  Card,
  Table,
  HStack,
  Heading,
  Badge,
  Kbd,
  ActionBar,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  RadioCardItem,
  RadioCardLabel,
  RadioCardRoot,
} from "@/components/ui/radio-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { UserListInterface } from "../interfaces/UserInterface";
import { api } from "../utils/api";
import { Checkbox } from "@/components/ui/checkbox";
import { FaTrash } from "react-icons/fa";
import Cookies from "js-cookie";

type Package = "basic" | "medium" | "premium";

const AdminPanel = () => {
  const [username, setUsername] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<Package>("basic");
  const [users, setUsers] = useState<UserListInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState("");
  const [selection, setSelection] = useState<number[]>([]);
  const [deleted, setDeleted] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < users.length;

  useEffect(() => {
    const fetchUsersList = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("accessToken");
        const response = await api.get<UserListInterface[]>(
          "/api/users/get-users/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        response.data.forEach((user) => {
          switch (user.package) {
            case "basic":
              user.package = "Básico";
              break;
            case "medium":
              user.package = "Intermedio";
              break;
            case "premium":
              user.package = "Premium";
              break;
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de usuarios", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersList();
  }, []);

  useEffect(() => {
    if (userCreated || error) {
      const timer = setTimeout(() => {
        setUserCreated(false);
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userCreated, error]);

  useEffect(() => {
    if (deleted || deleteError) {
      const timer = setTimeout(() => {
        setDeleted(false);
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [deleted, deleteError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUserCreated(false);
    setError("");

    try {
      const token = Cookies.get("accessToken");
      await api.post(
        "/api/users/create-user/",
        {
          username,
          package: selectedPackage,
          is_temporary: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserCreated(true);
      setUsername("");
      setSelectedPackage("basic");

      const response = await api.get<UserListInterface[]>(
        "/api/users/get-users/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      response.data.forEach((user) => {
        switch (user.package) {
          case "basic":
            user.package = "Básico";
            break;
          case "medium":
            user.package = "Intermedio";
            break;
          case "premium":
            user.package = "Premium";
            break;
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error al crear el usuario", error);
      setError("Error al crear el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = Cookies.get("accessToken");
      await api.delete("/api/users/delete-user/", {
        data: { userIds: selection },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelection([]);
      setDeleted(true);
      const response = await api.get<UserListInterface[]>(
        "/api/users/get-users/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // Update the package names
      response.data.forEach((user) => {
        switch (user.package) {
          case "basic":
            user.package = "Básico";
            break;
          case "medium":
            user.package = "Intermedio";
            break;
          case "premium":
            user.package = "Premium";
            break;
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error al eliminar el usuario", error);
      setDeleteError("Error al eliminar el usuario");
    }
  };

  return (
    <Container maxW="7xl" py={{ base: 4, md: 8 }}>
      <Heading
        as="h1"
        size={{ base: "3xl", md: "5xl" }}
        fontSize={{ base: "2xl", md: "3xl" }}
        textAlign={"center"}
        mb={{ base: 4, md: 8 }}
      >
        Panel de Administrador Graphix
      </Heading>

      <Stack separator={<StackSeparator />} gap={{ base: 4, md: 8 }}>
        <Box borderWidth={"2px"}>
          <Card.Root>
            <Card.Header>
              <Card.Title>Crear Nuevo Usuario</Card.Title>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <Stack separator={<StackSeparator />} gap={{ base: 2, md: 4 }}>
                  <Box>
                    <Field label="Nombre de Usuario">
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ingrese el nombre de usuario"
                        required
                        size={{ base: "sm", md: "md" }}
                        p={{ base: 2, md: 3 }}
                      />
                    </Field>
                  </Box>
                  <Box>
                    <RadioCardRoot defaultValue={"basic"}>
                      <RadioCardLabel>Paquete</RadioCardLabel>
                      <HStack
                        align={"stretch"}
                        flexDir={{ base: "column", md: "row" }}
                      >
                        <RadioCardItem
                          value="basic"
                          description="Incluye 50 páginas"
                          onChange={(e) =>
                            setSelectedPackage(
                              (e.target as HTMLInputElement).value as Package
                            )
                          }
                          label={"Básico"}
                        />
                        <RadioCardItem
                          value="medium"
                          description="Incluye 150 páginas"
                          onChange={(e) =>
                            setSelectedPackage(
                              (e.target as HTMLInputElement).value as Package
                            )
                          }
                          label={"Intermedio"}
                        />
                        <RadioCardItem
                          value="premium"
                          description="Incluye 250 páginas"
                          onChange={(e) =>
                            setSelectedPackage(
                              (e.target as HTMLInputElement).value as Package
                            )
                          }
                          label={"Premium"}
                        />
                      </HStack>
                    </RadioCardRoot>
                  </Box>
                  {!isLoading && (
                    <Button
                      type="submit"
                      justifyContent={"center"}
                      size={{ base: "md", md: "lg" }}
                      variant={"surface"}
                      _hover={{
                        bg: { base: "gray.100", _dark: "gray.900" },
                      }}
                    >
                      Crear Usuario
                    </Button>
                  )}
                  {isLoading && (
                    <Button
                      type="submit"
                      loadingText="Creando..."
                      loading
                      justifyContent={"center"}
                      size={{ base: "md", md: "lg" }}
                      variant={"surface"}
                      _hover={{
                        bg: { base: "gray.100", _dark: "gray.900" },
                      }}
                    >
                      Cargando...
                    </Button>
                  )}
                  {userCreated && (
                    <Alert status="success" variant="subtle">
                      Usuario creado con éxito
                    </Alert>
                  )}
                  {error && (
                    <Alert status="error" variant="subtle">
                      {error}
                    </Alert>
                  )}
                </Stack>
              </form>
            </Card.Body>
          </Card.Root>
        </Box>

        <Box borderWidth={"2px"}>
          <Card.Root>
            <Card.Header>
              <Card.Title>Usuarios Registrados</Card.Title>
            </Card.Header>
            <Card.Body>
              <Box overflowX="auto" minW={{ base: "100%", md: "auto" }}>
                <Table.Root
                  variant={"line"}
                  size={{ base: "sm", md: "md" }}
                  striped
                  showColumnBorder
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader w="6">
                        <Checkbox
                          top="1"
                          aria-label="Seleccionar todos"
                          borderWidth={"1px"}
                          borderColor={"gray.400"}
                          checked={
                            indeterminate
                              ? "indeterminate"
                              : selection.length > 0
                          }
                          onCheckedChange={(changes) => {
                            setSelection(
                              changes.checked
                                ? users.map((user) => user.id)
                                : []
                            );
                          }}
                        />
                      </Table.ColumnHeader>
                      <Table.ColumnHeader>ID</Table.ColumnHeader>
                      <Table.ColumnHeader>Usuario</Table.ColumnHeader>
                      <Table.ColumnHeader>Contraseña</Table.ColumnHeader>
                      <Table.ColumnHeader>Paquete</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {users.map((user) => (
                      <Table.Row
                        key={user.id}
                        data-selected={
                          selection.includes(user.id) ? "" : undefined
                        }
                      >
                        <Table.Cell>
                          <Checkbox
                            top="1"
                            aria-label="Seleccionar fila"
                            borderWidth={"1px"}
                            borderColor={"gray.400"}
                            checked={selection.includes(user.id)}
                            onCheckedChange={(changes) => {
                              setSelection((prev) =>
                                changes.checked
                                  ? [...prev, user.id]
                                  : prev.filter((id) => id !== user.id)
                              );
                            }}
                          />
                        </Table.Cell>
                        <Table.Cell>{user.id}</Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
                        <Table.Cell>
                          <Text fontSize={{ base: "sm", md: "md" }}>
                            {user.raw_password}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge
                            colorPalette={
                              user.package === "Básico"
                                ? "blue"
                                : user.package === "Intermedio"
                                ? "green"
                                : "purple"
                            }
                          >
                            {user.package}
                          </Badge>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Card.Body>
          </Card.Root>
        </Box>
      </Stack>
      {/* adding the action bar */}
      <ActionBar.Root open={hasSelection}>
        <ActionBar.Content>
          <ActionBar.SelectionTrigger>
            {selection.length} {selection.length === 1 ? "Usuario" : "Usuarios"}{" "}
            seleccionado
          </ActionBar.SelectionTrigger>
          <ActionBar.Separator />
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleDelete}
          >
            Eliminar
            <Kbd colorPalette={"red"}>
              <FaTrash />
            </Kbd>
          </Button>
          <ActionBar.CloseTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelection([])}
            >
              Cancelar
            </Button>
          </ActionBar.CloseTrigger>
        </ActionBar.Content>
      </ActionBar.Root>
      {deleted && (
        <Alert status="success" variant="subtle">
          Usuario/s eliminado/s con éxito
        </Alert>
      )}
      {deleteError && (
        <Alert status="error" variant="subtle">
          {deleteError}
        </Alert>
      )}
    </Container>
  );
};

export default AdminPanel;
