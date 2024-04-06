// pages/profile/[id].tsx
import { useCurrentUser } from '@/hooks/use-current-user';
import { getAllUsers } from '@/lib/auth';
import { GetServerSideProps } from 'next';

export async function getStaticPaths() {

  const profile = await getAllUsers();
  const paths = profile.map((profile) => ({
    params: { id: profile.id.toString() },
  }));

  return { paths, fallback: 'blocking' };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Assuming you have some authentication mechanism


  // Fetch user data, posts, and gallery based on the user ID, excluding sensitive info
  const profile = await getAllUsers();
 
 
  return { props: { profile } ,revalidate: 3600,};
};
export default function Products({ profile }) {
  return (
    <ul>
      {profile.map((profile) => (
        <li key={profile.id}>{profile.name}</li>
      ))}
    </ul>
  );
}