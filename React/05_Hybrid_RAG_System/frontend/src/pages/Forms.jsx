import React, { useState } from 'react';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Save } from 'lucide-react';

export default function Forms() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Forms & Inputs</h1>
           <p className="mt-1 text-sm text-slate-500">Professional input layouts and validations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader title="General Information" description="Please fill in your valid details." />
                <CardBody>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <Input label="First Name" placeholder="e.g. John" />
                             <Input label="Last Name" placeholder="e.g. Doe" />
                        </div>
                        <Input label="Email Address" type="email" placeholder="john@example.com" />
                        <Input label="Company" placeholder="Acme Inc." />
                        
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                             <select className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white">
                                <option>Administrator</option>
                                <option>Editor</option>
                                <option>Viewer</option>
                             </select>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100 mt-4 flex justify-end">
                             <Button startIcon={<Save className="w-4 h-4"/>}>Save Changes</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>

            <div className="space-y-6">
                <Card>
                    <CardHeader title="Account Preferences" />
                    <CardBody>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900">Email Notifications</h4>
                                    <p className="text-xs text-slate-500">Receive daily digest of activities.</p>
                                </div>
                                <div className="flex items-center">
                                     <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900">Two-Factor Authentication</h4>
                                    <p className="text-xs text-slate-500">Log in with an extra layer of security.</p>
                                </div>
                                <div className="flex items-center">
                                     <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader title="Interactive Elements" />
                    <CardBody className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Button>Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="danger">Danger</Button>
                            <Button variant="ghost">Ghost Button</Button>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <Button onClick={() => setModalOpen(true)} className="w-full">Open Confirmation Modal</Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>

        <Modal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
            title="Confirmation Required"
            footer={
                <>
                    <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button onClick={() => setModalOpen(false)}>Confirm Action</Button>
                </>
            }
        >
            <p className="text-slate-600">
                Are you sure you want to proceed with this action? 
                This will update your system preferences and cannot be undone immediately.
            </p>
        </Modal>
    </div>
  );
}
