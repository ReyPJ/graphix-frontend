"use client";
import { Box, Flex, Image, Link } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { ColorModeButton } from "@/components/ui/color-mode";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const Header = () => {
  const pathname = usePathname();
  const bgColor = useColorModeValue("white", "gray.900");
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(()=>{
    const fetchUserId = async () => {
      const userId = await Cookies.get("user_id")
      const numId = parseInt(userId)
      if (numId === 1){
        setIsAdmin(true)
      }
    }
    fetchUserId()
  }, []);

  return (
    <Box
      as="header"
      bg={bgColor}
      position="sticky"
      w={"100%"}
      boxShadow="sm"
      borderBottom="1px"
      zIndex="1000"
    >
      <Flex
        maxW="7xl"
        mx="auto"
        px={4}
        h={{ base: "50", md: "32" }}
        paddingBottom={{ base: 2, md: 0 }}
        alignItems="center"
        justifyContent="space-between"
        flexDir={{ base: "column", md: "row" }}
        gap={{ base: 2, md: 0 }}
      >
        <Image
          h="28"
          src="/logo.png"
          alt="Logo de la empresa"
          objectFit="contain"
          p={{ base: 2, md: 0 }}
        />

        <ColorModeButton />
        {pathname === "/admin" && (
          <Link
            href="/"
            fontSize="md"
            fontWeight="medium"
            color="blue.500"
            _hover={{
              textDecoration: "none",
              color: "blue.600",
            }}
          >
            Regresar a Inicio
          </Link>
        )}
        {(pathname === "/"|| pathname === "/stages") && isAdmin && (
          <Link
            href="/admin"
            fontSize="md"
            fontWeight="medium"
            color="blue.500"
            _hover={{
              textDecoration: "none",
              color: "blue.600",
            }}
          >
            Panel de administrador
          </Link>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
