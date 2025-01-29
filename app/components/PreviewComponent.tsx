"use client";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Image,
  Skeleton,
  StackSeparator,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { api } from "../utils/api";
import Cookies from "js-cookie";
import { StagedSavedGetInterface } from "../interfaces/UserInterface";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SendStages {
  stages?: { html: string; page_count: number }[];
  confirm?: boolean;
}

interface PostResponse {
  message: string;
  preview_images: string[];
}
interface PostPDFResponse {
  message: string;
  pdf_path: string;
}

const PreviewsPage = () => {
  const bgColor = useColorModeValue("white", "gray.900");
  const cardBg = useColorModeValue("gray.50", "gray.800");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedStages, setSavedStages] = useState<StagedSavedGetInterface>({
    pdf_progress: 0,
    stages: [],
    userName: "",
  });
  const [sToSend, setSToSend] = useState<SendStages>({});

  useEffect(() => {
    const getStagesData = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await api.get<StagedSavedGetInterface>(
          "api/pdf/save/save-stage",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSavedStages(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getStagesData();
  }, []);

  useEffect(() => {
    if (savedStages) {
      setSToSend({
        stages: savedStages.stages.map((stage) => ({
          html: stage.html,
          page_count: stage.page_count,
        })),
        confirm: false,
      });
    }
  }, [savedStages]);

  const handleGeneratePdf = async () => {
    try {
      const newState = {
        stages: savedStages.stages.map((stage) => ({
          html: stage.html,
          page_count: stage.page_count,
        })),
        confirm: true,
      };
      const token = Cookies.get("accessToken");
      const response = await api.post<PostPDFResponse>(
        "/api/pdf/confirm-generate-pdf/",
        newState,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const postStagesData = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await api.post<PostResponse>(
          "api/pdf/generate-previews/",
          sToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (isMounted && response.data.preview_images) {
          setImages(response.data.preview_images);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error(error);
          setIsLoading(false);
        }
      }
    };

    if ((sToSend.stages?.length ?? 0) > 0 && !controller.signal.aborted) {
      postStagesData();
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [sToSend]);

  return (
    <Box minH="100vh" pt="10">
      <Container maxW="7xl" py={12}>
        <Stack gap={12} separator={<StackSeparator />}>
          {/* Encabezado con controles */}
          <Box
            p={6}
            borderRadius="xl"
            bg={bgColor}
            boxShadow="lg"
            display="flex"
            flexDirection={{ base: "column", md: "calumn" }}
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <Heading fontSize={"2xl"} textAlign={"center"}>
              ¡Ya casi terminamos!
            </Heading>
            <Alert
              w={{ base: "full", md: "66%" }}
              status={"info"}
              title={"IMPORTANTE"}
              textAlign={"center"}
              size={"lg"}
            >
              Solo se mostrara una imagen de cada etapa, no es el documento
              completo
            </Alert>
            <DialogRoot
              placement={"center"}
              motionPreset={"slide-in-bottom"}
              size={{ base: "xs", md: "xl" }}
            >
              <DialogTrigger asChild>
                <Button
                  p={3}
                  color={"white"}
                  bg={{ base: "red.600", _dark: "red.800" }}
                  _hover={{
                    base: { backgroundColor: "red.500" },
                    _dark: { backgroundColor: "red.700" },
                  }}
                >
                  Confirmar y enviar cuaderno
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle fontSize={"2xl"} fontWeight={"bold"}>
                    ¿Esta todo listo?
                  </DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <Text fontSize={"lg"}>
                    Al aceptar, confirmas que todo esta listo y estas conforme
                    con el resultado, te recordamos que cuando aceptes el
                    cuaderno sera enviado y tu usuario borrado.
                  </Text>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger asChild>
                    <Button
                      bg={{ base: "red.600", _dark: "red.800" }}
                      color={"white"}
                      p={3}
                      _hover={{
                        base: { backgroundColor: "red.500" },
                        _dark: { backgroundColor: "red.700" },
                      }}
                    >
                      Cancelar
                    </Button>
                  </DialogActionTrigger>
                  <Button
                    bg={{ base: "blue.600", _dark: "blue.800" }}
                    color={"white"}
                    p={3}
                    _hover={{
                      base: { backgroundColor: "blue.500" },
                      _dark: { backgroundColor: "blue.700" },
                    }}
                    onClick={handleGeneratePdf}
                  >
                    Aceptar
                  </Button>
                </DialogFooter>
                <DialogCloseTrigger />
              </DialogContent>
            </DialogRoot>
          </Box>

          {/* Grid de imágenes */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton
                      key={i}
                      height="300px"
                      borderRadius="xl"
                      boxShadow="md"
                    />
                  ))
              : images.map((img, index) => (
                  <Box
                    key={index}
                    position="relative"
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="md"
                    _hover={{
                      transform: "translateY(-4px)",
                      boxShadow: "xl",
                    }}
                    transition="all 0.3s"
                    bg={cardBg}
                  >
                    <Image
                      src={img}
                      alt={`Previsualización ${index + 1}`}
                      objectFit="contain"
                      h="fit-content"
                      w="full"
                    />
                    <Box
                      position="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      p={4}
                    >
                      <Text color="black" fontWeight="bold">
                        Etapa {index + 1}
                      </Text>
                    </Box>
                  </Box>
                ))}
          </SimpleGrid>

          {/* Mensaje cuando no hay imágenes */}
          {!isLoading && images.length === 0 && (
            <Box
              textAlign="center"
              py={20}
              borderRadius="xl"
              bg={bgColor}
              boxShadow="base"
            >
              <Heading as="h2" size="lg" mb={4}>
                La previsualizaciones no han sido cargadas por el servidor
              </Heading>
              <Text color="gray.500" mb={6}>
                Porfavor recarga la pagina o ponte en contacto con nosotros si
                esto no funciona
              </Text>
              <Button
                size="lg"
                px={8}
                color={"white"}
                bg={{ base: "blue.600", _dark: "blue.900" }}
                _hover={{ transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                Soporte
              </Button>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default PreviewsPage;
