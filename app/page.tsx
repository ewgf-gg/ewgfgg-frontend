import { Suspense } from 'react';
import { getInitialData } from '../lib/api';
import HomeContent from '../components/HomeContent';
import Loading from '../components/loading';

// Revalidate cache every 60 seconds
export const revalidate = 60;


export default async function HomePage() {
  // Fetch data at the server level
  const initialData = await getInitialData();
  
  return (
    <Suspense fallback={<Loading />}>
      <HomeContent initialData={initialData} />
    </Suspense>
  );
}
