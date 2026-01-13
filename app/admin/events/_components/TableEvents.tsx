import {Table, TableHeader, TableRow, TableColumn, TableBody, TableCell} from "@heroui/table"
import { Input } from "@heroui/input"
import { Pagination } from "@heroui/pagination"
import { EventData } from "@/types/EventData.type"
import { useMemo, useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useSelector } from "react-redux"
import { selectAllEvents } from "@/redux/eventsSlice"
import { useEvents } from "@/hooks/useEvents"
import { Button } from "@heroui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useModal } from "@/hooks/useModal";
import ModalCreateEvent from "./ModalCreateEvent";

export default function TableEvents() {
    useEvents();
    const events = (useSelector(selectAllEvents) as EventData[]) || [];
    const { onOpen: onOpenEvent } = useModal('createEventModal');
    
    const [page, setPage] = useState(1);
    const [filterTitle, setFilterTitle] = useState("");
    const rowsPerPage = 10;

    const rows = useMemo(() => {
        const baseRows = Array.isArray(events) ? events : [];
        if (!filterTitle) return baseRows;
        const term = filterTitle.toLowerCase();
        return baseRows.filter(u => (u.title || "").toLowerCase().includes(term));
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
                            startContent={<Plus className="h-4 w-4" />}
                            variant="solid"
                            color="secondary"
                            size="md"
                            className="bg-magenta-fuchsia-900"
                            onPress={onOpenEvent}
                        >
                            Nuevo Evento
                        </Button>
                    </div>
                    <div className="w-full md:w-auto">
                        <Input
                            classNames={{
                                base: "w-full md:w-72",
                                inputWrapper: "bg-white border border-gray-200 shadow-sm h-10 data-[hover=true]:bg-white group-data-[focus=true]:bg-white group-data-[focus=true]:border-magenta-fuchsia-500 group-data-[focus=true]:ring-1 group-data-[focus=true]:ring-magenta-fuchsia-500",
                                input: "text-gray-900 placeholder:text-gray-400",
                            }}
                            placeholder="Buscar por título..."
                            startContent={<Search className="h-4 w-4 text-gray-400" />}
                            value={filterTitle}
                            onChange={(e) => setFilterTitle((e.target as HTMLInputElement).value)}
                            radius="lg"
                            isClearable
                            onClear={() => setFilterTitle("")}
                            size="sm"
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
                                        color="secondary"
                                        page={page}
                                        total={pages}
                                        onChange={(page) => setPage(page)}
                                        size="sm"
                                        classNames={{
                                            cursor: "bg-magenta-fuchsia-600 text-white font-bold",
                                        }}
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
                                    <p className="text-gray-500 font-medium">No se encontraron resultados</p>
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
                                            {new Date(item.date).toLocaleDateString('es-ES')}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-gray-600 font-medium whitespace-nowrap">
                                            {item.location}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <a 
                                            href={item.url_provider} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap underline"
                                        >
                                            Ver
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        {item.url_image && (
                                            <img 
                                                src={item.url_image} 
                                                alt={item.title}
                                                className="w-10 h-10 rounded object-cover"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-row gap-4">
                                            <Button
                                                isIconOnly
                                                variant="ghost"
                                                color="warning"
                                                size="sm"
                                                aria-label="Modificar"
                                            >
                                                <Pencil />
                                            </Button>
                                            <Button
                                                isIconOnly
                                                variant="ghost"
                                                color="danger"
                                                size="sm"
                                                aria-label="Eliminar"
                                            >
                                                <Trash2 />
                                            </Button>

                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <ModalCreateEvent />
            
            <style jsx global>{`
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
    )
}