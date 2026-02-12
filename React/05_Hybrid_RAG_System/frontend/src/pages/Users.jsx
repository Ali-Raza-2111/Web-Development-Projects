import React from 'react';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/common/Table';
import Button from '../components/common/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Users() {
  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Users</h1>
                <p className="mt-1 text-sm text-slate-500">Manage user access and permissions.</p>
            </div>
            <Button startIcon={<Plus className="w-4 h-4"/>}>Add New User</Button>
        </div>

        <Card>
            <CardBody className="p-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1,2,3,4,5,6].map((user) => (
                            <TableRow key={user}>
                                <TableCell className="font-medium text-slate-900">
                                    <div className="flex items-center">
                                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 mr-3">
                                            UD
                                        </div>
                                        <div>
                                            <div className="font-medium">User Demo {user}</div>
                                            <div className="text-xs text-slate-500">user{user}@enterprise.com</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-slate-600">Administrator</span>
                                </TableCell>
                                <TableCell>Oct 24, 2023</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        Active
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button variant="ghost" size="sm" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                {/* Pagination UI */}
                <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-700">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of <span className="font-medium">20</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <a href="#" className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                                    <span className="sr-only">Previous</span>
                                     Prev
                                </a>
                                <a href="#" aria-current="page" className="relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">1</a>
                                <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">2</a>
                                <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">3</a>
                                <a href="#" className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                                    <span className="sr-only">Next</span>
                                    Next
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    </div>
  );
}
