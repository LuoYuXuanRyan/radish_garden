import * as motion from "motion/react-client"
import { useMemo, memo } from "react";
import { fadeInSlideViewport } from "../config/animations";
import { formatDate } from "../utils/date";

interface PostCardProps {
    title: string;
    tags: string[];
    description: string;
    introText: string;
    author: string;
    pubDate: Date;
}

function PostCardComponent({ title, tags, description, introText, author, pubDate }: PostCardProps) {
    // 缓存日期格式化结果
    const formattedDate = useMemo(() => {
        return formatDate(pubDate);
    }, [pubDate]);

    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            {...fadeInSlideViewport}
        >
            <div
                className={`flex flex-col w-full rounded-2xl pt-4 pb-4 pl-10 pr-10 min-h-72 mb-2
                        dark:ring-ringDark hover:opacity-90 transition-all duration-300
                        bg-foilLight dark:bg-bgDark text-fontLight dark:text-fontDark
                        hover:shadow-lg shadow-bgDark dark:shadow-bgLight`}
            >
                <div className='flex flex-col md:flex-row justify-between'>
                    <h1 className='text-2xl font-bold md:max-w-lg'>{title}</h1>
                    <div className='flex gap-2 overflow-x-scroll'>
                        {
                            tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className={`text-fontLight dark:text-fontDark 
                                    rounded-lg p-1 mt-2 font-extrabold`}
                                >
                                    {tag}
                                </span>
                            ))
                        }
                    </div>
                </div>

                <p className='italic text-descriptionTextLight'>---- {description}</p>
                <p
                    className='m-4 leading-8 tracking-wider indent-8 text-justify break-words'
                >
                    {introText}
                </p>
                <div
                    className='flex justify-between text-sm text-fontLight dark:text-fontDark mt-auto'
                >
                    <span>By {author}</span>
                    <span>{formattedDate}</span>
                </div>
            </div>
        </motion.div>
    )
}

// 使用 React.memo 优化组件，避免不必要的重新渲染
export default memo(PostCardComponent);
