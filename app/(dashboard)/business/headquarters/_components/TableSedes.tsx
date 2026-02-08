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

import ModalCreateSede from "./ModalCreateSede";
import ModalDeleteSede from "./ModalDeleteSede";
import ModalUpdateSede from "./ModalUpdateSede";

import { useModal } from "@/shared/hooks";
import { selectAllHeadquarters } from "@/features/headquarters/headquartersSlice";
import type { HeadquartersData } from "@/shared/types";

export default function TableSedes() {
  const headquarters = (useSelector(selectAllHeadquarters) as HeadquartersData[]) || [];
  const { onOpen: onOpenCreate } = useModal("createSedeModal");
  const { onOpen: onOpenDelete } = useModal("deleteSedeModal");
  const { onOpen: onOpenUpdate } = useModal("updateSedeModal");
  const [selectedId, setSelectedId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [filterName, setFilterName] = useState("");
  const rowsPerPage = 10;

  const rows = useMemo(() => {
    const base = Array.isArray(headquarters) ? headquarters : [];
    if (!filterName) return base;
    const term = filterName.toLowerCase();
    return base.filter((h) => (h.name || "").toLowerCase().includes(term));
  }, [headquarters, filterName]);

  const pages = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [page, rows]);

  useEffect(() => {
    setPage(1);
  }, [filterName]);

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 mt-6 max-w-[100vw]">
      <div className="flex flex-col gap-6 w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="ml-12 text-2xl font-bold text-gray-800">
              Gestión de Sedes
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
              Nueva Sede
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
              placeholder="Buscar por nombre..."
              radius="lg"
              size="md"
              startContent={<Search className="h-4 w-4 text-gray-400" />}
              value={filterName}
              variant="bordered"
              onChange={(e) =>
                setFilterName((e.target as HTMLInputElement).value)
              }
              onClear={() => setFilterName("")}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
          <Table
            removeWrapper
            aria-label="Tabla de sedes"
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
              table: "min-w-[700px]",
              thead: "[&>tr]:first:bg-gray-50 border-b border-gray-200",
              th: "text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 text-left h-12 bg-gray-50",
              td: "py-3 px-4 text-sm border-b border-gray-50 group-last:border-none",
              tr: "hover:bg-gray-50/50 transition-colors duration-200",
            }}
          >
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>LATITUD</TableColumn>
              <TableColumn>LONGITUD</TableColumn>
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
              {(item: HeadquartersData) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                      {item.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 font-medium">
                      {item.coordinates?.[0]?.toFixed(4) ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 font-medium">
                      {item.coordinates?.[1]?.toFixed(4) ?? "—"}
                    </span>
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
      <ModalCreateSede />
      <ModalDeleteSede id={selectedId} />
      <ModalUpdateSede id={selectedId} />
    </div>
  );
}
