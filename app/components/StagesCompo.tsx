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
import { UserListInterface } from "../interfaces/UserInterface";
import {
  StageSaveInterface,
  StagedSavedGetInterface,
} from "@/app/interfaces/UserInterface";
import { isAxiosError } from "axios";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";

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
  const [stageIndex, setStageIndex] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedTemplateContent, setSelectedTemplateContent] =
    useState<string>("");
  const [open, setOpen] = useState(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [file, setFile] = useState<File[] | null>(null);
  const [acceptedOne, setAcceptedOne] = useState<boolean>(false);
  const [rejectedOne, setRejectedOne] = useState<boolean>(false);
  const [resourceImagesUrl, setResourceImagesUrl] = useState<[]>([]);
  const [userInfo, setUserInfo] = useState<UserListInterface | null>(null);
  const [pagesToUse, setPagesToUse] = useState<number>(1);
  const [pagesError, setPagesError] = useState<boolean>(false);
  const [errorSendStage, setErrorSendStage] = useState<boolean>(false);
  const [noPages, setNoPages] = useState<boolean>(false);

  const fileUpload = useFileUpload({
    maxFiles: 10,
    maxFileSize: 5000000,
  });

  const accepted = fileUpload.acceptedFiles.map((file) => file.name);
  const rejected = fileUpload.rejectedFiles.map((e) => e.file.name);

  useEffect(() => {
    const getStageSavedData = async () => {
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
        setStageIndex(response.data.pdf_progress);
      } catch (error) {
        console.log(error);
      }
    };
    getStageSavedData();
  }, []);

  useEffect(() => {
    const fecthUserInfo = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await api.get<UserListInterface>(
          "api/users/get-user-info/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserInfo(response.data);
        if (response.data.page_limit === 0) {
          setNoPages(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fecthUserInfo();
  }, []);

  const handleEditorChange = (content: string) => {
    setSelectedTemplateContent(content);
  };

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
        file.forEach((f) => formData.append("files", f));
      }

      const response = await api.post("api/pdf/save/upload-images/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setResourceImagesUrl(response.data.files_url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo?.page_limit && pagesToUse > userInfo.page_limit) {
      setPagesError(true);
      return;
    }

    const stageSaveData: StageSaveInterface = {
      stage_number: stageIndex,
      html: selectedTemplateContent,
      page_count: pagesToUse,
      user: userInfo?.id,
    };

    if (!selectedTemplate) {
      setErrorMessage(
        "Por favor, selecciona una plantilla antes de continuar."
      );
      return;
    }

    try {
      const token = Cookies.get("accessToken");
      const response = await api.post(
        "api/pdf/save/save-stage/",
        stageSaveData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setUserInfo((prev) => {
          if (prev) {
            const updatedUser = {
              ...prev,
              page_limit: prev.page_limit - pagesToUse,
            };
            return updatedUser;
          }
          return prev;
        });

        setStageIndex((prev) => prev + 1);
        setSelectedTemplate("");
        setShowPreview(false);
        setPagesToUse(0)
      }
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 500) {
        setNoPages(true);
      } else {
        setErrorSendStage(true);
      }
      console.log(error);
    }

    setErrorMessage("");
  };

  useEffect(() => {
    if (errorSendStage) {
      const timer = setTimeout(() => {
        setErrorSendStage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorSendStage]);

  useEffect(() => {
    if (pagesError) {
      const timer = setTimeout(() => {
        setPagesError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [pagesError]);

  useEffect(() => {
    const loadTemplate = async () => {
      if (selectedTemplate) {
        const template = templates.find(
          (t) => t.id.toString() === selectedTemplate
        );

        if (template) {
          try {
            const response = await fetch(template.content);
            const html = await response.text();

            setSelectedTemplateContent(html);
          } catch (error) {
            console.error(error);
            setSelectedTemplateContent("Error al cargar la plantilla.");
          }
        }
      }
    };

    loadTemplate();
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
      <Flex
        p={{ base: 4, md: 8 }}
        flex={1}
        gap={4}
        align={"center"}
        direction={"column"}
        justify={"center"}
      >
        <Card.Root
          w={{ base: "full", md: "70%" }}
          h={"auto"}
          boxShadow="lg"
          borderRadius="lg"
        >
          <Card.Header gap={4}>
            <Heading fontSize={{ base: "xl", md: "2xl" }} textAlign="center">
              ¡Bienvenido al seleccionador de plantillas!
            </Heading>
            <Stack align={"center"}>
              {!resourceImagesUrl.length ? (
                <>
                  <Text textAlign={"center"} py={2} fontSize={"md"}>
                    Primero, porfavor sube aqui las imagenes que quieras usar
                    para la portada de tu cuaderno
                  </Text>
                  <FileUploadRootProvider
                    maxW={"xl"}
                    alignItems={"stretch"}
                    value={fileUpload}
                  >
                    <FileUploadDropzone
                      label="Arrastra y agrega tus archivos para subirlos"
                      description=".png, .jpg no mas de 5MB y no mas de 10 imagenes"
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
                      Subir archivos
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Status size={"lg"} width={"100px"} value="success">
                    Aprobada
                  </Status>
                  <Alert
                    status={"success"}
                    size={"lg"}
                    textAlign={"center"}
                    fontWeight={"medium"}
                  >
                    Las imagenes han sido recibidas correctamente por el
                    servidor
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
                Etapa {stageIndex}
              </Text>

              {!noPages && (
                <>
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
                          onValueChange={(e) => setPagesToUse(Number(e.value))}
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
                        Te quedan {userInfo?.page_limit} paginas
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
                            _hover={{
                              bg: { base: "gray.100", _dark: "gray.900" },
                            }}
                          >
                            Cancelar
                          </Button>
                        </DrawerActionTrigger>
                        <Button
                          onClick={() => setOpen(false)}
                          variant={"outline"}
                          borderWidth={2}
                          p={2}
                          _hover={{
                            bg: { base: "gray.100", _dark: "gray.900" },
                          }}
                        >
                          Seleccionar
                        </Button>
                      </DrawerFooter>
                      <DrawerCloseTrigger />
                    </DrawerContent>
                  </DrawerRoot>

                  <Alert
                    my={4}
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
                    {pagesError && (
                      <Alert
                        status={"error"}
                        title="Limite de paginas excedido"
                      >
                        No tienes suficientes paginas disponibles
                      </Alert>
                    )}
                    {errorSendStage && (
                      <Alert status={"error"} title="Error en el servidor">
                        No fue posible enviar la etapa, porfavor reintente.
                      </Alert>
                    )}
                    ;
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
                </>
              )}
              {noPages && (
                <>
                  <Stack separator={<StackSeparator />} gap={4}>
                    <Alert
                      status={"error"}
                      textAlign={"center"}
                      size={"md"}
                      fontWeight={"bold"}
                      title={"Limite de paginas alcanzado"}
                    >
                      Haz alcanzado el limite de paginas permitidas por tu
                      paquete contratado
                      <br />
                      Si necesitas más paginas porfavor ponte en contacto con
                      nuestro equipo
                    </Alert>
                    <Alert
                      status={"neutral"}
                      title="Tu cuaderno esta casi listo"
                      textAlign={"center"}
                      fontWeight={"bold"}
                    >
                      Felicidades, has completado tu documento exitosamente{" "}
                      <br />
                      Ahora pasa a la preview y verifica que todo este bien
                    </Alert>
                    <Link href={"/preview"}>
                      <Button
                        width="full"
                        variant={"outline"}
                        p={6}
                        color={"white"}
                        bg={{ base: "blue.600", _dark: "blue.900" }}
                        _hover={{ bg: { base: "blue.500", _dark: "blue.800" } }}
                        fontSize={"lg"}
                      >
                        Pasar a la preview del documento{" "}
                        <FaArrowAltCircleRight />
                      </Button>
                    </Link>
                  </Stack>
                </>
              )}
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
              Editar Plantilla
            </Heading>
            <Editor
              key={selectedTemplate}
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "no-key"}
              value={selectedTemplateContent}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                  "emoticons",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help | image | code",
                content_style: `
                  body { 
                    margin: 0 !important; 
                    padding: 0 !important;
                  }
                `,
                valid_elements: "*[*]",
                valid_styles: {
                  "*":
                    "color,font-size,font-weight,font-style,text-decoration," +
                    "float,margin,padding,width,height,display,border," +
                    "border-collapse,border-spacing,border-color,border-width," +
                    "text-align,vertical-align,background,background-color",
                },
                allow_unsafe_link_target: true,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setup: (editor: any) => {
                  editor.on("init", () => {
                    editor.serializer.addAttributeFilter(
                      "style",
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (nodes: any[]) => {
                        nodes.forEach((node) => {
                          node.attr("style", node.attr("style"));
                        });
                      }
                    );
                  });
                },
              }}
              onEditorChange={handleEditorChange}
            />
          </Box>
        )}
      </Flex>
    </Stack>
  );
};

export default StagesCompo;
