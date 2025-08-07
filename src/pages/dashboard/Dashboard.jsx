import { Fragment, useState } from "react";

const Dashboard = () => {
  // Mock data - replace with real data from your API
  const [selectedMonth, setSelectedMonth] = useState("January 2025");
  
  const monthlyData = {
    mostSoldProduct: {
      name: "Medium - 180cm",
      quantity: 145,
      revenue: 29000,
      trend: "+12%"
    },
    earnings: {
      earned: 156750,
      pending: 34200,
      total: 190950,
      trend: "+8.5%"
    },
    topStock: [
      { size: "Large", height: "200cm", quantity: 89, value: 178000 },
      { size: "Medium", height: "180cm", quantity: 67, value: 134000 },
      { size: "Small", height: "160cm", quantity: 52, value: 104000 },
      { size: "XL", height: "220cm", quantity: 41, value: 123000 }
    ]
  };

  const months = [
    "January 2025", "December 2024", "November 2024", "October 2024",
    "September 2024", "August 2024", "July 2024", "June 2024"
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-[#1E2228] backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#BEF264] mb-2">
                  Dashboard Overview
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  Track your business performance and inventory insights
                </p>
              </div>
              
              {/* Month Selector */}
              <div className="relative">
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-zinc-950/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#BEF264] focus:border-transparent"
                >
                  {months.map((month) => (
                    <option key={month} value={month} className="bg-zinc-900">
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Revenue Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Money Earned Card */}
            <div className="bg-[#1E2228] backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:border-green-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <i className="ri-money-rupee-circle-line text-2xl text-green-400"></i>
                </div>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  {monthlyData.earnings.trend}
                </span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Money Earned</h3>
              <p className="text-2xl font-bold text-white mb-2">
                {formatCurrency(monthlyData.earnings.earned)}
              </p>
              <p className="text-xs text-gray-500">This month</p>
            </div>

            {/* Money Pending Card */}
            <div className="bg-[#1E2228] backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:border-orange-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <i className="ri-time-line text-2xl text-orange-400"></i>
                </div>
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                  Pending
                </span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Money Pending</h3>
              <p className="text-2xl font-bold text-white mb-2">
                {formatCurrency(monthlyData.earnings.pending)}
              </p>
              <p className="text-xs text-gray-500">Outstanding amount</p>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-[#1E2228] backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:border-[#BEF264]/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#BEF264]/10 rounded-lg">
                  <i className="ri-bar-chart-box-line text-2xl text-[#BEF264]"></i>
                </div>
                <span className="text-xs bg-[#BEF264]/20 text-[#BEF264] px-2 py-1 rounded-full">
                  Total
                </span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">Total Revenue</h3>
              <p className="text-2xl font-bold text-white mb-2">
                {formatCurrency(monthlyData.earnings.total)}
              </p>
              <p className="text-xs text-gray-500">Earned + Pending</p>
            </div>
          </div>

          {/* Main Content Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Most Sold Product */}
            <div className="bg-[#1E2228] backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Most Sold Product</h2>
                <div className="p-2 bg-[#BEF264]/10 rounded-lg">
                  <i className="ri-trophy-line text-xl text-[#BEF264]"></i>
                </div>
              </div>
              
              <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">
                      {monthlyData.mostSoldProduct.name}
                    </h3>
                    <p className="text-gray-400 text-sm">Product Specification</p>
                  </div>
                  <span className="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                    {monthlyData.mostSoldProduct.trend}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Units Sold</p>
                    <p className="text-xl font-bold text-[#BEF264]">
                      {monthlyData.mostSoldProduct.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Revenue Generated</p>
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(monthlyData.mostSoldProduct.revenue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Stock Items */}
            <div className="bg-[#1E2228] backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Top Stock Items</h2>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <i className="ri-stack-line text-xl text-blue-400"></i>
                </div>
              </div>
              
              <div className="space-y-3">
                {monthlyData.topStock.map((item, index) => (
                  <div key={index} className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-700 hover:border-zinc-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-[#BEF264]/20 text-[#BEF264]' :
                          index === 1 ? 'bg-blue-500/20 text-blue-400' :
                          index === 2 ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-sm">
                            {item.size} - {item.height}
                          </h4>
                          <p className="text-gray-400 text-xs">
                            {item.quantity} units • {formatCurrency(item.value)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium text-sm">{item.quantity}</p>
                        <p className="text-gray-400 text-xs">In Stock</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1E2228] backdrop-blur-sm border border-zinc-800 rounded-xl p-4 text-center">
              <div className="p-3 bg-purple-500/10 rounded-lg w-fit mx-auto mb-3">
                <i className="ri-shopping-cart-line text-xl text-purple-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">324</h3>
              <p className="text-gray-400 text-xs">Total Orders</p>
            </div>
            
            <div className="bg-[#1E2228] backdrop-blur-sm border border-zinc-800 rounded-xl p-4 text-center">
              <div className="p-3 bg-red-500/10 rounded-lg w-fit mx-auto mb-3">
                <i className="ri-box-line text-xl text-red-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">1,248</h3>
              <p className="text-gray-400 text-xs">Total Products</p>
            </div>
            
            <div className="bg-[#1E2228] backdrop-blur-sm border border-zinc-800 rounded-xl p-4 text-center">
              <div className="p-3 bg-yellow-500/10 rounded-lg w-fit mx-auto mb-3">
                <i className="ri-user-line text-xl text-yellow-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">89</h3>
              <p className="text-gray-400 text-xs">Active Customers</p>
            </div>
            
            <div className="bg-[#1E2228] backdrop-blur-sm border border-zinc-800 rounded-xl p-4 text-center">
              <div className="p-3 bg-cyan-500/10 rounded-lg w-fit mx-auto mb-3">
                <i className="ri-percent-line text-xl text-cyan-400"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">94.5%</h3>
              <p className="text-gray-400 text-xs">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;