import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { provinces } from '../../../data/provinces.js';

const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolId: '',
    schoolName: '',
    province: '', // Provinsi user
    bio: '',
    interests: [],
    currentGoal: '',
    profilePicture: null
  });

  const [interestInput, setInterestInput] = useState('');
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [searchSchool, setSearchSchool] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCustomSchool, setIsCustomSchool] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [provinceInput, setProvinceInput] = useState('');
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState([]);

  // Fetch schools from API
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/schools');
        const data = await response.json();
        setSchools(data.schools);
        setFilteredSchools(data.schools);
      } catch (error) {
        console.error('Error fetching schools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  // Filter schools based on search
  useEffect(() => {
    const filtered = schools.filter(school => 
      school.name.toLowerCase().includes(searchSchool.toLowerCase()) ||
      school.city.toLowerCase().includes(searchSchool.toLowerCase()) ||
      school.province.toLowerCase().includes(searchSchool.toLowerCase())
    );
    setFilteredSchools(filtered);
  }, [searchSchool, schools]);

  // Filter provinces based on input
  useEffect(() => {
    if (provinceInput.trim() === '') {
      setFilteredProvinces([]);
      setShowProvinceDropdown(false);
      return;
    }

    const filtered = provinces.filter(province => 
      province.toLowerCase().includes(provinceInput.toLowerCase())
    );
    setFilteredProvinces(filtered);
    setShowProvinceDropdown(filtered.length > 0);
  }, [provinceInput]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSchoolChange = (e) => {
    const value = e.target.value;
    setSearchSchool(value);
    
    if (value === 'custom') {
      setIsCustomSchool(true);
      setFormData({
        ...formData,
        schoolId: '',
        schoolName: ''
      });
    } else {
      const selectedSchool = schools.find(school => school.id === value);
      if (selectedSchool) {
        setIsCustomSchool(false);
        setFormData({
          ...formData,
          schoolId: value,
          schoolName: selectedSchool.name
        });
      }
    }
  };

  const handleInterestKeyDown = (e) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault();
      setFormData({
        ...formData,
        interests: [...formData.interests, interestInput.trim()]
      });
      setInterestInput('');
    }
  };

  const removeInterest = (indexToRemove) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData(prev => ({
          ...prev,
          profilePicture: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (!formData.province) {
      setError('Please select your province!');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare the data
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        schoolId: formData.schoolId,
        schoolName: formData.schoolName,
        province: formData.province,
        bio: formData.bio,
        interests: formData.interests,
        currentGoal: formData.currentGoal,
        profilePicture: formData.profilePicture
      };

      console.log('Sending signup data:', { 
        ...userData, 
        password: '[REDACTED]',
        profilePicture: formData.profilePicture ? '[BASE64_STRING]' : null 
      });

      // Send request to backend
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create account');
      }

      // Redirect to dashboard on success
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Detailed signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4">
      {/* Header with GIF */}
      <div className="text-center mb-6">
        <img 
          src="https://media.giphy.com/media/E8wAYmqKWPTO64G5pG/giphy.gif" 
          alt="Study animation"
          className="w-40 mx-auto mb-3"
        />
        <h2 className="text-xl font-medium text-gray-300">
          Thank you for joining our study society
        </h2>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md bg-black/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-800/50 shadow-2xl">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-700/50 ring-2 ring-indigo-500/50">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover"/>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <input type="file" id="profilePicture" accept="image/*" className="hidden" onChange={handleImageChange}/>
              <label htmlFor="profilePicture" className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-indigo-500/30 rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors focus:outline-none">
                {imagePreview ? 'Change Photo' : 'Upload Photo'}
              </label>
              <p className="mt-1 text-xs text-gray-400">Max: 5MB</p>
            </div>
          </div>

          {/* Form Fields in 2 Columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-300">Full Name</label>
                <input id="name" name="name" type="text" required className="h-9 text-sm appearance-none relative block w-full px-3 border border-gray-700/50 bg-gray-800/30 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-transparent transition-colors" placeholder="John Doe" value={formData.name} onChange={handleChange}/>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">Email</label>
                <input id="email" name="email" type="email" required className="h-9 text-sm appearance-none relative block w-full px-3 border border-gray-700/50 bg-gray-800/30 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-transparent transition-colors" placeholder="john@example.com" value={formData.email} onChange={handleChange}/>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-300">Password</label>
                <input id="password" name="password" type="password" required className="h-9 text-sm appearance-none relative block w-full px-3 border border-gray-700/50 bg-gray-800/30 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-transparent transition-colors" placeholder="••••••••" value={formData.password} onChange={handleChange}/>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-gray-300">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required className="h-9 text-sm appearance-none relative block w-full px-3 border border-gray-700/50 bg-gray-800/30 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-transparent transition-colors" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange}/>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="schoolSearch" className="block text-sm font-medium mb-1 text-gray-300">School</label>
                <div className="relative">
                  <input id="schoolSearch" type="text" className="h-9 text-sm appearance-none relative block w-full px-3 border border-gray-700/50 bg-gray-800/30 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-transparent transition-colors" placeholder="Search school..." value={searchSchool} onChange={(e) => {
                    const value = e.target.value;
                    setSearchSchool(value);
                    if (value.trim() !== '') {
                      setShowDropdown(true);
                    } else {
                      setShowDropdown(false);
                    }
                  }} onFocus={() => {
                    if (searchSchool.trim() !== '') {
                      setShowDropdown(true);
                    }
                  }} onBlur={() => {
                    setTimeout(() => setShowDropdown(false), 200);
                  }}/>
                  {searchSchool && filteredSchools.length > 0 && showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg max-h-32 overflow-auto">
                      {filteredSchools.map((school) => (
                        <div key={school.id} className="px-3 py-2 hover:bg-indigo-500/10 cursor-pointer transition-colors" onClick={() => {
                          setSearchSchool(school.name);
                          setFormData({
                            ...formData,
                            schoolId: school.id,
                            schoolName: school.name
                          });
                          setShowDropdown(false);
                        }} onMouseDown={(e) => e.preventDefault()}>
                          <div className="font-medium text-sm">{school.name}</div>
                          <div className="text-xs text-gray-400">{school.city}, {school.province}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-1 text-gray-300">Bio</label>
                <textarea id="bio" name="bio" rows="2" className="text-sm appearance-none relative block w-full px-3 py-1.5 border border-gray-700/50 bg-gray-800/30 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-transparent transition-colors resize-none" placeholder="Tell us about yourself..." value={formData.bio} onChange={handleChange}/>
              </div>

              <div>
                <label htmlFor="currentGoal" className="block text-sm font-medium mb-1 text-gray-300">What you want to be?</label>
                <input id="currentGoal" name="currentGoal" type="text" className="h-9 text-sm appearance-none relative block w-full px-3 border border-gray-700/50 bg-gray-800/30 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-transparent transition-colors" placeholder="Your goal..." value={formData.currentGoal} onChange={handleChange}/>
              </div>

              <div>
                <label htmlFor="interests" className="block text-sm font-medium mb-1 text-gray-300">Interests</label>
                <input id="interests" type="text" className="h-9 text-sm appearance-none relative block w-full px-3 border border-gray-700/50 bg-gray-800/30 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-transparent transition-colors" placeholder="Press Enter to add..." value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={handleInterestKeyDown}/>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {formData.interests.map((interest, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {interest}
                      <button type="button" onClick={() => removeInterest(index)} className="ml-1 text-indigo-300 hover:text-indigo-200 transition-colors">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="province" className="block text-sm font-medium mb-1 text-gray-300">Province</label>
                <div className="relative">
                  <input
                    id="province"
                    type="text"
                    className="h-9 text-sm appearance-none relative block w-full px-3 border border-gray-700/50 bg-gray-800/30 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-transparent transition-colors"
                    placeholder="Type your province..."
                    value={provinceInput}
                    onChange={(e) => {
                      setProvinceInput(e.target.value);
                      if (e.target.value.trim() === '') {
                        setFormData(prev => ({ ...prev, province: '' }));
                      }
                    }}
                    onFocus={() => {
                      if (provinceInput.trim() !== '') {
                        setShowProvinceDropdown(true);
                      }
                    }}
                  />
                  {showProvinceDropdown && filteredProvinces.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg max-h-48 overflow-auto">
                      {filteredProvinces.map((province) => (
                        <div
                          key={province}
                          className="px-3 py-2 hover:bg-indigo-500/10 cursor-pointer transition-colors"
                          onClick={() => {
                            setProvinceInput(province);
                            setFormData(prev => ({ ...prev, province }));
                            setShowProvinceDropdown(false);
                          }}
                        >
                          <div className="text-sm text-white">{province}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Link to="/login" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Already have an account?
            </Link>
            <button type="submit" disabled={loading} className="flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]">
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 