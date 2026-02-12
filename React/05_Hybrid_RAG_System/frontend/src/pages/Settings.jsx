import React from 'react';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
         <div>
           <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
           <p className="mt-1 text-sm text-slate-500">System configuration and preferences.</p>
        </div>
        
        <Card>
            <CardBody className="py-24 text-center">
                 <div className="h-24 w-24 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <SettingsIcon className="w-10 h-10 text-slate-400" />
                 </div>
                 <h3 className="text-lg font-medium text-slate-900">Settings Panel</h3>
                 <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                    This module is currently under development. Detailed system settings will be available here.
                 </p>
            </CardBody>
        </Card>
    </div>
  );
}
