/**
 * Date utility functions
 */

/**
 * Format a date to locale string
 */
export function formatDate(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Sort posts by publish date (newest first)
 */
export function sortPostsByDate<T extends { data: { publishDate: Date } }>(posts: T[]): T[] {
    return posts.toSorted(
        (a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime()
    );
}
