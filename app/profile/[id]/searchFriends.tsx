
import SearchBar from "@/components/search/user/SearchBarWithUrlQuery";
import { usePathname } from "next/navigation";

const SearchUsers = ({search}:{search:string}) => {
    const path = usePathname()
    const combined = `${path}?tab=tab2&`

    return ( 

        <SearchBar search={search} context={combined} />

     );
}
 
export default SearchUsers;

