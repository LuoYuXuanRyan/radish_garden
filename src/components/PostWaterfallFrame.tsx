// import PostCard from './postCard.tsx';
// import { Search } from './icons/search.tsx';
// import type { Post } from '../content.config.ts';
// import React, { useState, useEffect } from 'react';

// export default function PostWaterfallFrame({ posts }: { posts: Post[] }) {
//     const [searchInput, setSearchInput] = useState<string>("")
//     const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

    
//     const handleSearch = () => {
//         if (searchInput === "") {
//             setFilteredPosts(posts);
//         } else {
//             const filtered = posts.filter((post) =>
//                 post.data.title.toLowerCase().includes(searchInput.toLowerCase())
//             );
//             setFilteredPosts(filtered);
//         }
//     };

//     useEffect(() => {
//         handleSearch();
//     }, [searchInput]);
    
//     return (
//         <div className='md:h-screen md:overflow-y-scroll p-2 pb-24'>
//             <div className='sticky backdrop-blur p-4 w-full flex'>
//                 <input
//                     type='text'
//                     className='w-full p-2 ring-gray-50 rounded-md'
//                     placeholder='Search for posts by post title'
//                     value={searchInput}
//                     onChange={(e) => {
//                         console.log(e.target.value)
//                         setSearchInput(e.target.value)
//                     }}
//                 />
//                 <button
//                     className='ml-2 text-bodyDark dark:text-bodyLight'
//                     id="searchButton"
//                     onClick={handleSearch}
//                 >
//                     <Search />
//                 </button>
//             </div>
//             {
//                 filteredPosts.map((post) =>
//                     <a href={'/posts/' + post.id} key={post.id}>
//                         <PostCard
//                             title={post.data.title}
//                             description={post.data.description}
//                             introText={post.data.introText}
//                             tags={post.data.tags || []}
//                             author={post.data.author}
//                             pubDate={post.data.publishDate}
//                         />
//                     </a>
//                 )
//             }
//         </div>
//     )
// }

import PostCard from './postCard.tsx';
import { Search } from './icons/search.tsx';
import type { Post } from '../content.config.ts';
import React, { useState, useEffect } from 'react';
// import { debounce } from 'lodash';
import pkg from 'lodash';
const {debounce} = pkg;

export default function PostWaterfallFrame({ posts }: { posts: Post[] }) {
    const [searchInput, setSearchInput] = useState<string>("");
    const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

    const debouncedHandleSearch = debounce(() => {
        if (searchInput === "") {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter((post) =>
                post.data.title.toLowerCase().includes(searchInput.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
    }, 300);

    useEffect(() => {
        debouncedHandleSearch();
        return () => debouncedHandleSearch.cancel();
    }, [searchInput]);

    return (
        <div className='md:h-screen md:overflow-y-scroll p-2 pb-24'>
            <div className='sticky backdrop-blur p-4 w-full flex'>
                <input
                    type='text'
                    className='w-full p-2 ring-gray-50 rounded-md'
                    placeholder='Search for posts by post title'
                    value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                    }}
                />
                <button
                    className='ml-2 text-bodyDark dark:text-bodyLight'
                    id="searchButton"
                    onClick={debouncedHandleSearch}
                >
                    <Search />
                </button>
            </div>
            {
                filteredPosts.map((post) =>
                    <a href={'/posts/' + post.id} key={post.id}>
                        <PostCard
                            title={post.data.title}
                            description={post.data.description}
                            introText={post.data.introText}
                            tags={post.data.tags || []}
                            author={post.data.author}
                            pubDate={post.data.publishDate}
                        />
                    </a>
                )
            }
        </div>
    );
}
