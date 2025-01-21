"use client";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  StackSeparator,
  AspectRatio,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { api } from "../utils/api";
import Link from "next/link";

const Landing = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const bgColor = useColorModeValue("white", "gray.900");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await api.get("api/users/get-username/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserName(response.data.username);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsername();
  }, []);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    window.location.href = "/login";
  };

  return (
    <Box minH="100vh" pt="10">
      <Container maxW="7xl" py={12}>
        <Stack separator={<StackSeparator />}>
          <Text
            onClick={handleLogout}
            color={"blue.600"}
            textDecoration={"underline"}
            textAlign={"center"}
            _hover={{ color: "blue.700" }}
            w={"auto"}
            cursor={"pointer"}
          >
            Cerrar Sesión
          </Text>
          {/* Sección de Bienvenida */}
          <Box
            textAlign="center"
            py={16}
            px={4}
            borderRadius="xl"
            boxShadow="lg"
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background:
                "linear-gradient(135deg, rgba(66,153,225,0.1) 0%, rgba(49,130,206,0.1) 100%)",
              borderRadius: "xl",
              zIndex: 0,
            }}
          >
            <Box position="relative" zIndex={1}>
              <Text
                as="h1"
                fontSize="5xl"
                fontWeight="bold"
                background="linear-gradient(to right, #3182CE, #63B3ED)"
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                mb={4}
                display="inline-block"
              >
                ¡Bienvenido, {userName}!
              </Text>
              <Text fontSize="xl" mt={4}>
                Estamos emocionados de tenerte aquí
              </Text>
            </Box>
          </Box>

          {/* Sección de Explicación */}
          <Box
            p={8}
            borderRadius="xl"
            bg={bgColor}
            boxShadow="base"
            textAlign="center"
          >
            <Heading as="h2" size="lg" mb={4}>
              Sobre Nosotros
            </Heading>
            <Text fontSize="lg">
              Somos una empresa dedicada a revolucionar la forma en que las
              personas organizan sus ideas y conocimientos. Nuestra plataforma
              te permite crear cuadernos digitales interactivos que potencian tu
              productividad y creatividad.
            </Text>
          </Box>

          {/* Sección de Video */}
          <Box p={8} bg={bgColor} borderRadius="xl" boxShadow="base">
            <Heading as="h2" size="lg" mb={6} textAlign="center">
              ¿Cómo funciona?
            </Heading>
            <AspectRatio ratio={16 / 9} maxW="800px" mx="auto">
              <Box display="flex" alignItems="center" justifyContent="center">
                Video Tutorial (Próximamente)
              </Box>
            </AspectRatio>
          </Box>

          {/* Sección de Call to Action */}
          <Box
            textAlign="center"
            py={10}
            bg={bgColor}
            borderRadius="xl"
            boxShadow="base"
          >
            <Heading as="h2" size="xl" mb={6}>
              ¿Estás listo?
            </Heading>
            <Button
              size="lg"
              colorScheme="blue"
              px={8}
              py={6}
              fontSize="xl"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              transition="all 0.2s"
              variant={"surface"}
              color={"white"}
              background={"linear-gradient(to right, #3182CE, #63B3ED)"}
            >
              <Link href={"/stages"}>¡Empezar a crear mi cuaderno!</Link>
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Landing;
