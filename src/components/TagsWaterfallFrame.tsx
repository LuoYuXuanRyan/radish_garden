import type { CollectionEntry } from 'astro:content';
import { formatDate } from '../utils/date';
import React, { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { fadeInSlideViewport, fadeInUpViewport } from '../config/animations';

interface TagGroup {
    tag: string;
    posts: CollectionEntry<"posts">[];
    count: number;
}

interface TagsWaterfallFrameProps {
    tagGroups: TagGroup[];
    totalPosts: number;
    totalTags: number;
}

export default function TagsWaterfallFrame({ tagGroups, totalPosts, totalTags }: TagsWaterfallFrameProps) {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const handleTagClick = (tag: string) => {
        if (selectedTag === tag) {
            setSelectedTag(null);
        } else {
            setSelectedTag(tag);
        }
        setIsInitialLoad(false);
    };

    const getButtonStyle = (tag: string): string => {
        const baseClasses = 'inline-block px-3 py-1 rounded-lg font-bold text-sm transition-all duration-300 cursor-pointer ';
        if (selectedTag === tag) {
            return baseClasses + 'bg-phOrange text-phWhite';
        }
        return baseClasses + 'bg-foilLight dark:bg-bgDark text-fontLight dark:text-fontDark hover:opacity-80';
    };

    const isSectionVisible = (tag: string): boolean => {
        return selectedTag === null || selectedTag === tag;
    };

    return (
        <div>
            {/* Page Title */}
            <div className="px-4 pt-4">
                <h1 className="text-3xl font-bold text-fontLight dark:text-fontDark mb-2">
                    标签聚合
                </h1>
                <p className="text-sm text-descriptionTextLight dark:text-descriptionTextDark">
                    共 {totalTags} 个标签，{totalPosts} 篇文章
                </p>
            </div>

            {/* Tags Cloud */}
            <div className="px-4 pt-4 flex flex-wrap gap-2" id="tags-cloud">
                {tagGroups.map((group) => (
                    <motion.button
                        key={group.tag}
                        className="tag-filter-btn"
                        onClick={() => handleTagClick(group.tag)}
                        {...fadeInUpViewport}
                    >
                        <span className={getButtonStyle(group.tag)}>
                            {group.tag} ({group.count})
                        </span>
                    </motion.button>
                ))}
            </div>

            {/* Tags List */}
            <div className="p-4" id="tags-list">
                <AnimatePresence mode="popLayout">
                    {tagGroups.map((group, index) => (
                        isSectionVisible(group.tag) && (
                            <motion.div
                                key={selectedTag ? `${selectedTag}-${group.tag}` : group.tag}
                                className="tag-section mb-4"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{
                                    duration: 0.3,
                                    delay: isInitialLoad ? index * 0.05 : 0
                                }}
                            >
                                <div className="rounded-2xl pt-4 pb-4 pl-10 pr-10
                                    bg-foilLight dark:bg-bgDark
                                    text-fontLight dark:text-fontDark
                                    transition-all duration-300
                                    hover:shadow-lg shadow-bgDark dark:shadow-bgLight">

                                    {/* Tag Title */}
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-phOrange">
                                            #{group.tag}
                                        </h2>
                                        <span className="text-sm text-descriptionTextLight dark:text-descriptionTextDark">
                                            {group.count} 篇文章
                                        </span>
                                    </div>

                                    {/* Posts List */}
                                    <div className="space-y-3">
                                        {group.posts.map((post) => (
                                            <a
                                                key={post.id}
                                                href={`/posts/${post.id}`}
                                                className="block p-3 rounded-lg
                                                    hover:bg-bgLight dark:hover:bg-bgDark
                                                    transition-all duration-200
                                                    border-l-4 border-phOrange
                                                    hover:pl-4"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                                                    <h3 className="text-lg font-semibold hover:text-phOrange transition-colors">
                                                        {post.data.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-sm text-descriptionTextLight dark:text-descriptionTextDark">
                                                        <span>{post.data.author}</span>
                                                        <span>{formatDate(post.data.publishDate)}</span>
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-sm text-descriptionTextLight dark:text-descriptionTextDark line-clamp-2">
                                                    {post.data.description}
                                                </p>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
