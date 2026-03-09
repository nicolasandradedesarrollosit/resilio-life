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
import { Search } from "lucide-react";

import { apiClient } from "@/shared/services/apiClient";

interface AdminBenefitData {
  _id: string;
  title: string;
  description: string;
  business: { _id: string; name?: string; email?: string } | string;
  pointsCost: number;
  isActive: boolean;
  url_image: string;
  createdAt?: string;
}

export default function TableBenefits() {
  const [benefits, setBenefits] = useState<AdminBenefitData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterTitle, setFilterTitle] = useState("");
  const rowsPerPage = 10;

  useEffect(() => {
    apiClient
      .get<{ data: AdminBenefitData[] }>("/admin/benefits")
      .then((res) => setBenefits(res.data ?? []))
      .catch(() => setBenefits([]))
      .finally(() => setIsLoading(false));
  }, []);

  const rows = useMemo(() => {
    if (!filterTitle) return benefits;
    const term = filterTitle.toLowerCase();

    return benefits.filter((b) => (b.title || "").toLowerCase().includes(term));
  }, [benefits, filterTitle]);

  const pages = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return rows.slice(start, start + rowsPerPage);
  }, [page, rows]);

  useEffect(() => {
    setPage(1);
  }, [filterTitle]);

  const getBusinessName = (business: AdminBenefitData["business"]) => {
    if (typeof business === "object" && business !== null) {
      return business.name || business.email || business._id;
    }

    return String(business);
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 mt-6 max-w-[100vw]">
      <div className="flex flex-col gap-6 w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="ml-12 text-2xl font-bold text-gray-800">
              Beneficios del Sistema
            </h1>
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
                    onChange={(p) => setPage(p)}
                  />
                </div>
              ) : null
            }
            classNames={{
              base: "overflow-visible",
              table: "min-w-[800px]",
              thead: "[&>tr]:first:bg-gray-50 border-b border-gray-200",
              th: "text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 text-left h-12 bg-gray-50",
              td: "py-3 px-4 text-sm border-b border-gray-50 group-last:border-none",
              tr: "hover:bg-gray-50/50 transition-colors duration-200",
            }}
          >
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>NEGOCIO</TableColumn>
              <TableColumn>PUNTOS</TableColumn>
              <TableColumn>ESTADO</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                isLoading ? (
                  <div className="py-12 text-center text-gray-500">
                    Cargando beneficios...
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="bg-gray-50 rounded-full p-4 mb-3">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No se encontraron resultados
                    </p>
                  </div>
                )
              }
              items={items}
            >
              {(item: AdminBenefitData) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <span className="font-semibold text-gray-900">
                      {item.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600">
                      {getBusinessName(item.business)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 font-medium">
                      {item.pointsCost} pts
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
