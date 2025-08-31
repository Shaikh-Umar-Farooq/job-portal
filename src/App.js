import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, GraduationCap, Building2, ChevronLeft, ExternalLink, Loader2 } from 'lucide-react';

// Supabase configuration - Replace with your actual credentials
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.REACT_APP_SUPABASE_SERVICE_KEY;

// Supabase client
const supabaseClient = {
  from: (table) => ({
    select: (columns = '*') => ({
      then: async (callback) => {
        try {
          const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}`, {
            headers: {
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          callback(data);
        } catch (error) {
          console.error('Error fetching data:', error);
          // Mock data for demonstration
          const mockJobs = [
            {
              id: 13,
              company_name: 'Atomberg',
              designation: 'Intern',
              location: 'Pune, India',
              batch: '2026/2025',
              apply_link: 'https://atomberg.darwinbox.in/ms/candidatev2/main/careers/jobDetails/a68ad78c452674',
              created_at: '2025-08-31T14:46:59.88029+00:00'
            },
            {
              id: 14,
              company_name: 'TechCorp',
              designation: 'Software Developer',
              location: 'Bangalore, India',
              batch: '2025/2024',
              apply_link: 'https://techcorp.com/apply/14',
              created_at: '2025-08-30T10:30:00.000Z'
            },
            {
              id: 15,
              company_name: 'StartupX',
              designation: 'Product Manager Intern',
              location: 'Mumbai, India',
              batch: '2026',
              apply_link: 'https://startupx.com/careers/15',
              created_at: '2025-08-29T16:45:30.000Z'
            },
            {
              id: 16,
              company_name: 'DataScience Inc',
              designation: 'Data Analyst',
              location: 'Hyderabad, India',
              batch: '2025',
              apply_link: 'https://datascience.com/jobs/16',
              created_at: '2025-08-28T09:15:22.000Z'
            }
          ];
          callback(mockJobs);
        }
      }
    }),
    eq: (column, value) => ({
      single: () => ({
        then: async (callback) => {
          try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/jobs?${column}=eq.${value}`, {
              headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json'
              }
            });
            const data = await response.json();
            callback(data[0]);
          } catch (error) {
            console.error('Error fetching job:', error);
            // Mock single job for demonstration
            const mockJob = {
              id: parseInt(value),
              company_name: 'Atomberg',
              designation: 'Intern',
              location: 'Pune, India',
              batch: '2026/2025',
              apply_link: 'https://atomberg.darwinbox.in/ms/candidatev2/main/careers/jobDetails/a68ad78c452674',
              created_at: '2025-08-31T14:46:59.88029+00:00'
            };
            callback(mockJob);
          }
        }
      })
    })
  })
};

// Simple router hook
const useRouter = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };
  
  return { currentPath, navigate };
};

// Job Card Component
const JobCard = ({ job, onViewApplyLink }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {job.designation}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <Building2 size={16} className="mr-2" />
              <span className="font-medium">{job.company_name}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <GraduationCap size={16} className="mr-2" />
            <span>Batch: {job.batch}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(job.created_at)}</span>
          </div>
          <button
            onClick={() => onViewApplyLink(job.id)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            View Apply Link
          </button>
        </div>
      </div>
    </div>
  );
};

// Job Listings Page
const JobListings = ({ onViewApplyLink }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        supabaseClient.from('jobs').select('*').then((data) => {
          setJobs(data);
          setLoading(false);
        });
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Hire Box</h1>
            <p className="text-gray-600 mt-2">Discover your next career move</p>
          </div>
        </div>
      </header>

      {/* Job Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onViewApplyLink={onViewApplyLink}
            />
          ))}
        </div>
        
        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No job openings available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
};

// Loading Progress Component
const LoadingProgress = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Connecting to job portal...",
    "Verifying application link...",
    "Preparing your redirect...",
    "Almost ready..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 10;
      });
    }, 1000);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [steps.length]);

  return (
    <div className="text-center">
      <div className="mb-4">
        <Loader2 className="animate-spin h-8 w-8 text-rose-600 mx-auto mb-2" />
        <p className="text-gray-700 font-medium">{steps[currentStep]}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className="bg-rose-600 h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-500">{progress}% complete</p>
    </div>
  );
};

// Job Detail Page
const JobDetail = ({ jobId, onBack }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [canApply, setCanApply] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        supabaseClient.from('jobs').eq('id', jobId).single().then((data) => {
          setJob(data);
          setLoading(false);
        });
      } catch (error) {
        console.error('Error fetching job:', error);
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const handleApplyClick = () => {
    setShowLoading(true);
    setCanApply(false);

    // 10 second loading simulation
    setTimeout(() => {
      setShowLoading(false);
      setCanApply(true);
    }, 10000);
  };

  const handleRedirect = () => {
    if (job?.apply_link) {
      window.open(job.apply_link, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <button 
            onClick={onBack}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <button 
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back to Jobs
            </button>
          </div>
        </div>
      </header>

      {/* Job Detail Card */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
          <div className="p-8">
            {/* Job Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.designation}</h1>
              <div className="flex items-center justify-center mb-2">
                <Building2 size={20} className="mr-2 text-gray-600" />
                <span className="text-xl font-semibold text-gray-800">{job.company_name}</span>
              </div>
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="text-rose-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Location</p>
                  <p className="text-gray-900 font-semibold">{job.location}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <GraduationCap className="text-rose-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Batch</p>
                  <p className="text-gray-900 font-semibold">{job.batch}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg md:col-span-2">
                <Calendar className="text-rose-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Posted</p>
                  <p className="text-gray-900 font-semibold">{formatDate(job.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Apply Section */}
            <div className="border-t border-gray-200 pt-8">
              {!showLoading && !canApply && (
                <button
                  onClick={handleApplyClick}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
                >
                  Apply Now
                </button>
              )}

              {showLoading && (
                <div className="py-8">
                  <LoadingProgress />
                </div>
              )}

              {canApply && (
                <button
                  onClick={handleRedirect}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg flex items-center justify-center"
                >
                  Apply Now
                  <ExternalLink size={20} className="ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Main App Component
const App = () => {
  const { currentPath, navigate } = useRouter();

  const handleViewApplyLink = (jobId) => {
    navigate(`/${jobId}`);
  };

  const handleBackToJobs = () => {
    navigate('/');
  };

  // Parse job ID from current path
  const jobId = currentPath !== '/' ? parseInt(currentPath.substring(1)) : null;

  return (
    <div className="font-sans">
      {currentPath === '/' ? (
        <JobListings onViewApplyLink={handleViewApplyLink} />
      ) : (
        <JobDetail jobId={jobId} onBack={handleBackToJobs} />
      )}
    </div>
  );
};

export default App;