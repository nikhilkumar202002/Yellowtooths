import { userRequest } from '../v1/axios';

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
    const res = await userRequest.get('/loader-images');
    return res.data || {};
  } catch (error: any) {
    console.error('Error while retrieving posters:', error);
    throw error;
  }
};

// Get all services
export const getServices = async (): Promise<ServiceItem[]> => {
  try {
    const res = await userRequest.get('/services');
    const services = res.data?.data || [];
    return services.sort((a: ServiceItem, b: ServiceItem) => a.position - b.position);
  } catch (error: any) {
    console.error('Error while retrieving services:', error);
    throw error;
  }
};

export const getFeaturedWorks = async () => {
  try {
    const res = await userRequest.get('/featured-works');
    return res.data.data || [];
  } catch (error: any) {
    console.error('Error while retrieving featured works:', error);
    throw error;
  }
};

// Get a single film poster design by id
export const getFilmPosterDesignById = async (id: string | number) => {
  try {
    const res = await userRequest.get(`/film-poster-designs/${id}`);
    return res.data;
  } catch (error: any) {
    console.error('Failed to fetch film poster design by id', error);
    throw error;
  }
};

// Get all film poster designs
export const getFilmPosterDesigns = async () => {
  try {
    const res = await userRequest.get('/film-poster-designs/all');
    return res.data;
  } catch (error: any) {
    console.error('Failed to fetch film poster designs', error);
    throw error;
  }
};

// Get page header (video/image) by name
export const getPageHeader = async () => {
  try {
    const res = await userRequest.post('/page-headers/search', { name: 'Film Poster Design' });
    return res.data;
  } catch (error: any) {
    console.error('Failed to fetch page header', error);
    throw error;
  }
};

// Newsletter subscription
export const postNewsletterSubscription = async (email: string): Promise<NewsletterResponse> => {
  try {
    const res = await userRequest.post('/newsletter-subscribers', { email });
    // Axios throws on 4xx/5xx by default, so if we are here, it's likely a 2xx
    return { ok: true, data: res.data };
  } catch (error: any) {
    return { ok: false, data: {}, error };
  }
};

export const postEnquiry = async (data: ContactEnquiryData) => {
  try {
    const res = await userRequest.post('/contact-enquiries', data);
    return res.data;
  } catch (error: any) {
    console.error('Error while sending enquiry:', error);
    throw error;
  }
};

export const postCareer = async (data: FormData) => {
  try {
    const res = await userRequest.post('/job-applications', data);
    return res.data;
  } catch (error: any) {
    console.error('Error while sending job application:', error);
    throw error;
  }
};

export const fetchVisionImages = async () => {
  try {
    const res = await userRequest.get('/vision-images/all');
    return res.data;
  } catch (error: any) {
    console.error('Failed to fetch vision images', error);
    throw error;
  }
};

export const fetchTeamMembersPhotos = async () => {
  try {
    const res = await userRequest.get('/employee-photos/all');
    return res.data;
  } catch (error: any) {
    console.error('Failed to fetch team members', error);
    throw error;
  }
};

export const getCareers = async () => {
  try {
    const res = await userRequest.get('/careers/all');
    return res.data;
  } catch (error: any) {
    console.error('Error while retrieving careers:', error);
    throw error;
  }
};

export const getGallery = async () => {
  try {
    const res = await userRequest.get('/gallery');
    return res.data;
  } catch (error: any) {
    console.error('Error while retrieving gallery:', error);
    throw error;
  }
};

export const getClients = async () => {
  try {
    const res = await userRequest.get('/clients');
    return res.data;
  } catch (error: any) {
    console.error('Error while retrieving clients:', error);
    throw error;
  }
};

// --- Legacy / Specific UI API Calls ---

export const getTeamMembers = async () => {
  try {
    // If your route is 'api/public/active-team-members', keep '/public/...'
    // If your route is just 'api/active-team-members', change this to '/active-team-members'
    const res = await userRequest.get('/public/active-team-members');
    return res.data;
  } catch (error: any) {
    console.error('Error while retrieving team members:', error);
    throw error;
  }
};

export const getVisionMission = async () => {
  try {
    // If your route is 'api/public/active-vision-mission-images', keep '/public/...'
    // If your route is just 'api/active-vision-mission-images', change this to '/active-vision-mission-images'
    const res = await userRequest.get('/public/active-vision-mission-images');
    return res.data;
  } catch (error: any) {
    console.error('Error while retrieving vision mission:', error);
    throw error;
  }
};