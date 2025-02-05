"use client";
import {
  Button,
  Flex,
  Stack,
  Image,
  Heading,
  Input,
  StackSeparator,
  Card,
} from "@chakra-ui/react";

import { Alert } from "@/components/ui/alert";
import { PasswordInput } from "@/components/ui/password-input";
import { ColorModeButton } from "@/components/ui/color-mode";
import { Field } from "@/components/ui/field";
import { useState } from "react";
import { api } from "../utils/api";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function SplitScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginIn, setLoginIn] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      const response = await api.post("/token/login/", {
        username,
        password,
      });
      setLoginIn(true);
      const access = response.data.access;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decodeToken: any = jwtDecode(access);
      const userId = decodeToken.user_id || null;

      Cookies.set("user_id", userId, { expires: 1 });
      Cookies.set("accessToken", access, { expires: 1 });
      window.location.href = "/";
    } catch {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      {/* Form Section - Card */}
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Card.Root maxW={"md"} w={"full"} boxShadow="lg" borderRadius="lg">
          <Card.Header>
            <Heading fontSize={"2xl"} textAlign="center">
              Bienvenido a Graphix
            </Heading>
          </Card.Header>
          <Card.Body>
            <Stack gap={4} separator={<StackSeparator />}>
              {/* Image inside Card */}
              <Image
                alt={"Login Image"}
                objectFit={"cover"}
                width="100%"
                height="200px"
                src={
                  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
                }
              />

              {/* Email Field */}
              <Field label="Usuario">
                <Input
                  type="text"
                  p={2}
                  placeholder="Nombre de Usuario"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>

              {/* Password Field */}
              <Field label="Contraseña">
                <PasswordInput
                  p={2}
                  placeholder="Escribe tu contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              <Stack gap={6} separator={<StackSeparator />}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <ColorModeButton w={"full"} borderWidth={1} />
                </Stack>
                <Button
                  width="full"
                  variant={"outline"}
                  borderWidth={1}
                  _hover={{ bg: { base: "gray.100", _dark: "gray.900" } }}
                  onClick={handleLogin}
                >
                  {loginIn ? "Cargando..." : "Iniciar Sesion"}
                </Button>
                {error && <Alert status="error">{error}</Alert>}
              </Stack>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Flex>
    </Stack>
  );
}
