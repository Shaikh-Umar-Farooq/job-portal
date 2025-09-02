import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, GraduationCap, Building2, ChevronLeft, ExternalLink, Loader2, Search, X } from 'lucide-react';

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
          // Mock data for demonstration (ordered by newest first)
          const mockJobs = [
            {
              id: 16,
              company_name: 'DataScience Inc',
              designation: 'Data Analyst',
              location: 'Hyderabad, India',
              batch: '2025',
              apply_link: 'https://datascience.com/jobs/16',
              created_at: '2025-01-03T09:15:22.000Z'
            },
            {
              id: 15,
              company_name: 'StartupX',
              designation: 'Product Manager Intern',
              location: 'Mumbai, India',
              batch: '2026',
              apply_link: 'https://startupx.com/careers/15',
              created_at: '2025-01-02T16:45:30.000Z'
            },
            {
              id: 14,
              company_name: 'TechCorp',
              designation: 'Software Developer',
              location: 'Bangalore, India',
              batch: '2025/2024',
              apply_link: 'https://techcorp.com/apply/14',
              created_at: '2025-01-01T10:30:00.000Z'
            },
            {
              id: 13,
              company_name: 'Atomberg',
              designation: 'Intern',
              location: 'Pune, India',
              batch: '2026/2025',
              apply_link: 'https://atomberg.darwinbox.in/ms/candidatev2/main/careers/jobDetails/a68ad78c452674',
              created_at: '2024-12-31T14:46:59.88029+00:00'
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

  // Track page views when path changes
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-RXF8SWX704', {
        page_path: currentPath,
      });
    }
  }, [currentPath]);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  return { currentPath, navigate };
};

// Job Card Component with SEO optimization
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
    <article className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group" itemScope itemType="https://schema.org/JobPosting">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2" itemProp="title">
              {job.designation}
            </h3>
            <div className="flex items-center text-gray-600 mb-2" itemProp="hiringOrganization" itemScope itemType="https://schema.org/Organization">
              <Building2 size={16} className="mr-2" />
              <span className="font-medium" itemProp="name">{job.company_name}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600" itemProp="jobLocation" itemScope itemType="https://schema.org/Place">
            <MapPin size={16} className="mr-2" />
            <span itemProp="address">{job.location}</span>
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
            <time className="sr-only" itemProp="datePosted" dateTime={job.created_at}>{job.created_at}</time>
          </div>
          <button
            onClick={() => onViewApplyLink(job.id)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            aria-label={`View application details for ${job.designation} at ${job.company_name}`}
          >
            View Apply Link
          </button>
        </div>
        
        {/* Hidden SEO elements */}
        <div className="sr-only">
          <span itemProp="description">{job.designation} position at {job.company_name} in {job.location}</span>
          <span itemProp="employmentType">{job.designation.toLowerCase().includes('intern') ? 'INTERN' : 'FULL_TIME'}</span>
          <span itemProp="url">https://hirebox.netlify.app/{job.id}</span>
        </div>
      </div>
    </article>
  );
};

// Job Listings Page
const JobListings = ({ onViewApplyLink, navigate }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter jobs based on search query
  const filterJobs = (jobsList, query) => {
    if (!query.trim()) {
      return jobsList;
    }

    const searchTerm = query.toLowerCase().trim();
    return jobsList.filter(job => 
      job.company_name.toLowerCase().includes(searchTerm) ||
      job.designation.toLowerCase().includes(searchTerm) ||
      job.location.toLowerCase().includes(searchTerm) ||
      job.batch.toLowerCase().includes(searchTerm)
    );
  };

  // Update filtered jobs when search query or jobs change
  useEffect(() => {
    const filtered = filterJobs(jobs, searchQuery);
    setFilteredJobs(filtered);
  }, [jobs, searchQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Generate structured data for job listings
  const generateJobStructuredData = (jobs) => {
    const jobListings = jobs.map(job => ({
      "@type": "JobPosting",
      "title": job.designation,
      "description": `${job.designation} position at ${job.company_name} in ${job.location}`,
      "datePosted": job.created_at,
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.company_name
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.location
        }
      },
      "employmentType": job.designation.toLowerCase().includes('intern') ? 'INTERN' : 'FULL_TIME',
      "url": `https://hirebox.netlify.app/${job.id}`,
      "applicationContact": {
        "@type": "ContactPoint",
        "url": job.apply_link
      }
    }));

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": jobListings.map((job, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": job
      }))
    };
  };

  // Add structured data to page head and reset title
  useEffect(() => {
    // Reset page title and description for home page
    document.title = 'HireBox - Find Latest Jobs & Internships | Job Portal for Students & Professionals';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover the latest job opportunities and internships from top companies. HireBox aggregates openings for students and professionals - making your job search simple, fast, and reliable.');
    }

    if (jobs.length > 0) {
      const structuredData = generateJobStructuredData(jobs);
      
      // Remove existing job structured data
      const existingScript = document.querySelector('script[data-type="job-listings"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-type', 'job-listings');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [jobs]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        supabaseClient.from('jobs').select('*').then((data) => {
          // Sort jobs by creation date in descending order (newest first)
          const sortedJobs = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setJobs(sortedJobs);
          setFilteredJobs(sortedJobs);
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
      <header className="bg-white border-b border-gray-200 top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center">
            <img
              src="/logo.png"
              alt="HireBox - Job Portal Logo"
              className="w-14 h-14 rounded-full mr-4 border border-gray-200 shadow-sm object-cover"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">HireBox</h1>
              <p className="text-gray-600">Find Latest Jobs & Internships from Top Companies</p>
            </div>
          </div>
        </div>
      </header>

            {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SEO Content Section */}
        <section className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Latest Opportunities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore verified job openings and internship opportunities from leading companies.
          </p>
        </section>

        {/* Search Section - Airbnb Inspired */}
        <section className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex-1 flex items-center pl-6 pr-2 py-4">
                  <Search size={20} className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search by company, role, location, or batch..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full text-gray-700 placeholder-gray-400 bg-transparent outline-none text-base"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Clear search"
                    >
                      <X size={16} className="text-gray-400" />
                    </button>
                  )}
                </div>
                <button className="bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-full mr-2 transition-colors">
                  <Search size={20} />
                </button>
              </div>
            </div>
            
            {/* Search Results Summary */}
            {searchQuery && (
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
                  {filteredJobs.length} {filteredJobs.length === 1 ? 'result' : 'results'} found for "{searchQuery}"
                  {filteredJobs.length === 0 && (
                    <span className="block mt-1 text-gray-500">
                      Try searching with different keywords like company name, job title, location, or batch year
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </section>

  {/* Top Banner Ad */}
  <div className="mb-6">
    <div className="w-full h-16 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm">
      Ad Space (728x90 / 320x50)
    </div>
  </div>

     {/* Job Grid */}
   <section aria-label="Job listings">
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {filteredJobs.map((job, index) => (
        <>
          <JobCard
            key={job.id}
            job={job}
            onViewApplyLink={onViewApplyLink}
          />
          
          {/* In-grid Ad after 2nd, 5th, then every 3rd card after that */}
          {((index === 0) || (index === 3) || (index > 4 && (index - 1) % 3 === 0)) && (
            <div className="bg-white border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm ">
              Sponsored Ad (Job-style native ad)
            </div>
          )}
        </>
      ))}

             {filteredJobs.length === 0 && jobs.length > 0 && (
         <div className="text-center py-12 col-span-full">
           <p className="text-gray-500 text-lg">No jobs match your search criteria.</p>
           <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms or clearing the search.</p>
         </div>
       )}
       
       {jobs.length === 0 && !loading && (
         <div className="text-center py-12 col-span-full">
           <p className="text-gray-500 text-lg">No job openings available at the moment.</p>
         </div>
       )}
    </div>
  </section>

  {/* Bottom Banner Ad */}
  <div className="mt-8">
    <div className="w-full h-16 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm">
      Ad Space (728x90 / 320x50)
    </div>
  </div>
</main>

      <Footer navigate={navigate} />
    </div>
  );
};

// Footer Component
const Footer = ({ navigate }) => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo and Brand */}
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-2xl font-bold mr-2">Hire Box</span>
        </div>
        {/* Navigation Links */}
        <nav className="flex flex-wrap gap-4 text-gray-600 text-sm font-medium">
          <button onClick={() => navigate('/about')} className="hover:text-rose-600 transition-colors">About Us</button>
          <button
            onClick={() => window.location.href = 'mailto:smuf7080@gmail.com'}
            className="hover:text-rose-600 transition-colors"
          >
            Contact Us
          </button>
          <button onClick={() => navigate('/privacy')} className="hover:text-rose-600 transition-colors">Privacy Policy</button>
          <button onClick={() => navigate('/terms')} className="hover:text-rose-600 transition-colors">Terms of Service</button>
        </nav>
        {/* Socials */}
        <div className="flex gap-4">
          <a
            href="https://whatsapp.com/channel/0029Vb64a7WIXnltVG74Nt0x"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-gray-500 hover:text-green-500 transition-colors"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <g>
                <path fill="currentColor" d="M12.004 2.003a9.99 9.99 0 0 0-8.66 14.98l-1.32 4.01a1 1 0 0 0 1.26 1.26l4.01-1.32a9.99 9.99 0 1 0 4.71-18.93zm0 2a8 8 0 1 1 0 16 7.96 7.96 0 0 1-4.09-1.13l-.29-.17-2.38.78.78-2.38-.17-.29A8 8 0 0 1 12.004 4.003zm4.13 10.47c-.22-.11-1.3-.64-1.5-.71-.2-.07-.34-.11-.48.11-.14.22-.55.71-.67.85-.12.14-.25.16-.47.05-.22-.11-.93-.34-1.77-1.09-.66-.59-1.1-1.31-1.23-1.53-.13-.22-.01-.34.1-.45.1-.1.22-.25.33-.37.11-.12.14-.22.22-.36.07-.14.04-.27-.02-.38-.07-.11-.48-1.16-.66-1.59-.17-.41-.34-.35-.48-.36-.12-.01-.27-.01-.42-.01a.81.81 0 0 0-.59.27c-.2.22-.77.75-.77 1.83 0 1.08.79 2.13.9 2.28.11.15 1.56 2.38 3.78 3.24.53.18.94.29 1.26.37.53.13 1.01.11 1.39.07.43-.05 1.3-.53 1.48-1.04.18-.51.18-.95.13-1.04-.05-.09-.2-.14-.42-.25z" />
              </g>
            </svg>
          </a>
          <a
            href="https://www.instagram.com/hire.box"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-gray-500 hover:text-pink-500 transition-colors"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <g>
                <rect width="18" height="18" x="3" y="3" rx="5" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                <circle cx="17" cy="7" r="1.2" fill="currentColor" />
              </g>
            </svg>
          </a>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 pb-4">
        &copy; {new Date().getFullYear()} Hire Box. All rights reserved.
      </div>
    </footer>
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

// About Us Page
const AboutPage = ({ onBack }) => {
  // Update page title for SEO
  React.useEffect(() => {
    document.title = 'About HireBox - Job Portal for Students & Professionals';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about HireBox - A job and internship listing platform that helps students and professionals quickly discover opportunities from different companies.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900  transition-colors"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back to Jobs
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
          <div className="prose max-w-none">
            <p className="text-gray-600 text-lg">
            <p>At <strong>HireBox</strong>, our mission is simple — to make job and internship opportunities easy to discover, accessible, and trustworthy.</p>
    <p>We understand how frustrating it can be to spend hours searching across multiple platforms, only to find outdated or irrelevant listings. That’s why we created HireBox — a <strong>centralized platform</strong> where students, graduates, and professionals can quickly explore <strong>genuine and up-to-date openings</strong> from leading companies.</p>
    <p>Unlike traditional portals, HireBox does not require lengthy sign-ups or complicated processes. We focus on keeping things <strong>simple, fast, and reliable</strong>:</p>
    <ul>
      <li>Curated job and internship listings from trusted sources.</li>
      <li>Essential details at a glance for quick decisions.</li>
      <li>Direct apply links that take you to official company portals.</li>
    </ul>
    <p>Our vision is to become the go-to platform for anyone looking to take the next step in their career, whether it’s a first internship, a graduate job, or a professional career move.</p>
    <p>At HireBox, we believe your next opportunity should be just a click away.</p>

            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Privacy Policy Page
const PrivacyPage = ({ onBack }) => {
  // Update page title for SEO
  React.useEffect(() => {
    document.title = 'Privacy Policy - HireBox Job Portal';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read HireBox Privacy Policy. Learn how we collect, use, and protect your personal information when using our job portal platform.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900  transition-colors"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back to Jobs
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <div className="prose max-w-none">
            <p className="text-gray-600 text-lg">
              <p>At <strong>HireBox</strong>, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website.</p>

              <h2>1. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul>
                <li><strong>Personal Information:</strong> Such as your name and email address when you contact us.</li>
                <li><strong>Non-Personal Information:</strong> Such as browser type, device information, and usage data collected automatically.</li>
                <li><strong>Job Application Data:</strong> We do not store sensitive application details; we only provide apply links to official company portals.</li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <ul>
                <li>To improve website functionality and user experience.</li>
                <li>To personalize content and job recommendations.</li>
                <li>To communicate with you if you contact us.</li>
                <li>To serve relevant advertisements via third-party networks (such as Google AdSense).</li>
              </ul>

              <h2>3. Cookies & Tracking Technologies</h2>
              <p>HireBox uses cookies and similar technologies to enhance user experience. These may include:</p>
              <ul>
                <li>Google AdSense cookies for personalized ads.</li>
                <li>Analytics tools (e.g., Google Analytics) to track website performance.</li>
              </ul>
              <p>You can disable cookies in your browser settings if you prefer.</p>

              <h2>4. Third-Party Services</h2>
              <p>We may display ads from third-party ad networks such as Google AdSense. These providers may use cookies and collect data about your browsing activities to show relevant ads. We do not control the data collected by these advertisers.</p>

              <h2>5. Data Security</h2>
              <p>We implement reasonable security measures to protect your information. However, no system is 100% secure, and we cannot guarantee absolute security.</p>

              <h2>6. Links to Other Websites</h2>
              <p>Our website may contain links to third-party job portals and external sites. We are not responsible for the privacy practices of those websites.</p>

              <h2>7. Children’s Privacy</h2>
              <p>HireBox does not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us.</p>

              <h2>8. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information by contacting us at <strong>[smuf7080@gmail.com]</strong>.</p>

              <h2>9. Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised "Last Updated" date.</p>

              <h2>10. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <p><strong>Email:</strong> smuf7080@gmail.com</p>
              <p><strong>Last Updated:</strong> September 2025</p>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Terms of Service Page
const TermsPage = ({ onBack }) => {
  // Update page title for SEO
  React.useEffect(() => {
    document.title = 'Terms of Service - HireBox Job Portal';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read HireBox Terms of Service. Understand our terms and conditions for using our job portal platform to find jobs and internships.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900  transition-colors"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back to Jobs
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <div className="prose max-w-none">
            <p className="text-gray-600 text-lg">
              <p>Welcome to <strong>HireBox</strong>. By accessing or using our website, you agree to comply with and be bound by the following Terms of Service. Please read them carefully before using our site.</p>

              <h2>1. Use of Our Website</h2>
              <ul>
                <li>You agree to use HireBox only for lawful purposes.</li>
                <li>You must not misuse or attempt to disrupt the website or its services.</li>
                <li>Content on HireBox is provided for informational purposes and should not be considered professional advice.</li>
              </ul>

              <h2>2. Job Listings</h2>
              <ul>
                <li>HireBox aggregates and shares job opportunities from external sources.</li>
                <li>We do not guarantee the authenticity, accuracy, or availability of any job listed.</li>
                <li>Applications are redirected to official company portals or trusted external sites. We do not process or store job applications directly.</li>
              </ul>

              <h2>3. Intellectual Property</h2>
              <p>All content, design, and branding on HireBox are the property of HireBox and may not be copied, reproduced, or distributed without permission.</p>

              <h2>4. Third-Party Links</h2>
              <p>Our website may contain links to third-party websites. We are not responsible for the content, policies, or practices of these external websites.</p>

              <h2>5. Advertisements</h2>
              <p>HireBox may display advertisements through Google AdSense or other ad networks. We are not responsible for the products or services promoted in these ads.</p>

              <h2>6. Limitation of Liability</h2>
              <p>HireBox is not liable for any loss, damage, or inconvenience arising from the use of our website, reliance on job listings, or third-party services.</p>

              <h2>7. Changes to Terms</h2>
              <p>We may update these Terms of Service from time to time. Continued use of HireBox after changes are posted means you accept the updated terms.</p>

              <h2>8. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of India.</p>

              <h2>9. Contact Us</h2>
              <p>If you have any questions regarding these Terms, please contact us at:</p>
              <p><strong>Email:</strong> smuf7080@gmail.com</p>
              <p><strong>Last Updated:</strong> September 2025</p>

            </p>
          </div>
        </div>
      </main>
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
          
          // Update page title and meta description for SEO
          if (data) {
            document.title = `${data.designation} at ${data.company_name} - HireBox Job Portal`;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
              metaDescription.setAttribute('content', `Apply for ${data.designation} position at ${data.company_name} in ${data.location}. Find job details and application link on HireBox.`);
            }
          }
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
    // Track apply button click
    if (window.gtag) {
      window.gtag('event', 'apply_click', {
        event_category: 'engagement',
        event_label: `${job?.company_name} - ${job?.designation}`,
        value: job?.id
      });
    }

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
      // Track successful application redirect
      if (window.gtag) {
        window.gtag('event', 'apply_redirect', {
          event_category: 'conversion',
          event_label: `${job?.company_name} - ${job?.designation}`,
          value: job?.id
        });
      }

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
          <h2 className="text-2xl font-bold text-gray-900 ">Job Not Found</h2>
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
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back to Jobs
            </button>
          </div>
        </div>
      </header>

      {/* Job Detail Card */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <div className="bg-white rounded-2xl shadow-sm">
    <div className="p-4 sm:p-6 space-y-6">

      {/* Job Title & Company */}
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{job.designation}</h1>
        <p className="text-gray-600 mt-1 flex items-center justify-center">
          <Building2 size={16} className="mr-1 text-gray-500" />
          {job.company_name}
        </p>
      </div>

      {/* Job Meta (inline style for compactness) */}
      <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-6 text-sm text-gray-700 space-y-2 sm:space-y-0">
        <span className="flex items-center">
          <MapPin size={16} className="mr-1 text-rose-600" /> {job.location}
        </span>
        <span className="flex items-center">
          <GraduationCap size={16} className="mr-1 text-rose-600" /> {job.batch}
        </span>
        <span className="flex items-center">
          <Calendar size={16} className="mr-1 text-rose-600" /> {formatDate(job.created_at)}
        </span>
      </div>

      {/* Ad Slot (Airbnb-style inline ad, light background) */}
      <div className="w-full h-14 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
        Ad Space (320x50 / 468x60)
      </div>

      {/* Apply Button Section */}
      <div className="pt-2">
        {!showLoading && !canApply && (
          <button
            onClick={handleApplyClick}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 rounded-xl transition-colors text-base"
          >
            Get Apply Link
          </button>
        )}

        {showLoading && (
          <div className="py-6">
            <LoadingProgress />
          </div>
        )}

        {canApply && (
          <button
            onClick={handleRedirect}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-colors text-base flex items-center justify-center"
          >
            Apply Now
            <ExternalLink size={18} className="ml-2" />
          </button>
        )}
      </div>

      {/* Optional Bottom Ad */}
      <div className="w-full h-14 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
        Ad Space (Sticky / Bottom Banner)
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
  const getJobIdFromPath = (path) => {
    if (path === '/' || path === '/about' || path === '/privacy' || path === '/terms') {
      return null;
    }
    return parseInt(path.substring(1));
  };

  const jobId = getJobIdFromPath(currentPath);

  return (
    <div className="font-sans">
      {currentPath === '/' ? (
        <JobListings onViewApplyLink={handleViewApplyLink} navigate={navigate} />
      ) : currentPath === '/about' ? (
        <AboutPage onBack={handleBackToJobs} />
      ) : currentPath === '/privacy' ? (
        <PrivacyPage onBack={handleBackToJobs} />
      ) : currentPath === '/terms' ? (
        <TermsPage onBack={handleBackToJobs} />
      ) : jobId ? (
        <JobDetail jobId={jobId} onBack={handleBackToJobs} />
      ) : (
        <JobListings onViewApplyLink={handleViewApplyLink} navigate={navigate} />
      )}
    </div>
  );
};

export default App;