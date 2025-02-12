import ProfileCreationForm from "@/components/ui/profile-spep-form/profile_step_form";
import QueryProvider from "@/util/QueryProvider";


export default function CreateProfilePage() {
  return (
    <QueryProvider>
      <ProfileCreationForm />
    </QueryProvider>

  )
  
}

