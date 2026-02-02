import {
  Table,
  TableHeader,
  TableRow,
  TableColumn,
  TableBody,
  TableCell,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@heroui/button";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/modal";

import ModalCreateEvent from "./ModalCreateEvent";
import ModalDeleteEvent from "./ModalDeleteEvent";
import ModalUpdateEvent from "./ModalUpdateEvent";

import { useModal } from "@/hooks/useModal";
import { selectAllEvents } from "@/features/events/eventsSlice";
import { EventData } from "@/types/EventData.type";

export default function TableEvents() {
  const events = (useSelector(selectAllEvents) as EventData[]) || [];
  const { onOpen: onOpenEvent } = useModal("createEventModal");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const { onOpen: onOpenDeleteModal } = useModal("deleteEventModal");
  const { onOpen: onOpenUpdateModal } = useModal("updateEventModal");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [filterTitle, setFilterTitle] = useState("");
  const rowsPerPage = 10;

  const rows = useMemo(() => {
    const baseRows = Array.isArray(events) ? events : [];

    if (!filterTitle) return baseRows;
    const term = filterTitle.toLowerCase();

    return baseRows.filter((u) => (u.title || "").toLowerCase().includes(term));
  }, [events, filterTitle]);

  const pages = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows.slice(start, end);
  }, [page, rows]);

  useEffect(() => {
    setPage(1);
  }, [filterTitle]);

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 mt-6 max-w-[100vw]">
      <div className="flex flex-col gap-6 w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="ml-12 text-2xl font-bold text-gray-800">
              Gestión de Eventos
            </h1>
          </div>
          <div>
            <Button
              className="bg-magenta-fuchsia-900"
              color="secondary"
              size="md"
              startContent={<Plus className="h-4 w-4" />}
              variant="solid"
              onPress={onOpenEvent}
            >
              Nuevo Evento
            </Button>
          </div>
          <div className="w-full md:w-auto">
            <Input
              isClearable
              classNames={{
                base: "w-full md:w-72",
                inputWrapper:
                  "bg-white text-black border border-gray-200 shadow-sm h-10 data-[hover=true]:bg-white group-data-[focus=true]:bg-white group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:ring-1 group-data-[focus=true]:ring-magenta-fuchsia-500",
                input: "text-black placeholder:text-black/50",
              }}
              color="secondary"
              placeholder="Buscar por título..."
              radius="lg"
              size="md"
              startContent={<Search className="h-4 w-4 text-gray-400" />}
              value={filterTitle}
              variant="bordered"
              onChange={(e) =>
                setFilterTitle((e.target as HTMLInputElement).value)
              }
              onClear={() => setFilterTitle("")}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
          <Table
            removeWrapper
            aria-label="Tabla de eventos"
            bottomContent={
              pages > 1 ? (
                <div className="flex w-full justify-center py-4 px-2 border-t border-gray-100">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    classNames={{
                      cursor: "bg-magenta-fuchsia-600 text-white font-bold",
                    }}
                    color="secondary"
                    page={page}
                    size="sm"
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              ) : null
            }
            classNames={{
              base: "overflow-visible",
              table: "min-w-[1000px]",
              thead: "[&>tr]:first:bg-gray-50 border-b border-gray-200",
              th: "text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 text-left h-12 bg-gray-50",
              td: "py-3 px-4 text-sm border-b border-gray-50 group-last:border-none",
              tr: "hover:bg-gray-50/50 transition-colors duration-200",
            }}
          >
            <TableHeader>
              <TableColumn>TÍTULO</TableColumn>
              <TableColumn>DESCRIPCIÓN</TableColumn>
              <TableColumn>FECHA</TableColumn>
              <TableColumn>UBICACIÓN</TableColumn>
              <TableColumn>PROVEEDOR</TableColumn>
              <TableColumn>IMAGEN</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="bg-gray-50 rounded-full p-4 mb-3">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    No se encontraron resultados
                  </p>
                </div>
              }
              items={items}
            >
              {(item: EventData) => (
                <TableRow key={item.title}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                        {item.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 font-medium line-clamp-2">
                      {item.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 font-medium whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString("es-ES")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 font-medium whitespace-nowrap">
                      {item.location}
                    </span>
                  </TableCell>
                  <TableCell>
                    <a
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 text-xs font-semibold border border-slate-200/60 shadow-sm"
                      href={item.url_provider}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Ver sitio
                      <ExternalLink className="text-slate-400" size={12} />
                    </a>
                  </TableCell>
                  <TableCell>
                    {item.url_image && (
                      <button
                        type="button"
                        aria-label={`Ver imagen de ${item.title}`}
                        className="relative w-12 h-12 rounded-lg overflow-hidden group cursor-zoom-in border border-gray-100 shadow-sm p-0"
                        onClick={() => {
                          setSelectedImage(item.url_image!);
                          onOpen();
                        }}
                      >
                        <img
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          src={item.url_image}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <Search
                            className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100"
                            size={16}
                          />
                        </div>
                      </button>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-1 sm:gap-2">
                      <button
                        aria-label="Modificar"
                        className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 group border-none outline-none focus:outline-none focus:ring-0 active:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          onOpenUpdateModal();
                          setSelectedEventId(item._id);
                        }}
                      >
                        <Pencil
                          className="text-yellow-300"
                          height={15}
                          width={15}
                        />
                      </button>
                      <button
                        aria-label="Eliminar"
                        className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 group border-none outline-none focus:outline-none focus:ring-0 active:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          onOpenDeleteModal();
                          setSelectedEventId(item._id);
                        }}
                      >
                        <Trash2
                          className="text-red-300"
                          height={15}
                          width={15}
                        />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ModalCreateEvent />
      <ModalDeleteEvent id={selectedEventId} />
      <ModalUpdateEvent id={selectedEventId} />

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
        size="2xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent className="bg-transparent shadow-none border-none">
          <ModalBody className="p-0">
            <img
              alt="Preview"
              className="w-full h-auto rounded-xl shadow-2xl"
              src={selectedImage}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <style global jsx>{`
        /* Optional: cleaner scrollbar for the table container */
        div[class*="overflow-x-auto"]::-webkit-scrollbar {
          height: 8px;
        }
        div[class*="overflow-x-auto"]::-webkit-scrollbar-track {
          background: transparent;
        }
        div[class*="overflow-x-auto"]::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
