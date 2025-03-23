import PostCard from './postCard.tsx';
import { Search } from './icons/search.tsx';
import type { Post } from '../content.config.ts';
import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

export default function PostWaterfallFrame({ posts }: { posts: Post[] }) {
    const [searchInput, setSearchInput] = useState<string>("");
    const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
    const [searchType, setSearchType] = useState<string>('title');

    const debouncedHandleSearch = debounce(() => {
        if (searchInput === "") {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter((post) =>
                searchType === 'title'
                    ? post.data.title.toLowerCase().includes(searchInput.toLowerCase())
                    : post.data.tags.some(tag => tag.toLowerCase().includes(searchInput.toLowerCase()))
            );
            setFilteredPosts(filtered);
        }
    }, 300);

    useEffect(() => {
        debouncedHandleSearch();
    }, [searchInput, searchType]);

    return (
        <div>
            <div className="flex px-4 pt-4">
                <button
                    className="pl-2 rounded-l-md bg-foilLight dark:bg-bgDark text-fontLight dark:text-fontDark"
                    id="searchButton"
                    onClick={debouncedHandleSearch}
                >
                    <Search />
                </button>
                <input
                    type="text"
                    className="w-full p-2
                    bg-foilLight dark:bg-bgDark text-fontLight dark:text-fontDark"
                    placeholder="Search for posts"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <div className='inline-flex rounded-r-md bg-foilLight dark:bg-bgDark text-fontLight dark:text-fontDark'>
                    <select
                        className="pl-2 appearance-none bg-foilLight dark:bg-bgDark"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="title">by Title</option>
                        <option value="tag">by Tag</option>
                    </select>
                    <div className="flex items-center">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.071L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {filteredPosts.map((post) => (
                    <a href={`/posts/${post.id}`} key={post.id}>
                        <PostCard
                            title={post.data.title}
                            description={post.data.description}
                            introText={post.data.introText}
                            tags={post.data.tags}
                            author={post.data.author}
                            pubDate={post.data.publishDate}
                        />
                    </a>
                ))}
            </div>
        </div>
    );
}
