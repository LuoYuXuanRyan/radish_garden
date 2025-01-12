import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context: any) {
    return rss({
        title: "Radish Garden | Ryan's Blog",
        description: 'Posts grows here~',
        site: context.site,
        items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),
        customData: `<language>en-us</language>`,
    });
}
