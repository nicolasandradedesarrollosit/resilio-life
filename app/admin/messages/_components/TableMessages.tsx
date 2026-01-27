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

import { selectAllMessages } from "@/redux/messageSlice";

export default function TableMessages() {
  const messages = useSelector(selectAllMessages);

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const rowsPerPage = 10;

  const rows = useMemo(() => {
    let filtered = messages;

    if (filter) {
      const term = filter.toLowerCase();

      filtered = messages.filter(
        (m) =>
          (m.name || "").toLowerCase().includes(term) ||
          (m.email || "").toLowerCase().includes(term) ||
          (m.subject || "").toLowerCase().includes(term),
      );
    }

    return filtered.map((m, idx) => ({
      ...m,
      key: m.id || (m as any)._id || `msg-${idx}`,
    }));
  }, [messages, filter]);

  const pages = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows.slice(start, end);
  }, [page, rows]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 mt-6 max-w-[100vw]">
      <div className="flex flex-col gap-6 w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="ml-12 text-2xl font-bold text-gray-800">
              Gestión de Mensajes
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
              placeholder="Buscar..."
              radius="lg"
              size="md"
              startContent={<Search className="h-4 w-4 text-gray-400" />}
              value={filter}
              variant="bordered"
              onChange={(e) => setFilter((e.target as HTMLInputElement).value)}
              onClear={() => setFilter("")}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
          <Table
            removeWrapper
            aria-label="Tabla de mensajes"
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
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>ASUNTO</TableColumn>
              <TableColumn>MENSAJE</TableColumn>
              <TableColumn>ORIGEN</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="bg-gray-50 rounded-full p-4 mb-3">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    No se encontraron mensajes
                  </p>
                </div>
              }
              items={items}
            >
              {(item: any) => (
                <TableRow key={(item as any).key}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                        {item.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 font-medium whitespace-nowrap">
                      {item.email}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-800 font-medium whitespace-nowrap">
                      {item.subject}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div
                      className="max-w-md truncate text-gray-600"
                      title={item.message}
                    >
                      {item.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                      {item.origin}
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

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
