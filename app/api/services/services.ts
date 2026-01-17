import { userRequest } from '../v1/axios';

// Use env var or fallback to the one provided in your previous file
export const finalUrl = process.env.NEXT_PUBLIC_API_URL || 'https://yt.jinskadamthodu.com/public';

// --- Interfaces for Type Safety ---

export interface ServiceItem {
  id: number;
  position: number;
  [key: string]: any;
}

export interface NewsletterResponse {
  ok: boolean;
  data: any;
  error?: any;
}

export interface ContactEnquiryData {
  name: string;
  email: string;
  message: string;
  [key: string]: any;
}

export interface JobApplicationData {
  name: string;
  email: string;
  resume: File;
  [key: string]: any;
}

// --- API Methods ---

// Get all posters
export const getAllPosters = async () => {
  try {
    const res = await userRequest.get(`${finalUrl}/api/loader-images`);
    return res.data || {};
  } catch (error: any) {
    console.error('Error while retrieving posters:', error.response);
    throw error;
  }
};

// Get all services
export const getServices = async (): Promise<ServiceItem[]> => {
  try {
    const res = await userRequest.get(`${finalUrl}/api/services`);
    // Ensure data.data exists before sorting
    const services = res.data?.data || [];
    return services.sort((a: ServiceItem, b: ServiceItem) => a.position - b.position);
  } catch (error: any) {
    console.error('Error while retrieving services:', error.response);
    throw error;
  }
};

export const getFeaturedWorks = async () => {
  try {
    const res = await userRequest.get(`${finalUrl}/api/featured-works`);
    return res.data.data || [];
  } catch (error: any) {
    console.error('Error while retrieving featured works:', error.response);
    throw error;
  }
};

// Get a single film poster design by id
export const getFilmPosterDesignById = async (id: string | number) => {
  const res = await fetch(`${finalUrl}/api/film-poster-designs/${id}`);
  if (!res.ok) throw new Error('Failed to fetch film poster design by id');
  return res.json();
};

// Get all film poster designs
export const getFilmPosterDesigns = async () => {
  const res = await fetch(`${finalUrl}/api/film-poster-designs/all`);
  if (!res.ok) throw new Error('Failed to fetch film poster designs');
  return res.json();
};

// Get page header (video/image) by name
export const getPageHeader = async () => {
  const res = await fetch(`${finalUrl}/api/page-headers/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Film Poster Design' }),
  });
  if (!res.ok) throw new Error('Failed to fetch page header');
  return res.json();
};

// Newsletter subscription
export const postNewsletterSubscription = async (email: string): Promise<NewsletterResponse> => {
  try {
    const res = await fetch(`${finalUrl}/api/newsletter-subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  } catch (error) {
    return { ok: false, data: {}, error };
  }
};

export const postEnquiry = async (data: ContactEnquiryData) => {
  try {
    const res = await userRequest.post(`${finalUrl}/api/contact-enquiries`, data);
    return res.data;
  } catch (error: any) {
    console.error('Error while sending enquiry:', error.response);
    throw error;
  }
};

export const postCareer = async (data: FormData) => {
  try {
    // Note: 'data' should be FormData if uploading files
    const res = await userRequest.post(`${finalUrl}/api/job-applications`, data);
    return res.data;
  } catch (error: any) {
    console.error('Error while sending job application:', error.response);
    throw error;
  }
};

export const fetchVisionImages = async () => {
  const res = await fetch(`${finalUrl}/api/vision-images/all`);
  if (!res.ok) throw new Error('Failed to fetch vision images');
  return res.json();
};

export const fetchTeamMembersPhotos = async () => {
  const res = await fetch(`${finalUrl}/api/employee-photos/all`);
  if (!res.ok) throw new Error('Failed to fetch team members');
  return res.json();
};

export const getCareers = async () => {
  try {
    const res = await userRequest.get(`${finalUrl}/api/careers/all`);
    return res.data;
  } catch (error: any) {
    console.error('Error while retrieving careers:', error.response);
    throw error;
  }
};

export const getGallery = async () => {
  try {
    const res = await userRequest.get(`${finalUrl}/api/gallery`);
    return res.data;
  } catch (error: any) {
    console.error('Error while retrieving gallery:', error.response);
    throw error;
  }
};

export const getClients = async () => {
  try {
    const res = await userRequest.get(`${finalUrl}/api/clients`);
    return res.data;
  } catch (error: any) {
    console.error('Error while retrieving clients:', error.response);
    throw error;
  }
};

// --- Legacy / Specific UI API Calls ---

export const getTeamMembers = async () => {
  try {
    const res = await userRequest.get(`${finalUrl}/api/public/active-team-members`);
    return res.data;
  } catch (error: any) {
    console.error('Error while retrieving team members:', error.response);
    throw error;
  }
};

export const getVisionMission = async () => {
  try {
    const res = await userRequest.get(`${finalUrl}/api/public/active-vision-mission-images`);
    return res.data;
  } catch (error: any) {
    console.error('Error while retrieving vision mission:', error.response);
    throw error;
  }
};