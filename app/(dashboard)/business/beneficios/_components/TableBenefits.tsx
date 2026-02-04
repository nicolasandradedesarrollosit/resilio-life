"use client";

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
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/modal";

import ModalCreateBenefit from "./ModalCreateBenefit";
import ModalDeleteBenefit from "./ModalDeleteBenefit";
import ModalUpdateBenefit from "./ModalUpdateBenefit";

import { useModal } from "@/shared/hooks";
import { selectAllBenefits } from "@/features/benefits/benefitsSlice";
import { useBenefits } from "@/features/benefits";
import type { BenefitData } from "@/shared/types";

export default function TableBenefits() {
  useBenefits();
  const benefits = (useSelector(selectAllBenefits) as BenefitData[]) || [];
  const { onOpen: onOpenCreate } = useModal("createBenefitModal");
  const { onOpen: onOpenDelete } = useModal("deleteBenefitModal");
  const { onOpen: onOpenUpdate } = useModal("updateBenefitModal");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [filterTitle, setFilterTitle] = useState("");
  const rowsPerPage = 10;

  const rows = useMemo(() => {
    const base = Array.isArray(benefits) ? benefits : [];
    if (!filterTitle) return base;
    const term = filterTitle.toLowerCase();
    return base.filter((b) => (b.title || "").toLowerCase().includes(term));
  }, [benefits, filterTitle]);

  const pages = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
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
              Gestión de Beneficios
            </h1>
          </div>
          <div>
            <Button
              className="bg-magenta-fuchsia-900"
              color="secondary"
              size="md"
              startContent={<Plus className="h-4 w-4" />}
              variant="solid"
              onPress={onOpenCreate}
            >
              Nuevo Beneficio
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
            aria-label="Tabla de beneficios"
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
              table: "min-w-[900px]",
              thead: "[&>tr]:first:bg-gray-50 border-b border-gray-200",
              th: "text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 text-left h-12 bg-gray-50",
              td: "py-3 px-4 text-sm border-b border-gray-50 group-last:border-none",
              tr: "hover:bg-gray-50/50 transition-colors duration-200",
            }}
          >
            <TableHeader>
              <TableColumn>TÍTULO</TableColumn>
              <TableColumn>DESCRIPCIÓN</TableColumn>
              <TableColumn>PUNTOS</TableColumn>
              <TableColumn>ESTADO</TableColumn>
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
              {(item: BenefitData) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                      {item.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 font-medium line-clamp-2">
                      {item.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-magenta-fuchsia-50 text-magenta-fuchsia-700">
                      {item.pointsCost} pts
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        item.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.url_image && (
                      <button
                        type="button"
                        aria-label={`Ver imagen de ${item.title}`}
                        className="relative w-12 h-12 rounded-lg overflow-hidden group cursor-zoom-in border border-gray-100 shadow-sm p-0"
                        onClick={() => {
                          setSelectedImage(item.url_image);
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
                          setSelectedId(item._id);
                          onOpenUpdate();
                        }}
                      >
                        <Pencil className="text-yellow-300" height={15} width={15} />
                      </button>
                      <button
                        aria-label="Eliminar"
                        className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 group border-none outline-none focus:outline-none focus:ring-0 active:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setSelectedId(item._id);
                          onOpenDelete();
                        }}
                      >
                        <Trash2 className="text-red-300" height={15} width={15} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ModalCreateBenefit />
      <ModalDeleteBenefit id={selectedId} />
      <ModalUpdateBenefit id={selectedId} />

      <Modal
        backdrop="blur"
        isOpen={isOpen}
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
    </div>
  );
}
