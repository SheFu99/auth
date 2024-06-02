export const changeLikeCount = (postState) =>{
                if (postState.likedByUser===true) {
                    const newPost = {
                        ...postState, 
                        likedByUser: false, 
                        _count:{
                            ...postState._count,
                             likes : postState._count.likes - 1 
                        }}
                        console.log(newPost)
                     return newPost
                     } else {
                        const newPost = {
                            ...postState, 
                            likedByUser: true, 
                            _count:{
                                ...postState._count,
                                 likes : postState._count.likes + 1 
                            }}
                            console.log(newPost)
                         return newPost
                         };
            };