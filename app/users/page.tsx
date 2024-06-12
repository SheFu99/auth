'use server'

import { getUserListByName } from "@/actions/search/users";
import RepostHeader from "@/components/profile/post/Repost-author-header";
import SearchBar from "@/components/search/user/SearchBarWithUrlQuery";

import { Fragment } from "react";

const SearchPage = async ({searchParams}) => {
    const search = 
    typeof searchParams.search === 'string' ? searchParams.search : undefined
    const toLowerCase = search?.toLowerCase()
    const getUser = await getUserListByName({name:search ,pageParams:1})
    console.log(toLowerCase)
    return (

        <div>
            <h1>SearchParams:{search}</h1>   
            <SearchBar search={search} context="/users"/>
            <h2>Result:</h2>
             {getUser?.postResult?.map(user=>(
            <Fragment key={user.id}>
                <p>Name: {user.name}</p>
                <RepostHeader 
                    userId={user.id}
                    userName={user.name}
                    userImage={user.image}
                    />
            </Fragment>
            ))}
        </div>
      );
}
 
export default SearchPage;