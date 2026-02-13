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
import { useSelector } from "react-redux";

import { selectAllTransactions } from "@/features/transactions/transactionsSlice";
import type { TransactionData } from "@/shared/types";

export default function TableTransactions() {
  const transactions = (useSelector(selectAllTransactions) as TransactionData[]) || [];
  const [page, setPage] = useState(1);
  const [filterUser, setFilterUser] = useState("");
  const rowsPerPage = 10;

  const rows = useMemo(() => {
    const base = Array.isArray(transactions) ? transactions : [];
    if (!filterUser) return base;
    const term = filterUser.toLowerCase();
    return base.filter(
      (t) =>
        (t.user?.name || "").toLowerCase().includes(term) ||
        (t.user?.lastName || "").toLowerCase().includes(term) ||
        (t.user?.email || "").toLowerCase().includes(term),
    );
  }, [transactions, filterUser]);

  const pages = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [page, rows]);

  useEffect(() => {
    setPage(1);
  }, [filterUser]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 mt-6 max-w-[100vw]">
      <div className="flex flex-col gap-6 w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="ml-12 text-2xl font-bold text-gray-800">
              Transacciones
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
              placeholder="Buscar por usuario..."
              radius="lg"
              size="md"
              startContent={<Search className="h-4 w-4 text-gray-400" />}
              value={filterUser}
              variant="bordered"
              onChange={(e) =>
                setFilterUser((e.target as HTMLInputElement).value)
              }
              onClear={() => setFilterUser("")}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
          <Table
            removeWrapper
            aria-label="Tabla de transacciones"
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
              <TableColumn>USUARIO</TableColumn>
              <TableColumn>CORREO</TableColumn>
              <TableColumn>BENEFICIO</TableColumn>
              <TableColumn>PUNTOS</TableColumn>
              <TableColumn>FECHA</TableColumn>
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
              {(item: TransactionData) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                      {item.user?.name} {item.user?.lastName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 font-medium text-sm">
                      {item.user?.email}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 font-medium text-sm">
                      {item.benefit?.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-magenta-fuchsia-50 text-magenta-fuchsia-700">
                      {item.benefit?.pointsCost} pts
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 text-sm whitespace-nowrap">
                      {formatDate(item.redeemedAt)}
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
