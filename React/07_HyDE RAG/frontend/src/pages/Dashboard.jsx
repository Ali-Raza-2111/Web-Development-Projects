import React from 'react';
import Card, { CardHeader, CardBody } from '../components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/common/Table';
import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

const stats = [
    { name: 'Total Revenue', value: '$45,231', change: '+20.1%', icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { name: 'Active Users', value: '+2,338', change: '-1.2%', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { name: 'New Orders', value: '+12,234', change: '+19%', icon: ShoppingCart, color: 'bg-orange-100 text-orange-600' },
    { name: 'Conversion Rate', value: '2.4%', change: '+4.5%', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
       <div>
         <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
         <p className="mt-1 text-sm text-slate-500">Overview of your system performance.</p>
       </div>

       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
             <Card key={item.name} className="flex items-center p-5 hover:shadow-md transition-shadow">
                 <div className={`flex-shrink-0 p-3 rounded-lg ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                 </div>
                 <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-slate-500 truncate">{item.name}</dt>
                        <dd>
                            <div className="text-xl font-bold text-slate-900">{item.value}</div>
                            <span className={`text-xs font-medium ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                {item.change} from last month
                            </span>
                        </dd>
                    </dl>
                 </div>
             </Card>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <Card className="h-full">
              <CardHeader title="Recent Transactions" description="Latest financial operations." />
              <CardBody className="p-0 overflow-hidden">
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Transaction</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1,2,3,4,5].map((i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium text-slate-900">Payment to Vendor {i}</TableCell>
                                <TableCell>Oct {i + 10}, 2023</TableCell>
                                <TableCell>${(120.00 * i).toFixed(2)}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Completed
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
              </CardBody>
           </Card>

           <Card className="h-full">
                <CardHeader title="System Notices" description="Important alerts and updates." />
                <CardBody>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex-shrink-0">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">System Maintenance Scheduled</p>
                                    <p className="text-sm text-slate-500 mt-1">The system will be undergoing maintenance on Oct {20+i} active from 2:00 AM to 4:00 AM.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardBody>
           </Card>
       </div>
    </div>
  );
}
