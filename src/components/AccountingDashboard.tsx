import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  FileText, 
  Users, 
  CreditCard,
  ArrowRight,
  Plus
} from 'lucide-react';

export const AccountingDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounting Dashboard</h1>
          <p className="text-gray-600">
            Overview of your financial data
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
          >
            <Plus size={16} />
            New Transaction
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg flex items-center gap-2"
          >
            <FileText size={16} />
            Reports
          </motion.button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <DollarSign size={24} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center">
              <TrendingUp size={16} className="mr-1" />
              +12.5%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">$24,780.00</p>
          <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-red-100">
              <CreditCard size={24} className="text-red-600" />
            </div>
            <span className="text-sm font-medium text-red-600 flex items-center">
              <TrendingDown size={16} className="mr-1" />
              -3.2%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Expenses</h3>
          <p className="text-2xl font-bold text-gray-900">$18,340.00</p>
          <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-100">
              <BarChart3 size={24} className="text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center">
              <TrendingUp size={16} className="mr-1" />
              +5.4%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Net Profit</h3>
          <p className="text-2xl font-bold text-gray-900">$6,440.00</p>
          <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-100">
              <Users size={24} className="text-purple-600" />
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center">
              <TrendingUp size={16} className="mr-1" />
              +2
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Clients</h3>
          <p className="text-2xl font-bold text-gray-900">24</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <motion.button
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View All
            <ArrowRight size={14} />
          </motion.button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2023-05-15</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Client Payment - ABC Corp</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sales Revenue</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+$2,500.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Posted</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2023-05-12</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Office Supplies</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Office Expenses</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">-$125.50</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Posted</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2023-05-10</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Monthly Rent</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rent Expense</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">-$1,200.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Posted</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2023-05-08</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Client Payment - XYZ Ltd</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sales Revenue</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">+$1,750.00</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Posted</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2023-05-05</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Utility Bills</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Utilities Expense</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">-$245.75</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Posted</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Payments</h2>
            <motion.button
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View All
              <ArrowRight size={14} />
            </motion.button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Office Rent</p>
                <p className="text-sm text-gray-500">Due in 5 days</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">$1,200.00</p>
                <p className="text-xs text-gray-500">May 30, 2023</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Internet Service</p>
                <p className="text-sm text-gray-500">Due in 8 days</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">$89.99</p>
                <p className="text-xs text-gray-500">June 2, 2023</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Vendor Payment - ABC Supplies</p>
                <p className="text-sm text-gray-500">Due in 12 days</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">$750.00</p>
                <p className="text-xs text-gray-500">June 6, 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Balances */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Account Balances</h2>
            <motion.button
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View All
              <ArrowRight size={14} />
            </motion.button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-md">
                  <DollarSign size={16} className="text-blue-600" />
                </div>
                <p className="font-medium text-gray-900">Checking Account</p>
              </div>
              <p className="font-medium text-gray-900">$12,458.32</p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-md">
                  <DollarSign size={16} className="text-purple-600" />
                </div>
                <p className="font-medium text-gray-900">Savings Account</p>
              </div>
              <p className="font-medium text-gray-900">$35,720.00</p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-md">
                  <DollarSign size={16} className="text-green-600" />
                </div>
                <p className="font-medium text-gray-900">Business Credit Card</p>
              </div>
              <p className="font-medium text-red-600">-$2,350.45</p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-md">
                  <DollarSign size={16} className="text-yellow-600" />
                </div>
                <p className="font-medium text-gray-900">Petty Cash</p>
              </div>
              <p className="font-medium text-gray-900">$350.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingDashboard;