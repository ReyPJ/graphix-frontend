"use client";
import {
  Button,
  Flex,
  Stack,
  Heading,
  StackSeparator,
  Card,
  Text,
  Box,
  Kbd,
  useFileUpload,
  FileUploadRootProvider,
  Code,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Radio, RadioGroup } from "@/components/ui/radio";
import {
  DrawerBackdrop,
  DrawerTrigger,
  DrawerRoot,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerActionTrigger,
  DrawerCloseTrigger,
} from "@/components/ui/drawer";
import { Alert } from "@/components/ui/alert";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { CgTemplate } from "react-icons/cg";
import { MdPreview } from "react-icons/md";
import { BiWindowClose } from "react-icons/bi";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import { Field } from "@/components/ui/field";
import {
  FileUploadList,
  FileUploadDropzone,
} from "@/components/ui/file-upload";
import Cookies from "js-cookie";
import { api } from "../utils/api";
import { Status } from "@/components/ui/status";

const templates = [
  {
    id: 1,
    name: "Plantilla 1",
    content: "/templates/stage1/template1.html",
  },
  { id: 2, name: "Plantilla 2", content: "/templates/stage1/template2.html" },
  { id: 3, name: "Plantilla 3", content: "/templates/stage1/template3.html" },
  { id: 4, name: "Plantilla 4", content: "/templates/stage1/template4.html" },
  { id: 5, name: "Plantilla 5", content: "/templates/stage1/template5.html" },
];

const StagesCompo: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>(""); // Estado para mostrar el error
  const [selectedTemplateContent, setSelectedTemplateContent] =
    useState<string>(""); // Estado para el contenido de la plantilla seleccionada
  const [open, setOpen] = useState(false); // Control de apertura del Drawer
  const [showPreview, setShowPreview] = useState<boolean>(false); // Estado para mostrar la vista previa de la plantilla
  const [file, setFile] = useState<File[] | null>(null);
  const [acceptedOne, setAcceptedOne] = useState<boolean>(false);
  const [rejectedOne, setRejectedOne] = useState<boolean>(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");

  const fileUpload = useFileUpload({
    maxFiles: 1,
    maxFileSize: 5000000,
  });

  const accepted = fileUpload.acceptedFiles.map((file) => file.name);
  const rejected = fileUpload.rejectedFiles.map((e) => e.file.name);

  useEffect(() => {
    if (fileUpload.acceptedFiles.length > 0) {
      setFile(fileUpload.acceptedFiles);
      setAcceptedOne(true);
      setRejectedOne(false);
    }
  }, [fileUpload.acceptedFiles]);

  useEffect(() => {
    if (fileUpload.rejectedFiles.length > 0) {
      setRejectedOne(true);
      setAcceptedOne(false);
    }
  }, [fileUpload.rejectedFiles]);

  const hanldeDeleteFile = () => {
    setFile(null);
    setAcceptedOne(false);
  };

  const handleUploadFile = async () => {
    if (!file) {
      console.log("There is no file to send");
    }

    try {
      const token = Cookies.get("accessToken");
      const formData = new FormData();

      if (file) {
        formData.append("file", file[0]);
      }

      const response = await api.post(
        "api/pdf/save/upload-cover-image/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCoverImageUrl(response.data.file_url);
    } catch (error) {
      console.error(error);
    }
  };

  const page_count = 250;

  const handleNextStage = () => {
    if (!selectedTemplate) {
      setErrorMessage(
        "Por favor, selecciona una plantilla antes de continuar."
      );
      return;
    }

    setErrorMessage(""); // Limpiar el mensaje de error si se selecciona una plantilla
    setStageIndex((prev) => prev + 1);
    setSelectedTemplate(""); // Resetear la selección para la siguiente etapa
  };

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(
        (template) => template.id.toString() === selectedTemplate
      );
      if (template) {
        fetch(template.content)
          .then((response) => response.text())
          .then((data) => setSelectedTemplateContent(data))
          .catch(() =>
            setSelectedTemplateContent("Error al cargar la plantilla.")
          );
      }
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <Stack p={{ base: 4, md: 10 }} direction={{ base: "column", md: "row" }}>
      {/* Form Section - Card */}
      <Flex
        p={{ base: 4, md: 8 }}
        flex={1}
        gap={4}
        align={"center"}
        direction={"column"}
        justify={"center"}
      >
        <Card.Root
          w={{ base: "full", md: "60%" }}
          h={"auto"}
          boxShadow="lg"
          borderRadius="lg"
        >
          <Card.Header gap={4}>
            <Heading fontSize={{ base: "xl", md: "2xl" }} textAlign="center">
              ¡Bienvenido al seleccionador de plantillas!
            </Heading>
            <Stack align={"center"}>
              {!coverImageUrl && (
                <>
                  <Text textAlign={"center"} py={2} fontSize={"md"}>
                    Primero, porfavor sube aqui la portada que usaras para tu
                    cuaderno de comunicados
                  </Text>
                  <FileUploadRootProvider
                    maxW={"xl"}
                    alignItems={"stretch"}
                    value={fileUpload}
                  >
                    <FileUploadDropzone
                      label="Arrastra y agrega tus archivos para subirlos"
                      description=".png, .jpg no mas de 5MB"
                      borderWidth={2}
                      borderRadius={2}
                      borderStyle={"dashed"}
                    />
                    <FileUploadList
                      borderWidth={1}
                      borderRadius={2}
                      showSize
                      clearable
                      onClick={hanldeDeleteFile}
                    />
                  </FileUploadRootProvider>
                  {acceptedOne && (
                    <Code colorPalette="green">
                      Aceptado: {accepted.join(", ")}
                    </Code>
                  )}
                  {rejectedOne && (
                    <Code colorPalette="red">
                      Rechazado: {rejected.join(", ")}
                    </Code>
                  )}
                  {file && (
                    <Button
                      onClick={handleUploadFile}
                      width="full"
                      borderRadius={8}
                      color={"white"}
                      bg={{ base: "blue.600", _dark: "blue.900" }}
                      _hover={{ bg: { base: "blue.500", _dark: "blue.800" } }}
                    >
                      Subir archivo
                    </Button>
                  )}
                </>
              )}
              {coverImageUrl && (
                <>
                  <Status size={"lg"} width={"100px"} value="success">
                    Aprobada
                  </Status>
                  <Alert status={"success"} size={"lg"} fontWeight={"medium"} >
                    La imagen de portada ha sido recibida y aprobada por el servidor
                  </Alert>
                </>
              )}
            </Stack>
            <Text textAlign={"center"} fontSize={"md"}>
              Ahora, selecciona o edita una plantilla para cada etapa
            </Text>
          </Card.Header>
          <Card.Body>
            <Stack gap={4} separator={<StackSeparator />}>
              <Text
                fontSize={{ base: "xl", lg: "3xl" }}
                textAlign="center"
                fontWeight={"bold"}
                color={"blue.700"}
              >
                Etapa {stageIndex + 1}
              </Text>

              <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
                <DrawerBackdrop />
                <DrawerTrigger asChild>
                  <Button
                    onClick={() => setOpen(true)}
                    width="full"
                    borderWidth={1}
                    _hover={{ bg: { base: "gray.100", _dark: "gray.900" } }}
                  >
                    Seleccionar Plantilla <CgTemplate />
                  </Button>
                </DrawerTrigger>
                <Flex
                  justify={"center"}
                  align={"center"}
                  direction={"column"}
                  justifyItems={"center"}
                  justifyContent={"center"}
                  textAlign={"center"}
                  alignContent={"center"}
                  w={"100%"}
                >
                  <Heading py={2}>¿Cuantas Paginas?</Heading>
                  <Field
                    helperText="Recuerda distribuir las paginas correctamente segun tu plan contratado"
                    w={"fit-content"}
                    textAlign={"center"}
                    py={2}
                  >
                    <NumberInputRoot
                      width={"200px"}
                      defaultValue="1"
                      min={1}
                      max={250}
                      mx={"auto"}
                    >
                      <NumberInputField
                        px={2}
                        py={0}
                        borderWidth={1}
                        borderColor={"gray.200"}
                      />
                    </NumberInputRoot>
                  </Field>
                  <Alert
                    py={3}
                    status={"warning"}
                    w={"1/2"}
                    textAlign={"center"}
                    fontSize={"lg"}
                  >
                    Te quedan {page_count} paginas
                  </Alert>
                </Flex>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Selecciona una plantilla</DrawerTitle>
                  </DrawerHeader>

                  <DrawerBody>
                    <RadioGroup
                      value={selectedTemplate}
                      onChange={(event) =>
                        setSelectedTemplate(
                          (event.target as HTMLInputElement).value
                        )
                      }
                      variant={"subtle"}
                    >
                      <Stack
                        gap={4}
                        separator={<StackSeparator />}
                        direction="column"
                      >
                        {templates.map((template) => (
                          <Radio
                            key={template.id}
                            value={template.id.toString()}
                          >
                            {template.name}
                          </Radio>
                        ))}
                      </Stack>
                    </RadioGroup>
                  </DrawerBody>

                  <DrawerFooter justifyContent={"space-between"}>
                    <DrawerActionTrigger asChild>
                      <Button
                        onClick={() => setOpen(false)}
                        variant="outline"
                        borderWidth={1}
                        p={2}
                        _hover={{ bg: { base: "gray.100", _dark: "gray.900" } }}
                      >
                        Cancelar
                      </Button>
                    </DrawerActionTrigger>
                    <Button
                      onClick={() => setOpen(false)}
                      variant={"outline"}
                      borderWidth={2}
                      p={2}
                      _hover={{ bg: { base: "gray.100", _dark: "gray.900" } }}
                    >
                      Seleccionar
                    </Button>
                  </DrawerFooter>
                  <DrawerCloseTrigger />
                </DrawerContent>
              </DrawerRoot>

              <Alert
                mt={4}
                status={"info"}
                textAlign={"center"}
                fontSize={"lg"}
              >
                Plantilla seleccionada:{" "}
                <Kbd>
                  {selectedTemplate
                    ? templates.find(
                        (t) => t.id.toString() === selectedTemplate
                      )?.name
                    : "Ninguna"}
                </Kbd>
              </Alert>

              {errorMessage && (
                <Alert status={"error"} title="Plantilla no seleccionada">
                  {errorMessage}
                </Alert>
              )}

              <Stack gap={6} separator={<StackSeparator />}>
                <Button
                  width="full"
                  variant={"outline"}
                  borderWidth={1}
                  _hover={{ bg: { base: "gray.100", _dark: "gray.900" } }}
                  onClick={handleNextStage}
                  fontSize={"lg"}
                >
                  Siguiente Etapa <FaArrowAltCircleRight />
                </Button>
              </Stack>
              <Button
                width="full"
                mt={4}
                onClick={() => setShowPreview(!showPreview)}
                _hover={{ bg: { base: "gray.100", _dark: "gray.900" } }}
                borderWidth={1}
                cursor={"pointer"}
              >
                {showPreview ? (
                  <>
                    Cerrar Vista Previa <BiWindowClose />
                  </>
                ) : (
                  <>
                    Ver Vista Previa <MdPreview />
                  </>
                )}
              </Button>
            </Stack>
          </Card.Body>
        </Card.Root>
        {showPreview && (
          <Box
            p={4}
            bg="white"
            boxShadow="xl"
            borderRadius="lg"
            w={"full"}
            borderWidth="1px"
            mt={8}
          >
            <Heading fontSize="xl" textAlign={"center"} mb={4}>
              Vista Previa de la Plantilla
            </Heading>
            <div
              dangerouslySetInnerHTML={{
                __html: selectedTemplateContent,
              }}
            />
          </Box>
        )}
      </Flex>
    </Stack>
  );
};

export default StagesCompo;
