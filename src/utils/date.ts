/**
 * Date utility functions
 */

/**
 * Format a date to locale string
 */
export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
}

/**
 * Sort posts by publish date (newest first)
 */
export function sortPostsByDate<T extends { data: { publishDate: Date } }>(posts: T[]): T[] {
    return posts.toSorted(
        (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime()
    );
}
