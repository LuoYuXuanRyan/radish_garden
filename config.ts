interface Config {
    site_title: string;
    site_description: string;
    avatar: string;
    author: string;
    author_description: string;
    github: string;
    email: string;
    email_subject: string;
    friendlink: { [key: string]: string };
}

const config: Config = {
    site_title: 'Radish Garden',
    site_description: 'Posts grows here~',
    avatar: '/avatar.webp',
    author: 'Ryan',
    author_description: 'A CS enthusiast!',
    github: 'https://github.com/LuoYuXuanRyan',
    email: '1505172926@qq.com',
    email_subject: 'From%20Astro%20Blog%20',
    friendlink: {
        "BlockLune's Blog": 'https://blocklune.cc',
    },
};

export default config;
