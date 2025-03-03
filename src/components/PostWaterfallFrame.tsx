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
            <div className="search-container flex p-4">
                <input
                    type="text"
                    className="w-full p-2 ring-gray-50 rounded-l-md 
                    bg-foilLight dark:bg-bgDark text-fontLight dark:text-fontDark"
                    placeholder="Search for posts"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <select
                    className="search-type-dropdown rounded-r-md
                    bg-foilLight dark:bg-bgDark text-fontLight dark:text-fontDark"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    <option value="title">by Title</option>
                    <option value="tag">by Tag</option>
                </select>
                <button
                    className="ml-2 text-fontLight dark:text-fontDark "
                    id="searchButton"
                    onClick={debouncedHandleSearch}
                >
                    <Search />
                </button>
            </div>

            <div className="post-waterfall p-4">
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
