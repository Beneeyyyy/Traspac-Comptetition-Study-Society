import React from 'react'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage your educational content</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10">
            <h3 className="text-white/60 text-sm">Total Categories</h3>
            <p className="text-2xl font-bold">3</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10">
            <h3 className="text-white/60 text-sm">Total Materials</h3>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10">
            <h3 className="text-white/60 text-sm">Total Users</h3>
            <p className="text-2xl font-bold">156</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10">
            <h3 className="text-white/60 text-sm">Total Points Given</h3>
            <p className="text-2xl font-bold">2.4k</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/categories"
            className="p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <h3 className="font-semibold mb-2">Manage Categories</h3>
            <p className="text-sm text-gray-400">Add or edit course categories</p>
          </Link>

          <Link to="/admin/subcategories"
            className="p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <h3 className="font-semibold mb-2">Manage Subcategories</h3>
            <p className="text-sm text-gray-400">Organize categories into subcategories</p>
          </Link>

          <Link 
            to="/admin/materials"
            className="p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <h3 className="font-semibold mb-2">Manage Materials</h3>
            <p className="text-sm text-gray-400">Create and organize learning materials</p>
          </Link>
        
          <Link 
            to="/admin/users"
            className="p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors text-left"
          >
            <h3 className="font-semibold mb-2">User Management</h3>
            <p className="text-sm text-gray-400">Manage user accounts and permissions</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 