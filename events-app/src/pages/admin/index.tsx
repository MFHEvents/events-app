'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, DataTableFilterMeta } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { FilterMatchMode } from 'primereact/api'
import { Paginator } from 'primereact/paginator'
import { IEvent } from '../../models/Event'
import { formatDate } from '../../lib/utils'
import Header from '../../components/Header';


export default function AdminPage() {
    const [events, setEvents] = useState<IEvent[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('')
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(10)
    const router = useRouter()

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events')
                const data = await response.json()
                if (data.success) {
                    setEvents(data.data)
                }
                setLoading(false)
            } catch (error) {
                console.error('Error fetching events:', error)
                setLoading(false)
            }
        }
        fetchEvents()
    }, [])

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'] = { value, matchMode: FilterMatchMode.CONTAINS }; // Correct structure for filter

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const statusBodyTemplate = (rowData: IEvent) => {
        return (
            <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${rowData.isRecurring ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}
            >
                {rowData.isRecurring ? 'Recurring' : 'One-time'}
            </span>
        )
    }

    const feeBodyTemplate = (rowData: IEvent) => {
        return rowData.fee ? `$${rowData.fee}` : 'Free'
    }

    const dateBodyTemplate = (rowData: IEvent) => {
        return formatDate(rowData.date)
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold mb-8">Manage Events</h2>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Keyword Search"
                        style={{ width: '300px', paddingLeft: '2rem' }} 
                    />
                </span>
            </div>
        )
    }

    const onPageChange = (event: any) => {
        setFirst(event.first)
        setRows(event.rows)
    }

    const header = renderHeader()

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 pt-24 pb-8">
                <div className="mb-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                    <Button
                        label="Create Event"
                        icon="pi pi-star"
                        className="p-card-button"
                        onClick={() => router.push('/admin/create')}
                    />
                </div>

                <div className="card">
                    <DataTable
                        value={events}
                        rows={rows}
                        first={first}
                        onPage={onPageChange}
                        dataKey="id"
                        filters={filters}
                        filterDisplay="menu"
                        loading={loading}
                        globalFilterFields={['title', 'location', 'status']}
                        header={header}
                        emptyMessage="No events found."
                        className="p-datatable-lg"
                    >
                        <Column field="title" header="Event Name" sortable style={{ minWidth: '14rem' }} />
                        <Column field="date" header="Start Date" body={dateBodyTemplate} sortable style={{ minWidth: '8rem' }} />
                        <Column field="location" header="Location" sortable style={{ minWidth: '10rem' }} />
                        <Column field="fee" header="Fee" body={feeBodyTemplate} sortable style={{ minWidth: '8rem' }} />
                        <Column field="isRecurring" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '8rem' }} />
                    </DataTable>

                    <Paginator
                        first={first}
                        rows={rows}
                        totalRecords={events.length}
                        onPageChange={onPageChange}
                    />
                </div>
            </main>
        </div>
    )
}
