// pages/profile/[id].tsx
import { useCurrentUser } from '@/hooks/use-current-user';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Assuming you have some authentication mechanism
  const user = useCurrentUser();
  if (!user) {
    // Redirect unauthenticated requests
    return { redirect: { destination: '/login', permanent: false } };
  }

  const { id } = context.params;
  // Fetch user data, posts, and gallery based on the user ID, excluding sensitive info
  const profile = await fetchUserProfile(id);
  const posts = await fetchUserPosts(id);
  const gallery = await fetchUserGallery(id);

  return { props: { profile, posts, gallery } };
};
