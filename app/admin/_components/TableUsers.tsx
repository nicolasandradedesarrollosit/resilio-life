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
import { Button } from "@heroui/button";
import { Paperclip } from "lucide-react";
import { addToast } from "@heroui/toast";

import { useApi } from "@/shared/hooks";
import { selectAllUsers } from "@/features/allUsers/allUserSlice";
import type { UserData } from "@/shared/types";

export default function TableUsers() {
  const users = useSelector(selectAllUsers);
  const [isLoadingUnilink, setIsLoadingUnilink] = useState(false);

  const [page, setPage] = useState(1);
  const [filterEmail, setFilterEmail] = useState("");
  const rowsPerPage = 10;

  const rows = useMemo(() => {
    if (!filterEmail) return users;
    const term = filterEmail.toLowerCase();

    return users.filter((u) => (u.email || "").toLowerCase().includes(term));
  }, [users, filterEmail]);

  const pages = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows.slice(start, end);
  }, [page, rows]);

  useEffect(() => {
    setPage(1);
  }, [filterEmail]);

  const { data: unilinkBusiness, refetch: refetchUnilinkBusiness } = useApi({
    endpoint: "/create-unilink",
    method: "GET",
    enabled: false,
  });

  useEffect(() => {
    const handleUnilinkResponse = async () => {
    if (unilinkBusiness?.data?.token) {
      console.log(unilinkBusiness.data.token);
      const url = `${process.env.NEXT_PUBLIC_APP_URL}/register-business/${unilinkBusiness.data.token}`;
      if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

      addToast({
        title: "Unilink creado",
        description: "El enlace ha sido copiado al portapapeles",
        color: "success",
      });
    }
    setIsLoadingUnilink(false);
  };

  handleUnilinkResponse();
  }, [unilinkBusiness]);

  const handleUnilinkBusiness = async () => {
    setIsLoadingUnilink(true);
    await refetchUnilinkBusiness();
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 mt-6 max-w-[100vw]">
      <div className="flex flex-col gap-6 w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="ml-12 text-2xl font-bold text-gray-800">
              Gestión de Usuarios
            </h1>
          </div>
          <Button
            className="bg-magenta-fuchsia-900 text-white"
            color="primary"
            isLoading={isLoadingUnilink}
            startContent={<Paperclip className="h-4 w-4" />}
            variant="solid"
            onPress={() => {
              handleUnilinkBusiness();
            }}
          >
            Unilink de negocio
          </Button>
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
              placeholder="Buscar por email..."
              radius="lg"
              size="md"
              startContent={<Search className="h-4 w-4 text-gray-400" />}
              value={filterEmail}
              variant="bordered"
              onChange={(e) =>
                setFilterEmail((e.target as HTMLInputElement).value)
              }
              onClear={() => setFilterEmail("")}
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
          <Table
            removeWrapper
            aria-label="Tabla de usuarios"
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
              <TableColumn>USUARIO</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>ROL</TableColumn>
              <TableColumn>SUSCRIPCIÓN</TableColumn>
              <TableColumn>ESTADO EMAIL</TableColumn>
              <TableColumn>ESTADO CUENTA</TableColumn>
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
              {(item: UserData) => (
                <TableRow key={item.id || item.email}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                        {item.name} {item.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 font-medium whitespace-nowrap">
                      {item.email}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border whitespace-nowrap ${
                        item.isAdmin
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : item.isInfluencer
                            ? "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {item.isAdmin
                        ? "Admin"
                        : item.isInfluencer
                          ? "Influencer"
                          : "Usuario"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border whitespace-nowrap ${
                        item.isPremium
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {item.isPremium ? "Premium" : "Gratis"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap ${
                        item.email_verified
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.email_verified
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      <span className="text-xs font-medium">
                        {item.email_verified ? "Verificado" : "Pendiente"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap ${
                        item.is_banned ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.is_banned ? "bg-red-500" : "bg-emerald-500"
                        }`}
                      />
                      <span className="text-xs font-medium">
                        {item.is_banned ? "Baneado" : "Activo"}
                      </span>
                    </div>
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
