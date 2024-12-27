import { useState, useEffect, useRef } from 'react'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    image: ''
  })
  const [imagePreview, setImagePreview] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Fetch all users dengan better error handling
  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const response = await fetch('http://localhost:3000/api/users');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Users fetched successfully:', data.length);
      setUsers(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', {
        message: error.message,
        stack: error.stack
      });
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const compressImage = (imageFile) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Hitung aspek rasio untuk mempertahankan proporsi
          const maxDimension = 1200; // Tingkatkan max dimension
          if (width > height) {
            if (width > maxDimension) {
              height *= maxDimension / width;
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width *= maxDimension / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          // Tambahkan smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Kompresi lebih agresif untuk file besar
          let quality = 0.7; // Default quality
          const maxSize = 1024 * 1024 * 2; // 2MB target size

          let compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          
          // Kompresi progresif jika masih terlalu besar
          while (compressedBase64.length > maxSize && quality > 0.1) {
            quality -= 0.1;
            compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(compressedBase64);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(imageFile);
    });
  };

  // Update handleImageChange
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const compressedImage = await compressImage(file);
        setFormData(prev => ({ ...prev, image: compressedImage }));
        setImagePreview(compressedImage);
        
        // Tampilkan ukuran file
        const sizeInMB = (compressedImage.length * 0.75) / (1024 * 1024);
        console.log(`Compressed image size: ${sizeInMB.toFixed(2)}MB`);
        
      } catch (error) {
        console.error('Error compressing image:', error);
        setError('Failed to process image. Please try another one.');
      }
    }
  };

  // Handle submit dengan better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('Please fill all required fields');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate image size
      if (formData.image && formData.image.length > 1024 * 1024 * 5) { // 5MB limit
        throw new Error('Image size too large. Please choose a smaller image or reduce quality');
      }

      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      // Success handling
      await fetchUsers();
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
        image: ''
      });
      setImagePreview('');
      alert('User created successfully!');

    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message);
    }
  };

  // Add sorting function
  const sortUsers = (a, b) => {
    if (sortField === 'totalPoints') {
      return sortDirection === 'asc' ? 
        a.totalPoints - b.totalPoints : 
        b.totalPoints - a.totalPoints;
    }
    
    return sortDirection === 'asc' ? 
      a[sortField].localeCompare(b[sortField]) : 
      b[sortField].localeCompare(a[sortField]);
  };

  // Add filter function
  const filterUsers = (user) => {
    if (filterRole === 'all') return true;
    return user.role === filterRole;
  };

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users
    .filter(filterUsers)
    .sort(sortUsers)
    .slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-6 space-y-8 mt-16">
      {/* Show error message if exists */}
      {error && (
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/5 rounded-lg blur-lg" />
          <div className="relative p-4 rounded-lg border border-red-500/10 bg-red-500/10">
            <div className="flex items-center gap-2 text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Show loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <>
          {/* Header dengan efek gradient */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 blur-xl" />
            <div className="relative flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <p className="text-gray-400 mt-1">Manage system users and their roles</p>
              </div>
              <button 
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                {showForm ? 'Cancel' : 'Add New User'}
              </button>
            </div>
          </div>

          {/* Add User Form dengan animasi */}
          {showForm && (
            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 rounded-xl blur-xl" />
              <div className="relative bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Add New User
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image Upload dengan preview circular */}
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-xs text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                      >
                        {imagePreview ? 'Change' : 'Upload'}
                      </button>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white/70 mb-1">Profile Image</h3>
                      <p className="text-xs text-white/40">Upload a profile picture for the user</p>
                    </div>
                  </div>

                  {/* Form Grid dengan hover effects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-white/70 mb-1">Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-white transition-all"
                          placeholder="Enter name"
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-white transition-all"
                          placeholder="Enter email"
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-white transition-all"
                          placeholder="Enter password"
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-white/70 mb-1">Role</label>
                      <div className="relative">
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-white transition-all"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                      <span>Create User</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Users Table dengan optimized rendering */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 rounded-xl blur-xl" />
            <div className="relative bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4">
                        <button 
                          onClick={() => {
                            setSortField('name');
                            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                          }}
                          className="flex items-center gap-2 text-xs font-medium text-white/40 uppercase tracking-wider"
                        >
                          User
                          {sortField === 'name' && (
                            <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {currentUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className="group hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 overflow-hidden">
                              {user.image ? (
                                <img
                                  src={`data:image/jpeg;base64,${user.image}`}
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/40">
                                  {user.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/60">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`
                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${user.role === 'admin' 
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}
                          `}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/60">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add filter controls */}
          <div className="mb-4 flex gap-4">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-white/5 border border-white/10 rounded px-3 py-1 text-sm text-white"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Add pagination controls */}
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: Math.ceil(users.length / usersPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/5 text-white/60'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default UserManagement 