"use client";
import {
  Box,
  Container,
  Text,
  Stack,
  VStack,
  Link,
  Icon,
  StackSeparator,
} from "@chakra-ui/react";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import { useColorModeValue } from "@/components/ui/color-mode";

const Footer = () => {
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const shadowColor = useColorModeValue(
    "rgb(0 0 0 / 0.1)",
    "rgb(255 255 255 / 0.1)"
  );
  const bgColor = useColorModeValue("white", "gray.900");

  return (
    <Box
      as="footer"
      bg={bgColor}
      borderTop="1px"
      borderColor={borderColor}
      boxShadow={`0 -4px 6px -1px ${shadowColor}`}
      position="relative"
      zIndex={2}
    >
      <Container maxW="7xl" py={12}>
        <VStack separator={<StackSeparator />}>
          {/* Logo y Descripción */}
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="blue.500"
            w="100%"
            textAlign="center"
          >
            Tu Empresa
          </Text>

          <Text maxW="2xl" textAlign="center" w="75%">
            Transformando la manera en que organizas tus ideas y conocimientos.
            Únete a nosotros en este viaje hacia una mejor gestión del
            conocimiento.
          </Text>

          {/* Links */}
          <Stack
            direction={{ base: "column", sm: "row" }}
            separator={<StackSeparator />}
            w="100%"
            justify="center"
          >
            <Link _hover={{ color: "blue.500" }} h={"1/3"}>Términos</Link>
            <Link _hover={{ color: "blue.500" }} h={"1/3"}>Privacidad</Link>
            <Link _hover={{ color: "blue.500" }} h={"1/3"}>Contacto</Link>
          </Stack>

          {/* Redes Sociales */}
          <Stack
            direction="row"
            separator={<StackSeparator />}
            w="50%"
            justify="center"
          >
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <Icon as={FaTwitter} w={6} h={6} _hover={{ color: "blue.500" }} />
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <Icon as={FaGithub} w={6} h={6} _hover={{ color: "blue.500" }} />
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <Icon
                as={FaLinkedin}
                w={6}
                h={6}
                _hover={{ color: "blue.500" }}
              />
            </Link>
          </Stack>

          {/* Copyright */}
          <Text fontSize="sm" w="100%" textAlign="center">
            © {new Date().getFullYear()} Tu Empresa. Todos los derechos
            reservados.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};
export default Footer;
