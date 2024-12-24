export const changeLikeCount = (postState:any) =>{
    if (postState.likedByUser===true) {
        const newPost = {
            ...postState, 
            likedByUser: false, 
            _count:{
                ...postState._count,
                 likes : postState._count.likes - 1 
            }}
         return newPost
         } else {
            const newPost = {
                ...postState, 
                likedByUser: true, 
                _count:{
                    ...postState._count,
                     likes : postState._count.likes + 1 
                }}
             return newPost
             };
};