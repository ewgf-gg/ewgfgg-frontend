import { Metadata } from 'next';
import SupportPageContent from './SupportPageContent';
import { fetchDonorPageData } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Donate | ewgf.gg',
  description: 'Donate to ewgf.gg and help us keep the site running for the Tekken community.',
};

export default async function DonatePage() {
  const donorData = await fetchDonorPageData();
  
  return <SupportPageContent donorData={donorData} />;
}
