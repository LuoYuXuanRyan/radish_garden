import * as motion from "motion/react-client"

interface PostCardProps {
    title: string;
    tags: string[];
    description: string;
    introText: string;
    author: string;
    pubDate: Date;
}

export default function PostCard({ title, tags, description, introText, author, pubDate }: PostCardProps) {
    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0.9, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
                duration: 0.4,
            }}
        >
            <div
                className={`flex flex-col w-full rounded-2xl pt-4 pb-4 pl-10 pr-10 min-h-72 mb-2
                        dark:ring-ringDark hover:opacity-90 transition-all duration-300
                        bg-foilLight dark:bg-bgDark text-fontLight dark:text-fontDark
                        hover:shadow-lg shadow-bgDark dark:shadow-bgLight`}
            >
                <div className='flex flex-col md:flex-row justify-between'>
                    <h1 className='text-2xl font-bold'>{title}</h1>
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
                    <span>{new Date(pubDate).toLocaleDateString()}</span>
                </div>
            </div>
        </motion.div>
    )
}
