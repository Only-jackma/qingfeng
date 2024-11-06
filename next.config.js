/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    domains: ['avatars.githubusercontent.com', 'raw.githubusercontent.com'],
    unoptimized: true,
  },
  env: {
    OWNER: process.env.OWNER,
    REPO: process.env.REPO,
    LABELS: 'published',

    // config
    comment: 'true', // true or false
    theme: 'both', // 'light' or 'dark' or 'both'
    rss: 'true', // true or false
    back2top: 'true', // true or false
    mail: 'z0ffy@icloud.com', // your email
    twitter: '', // your twitter
    bio: '',
  },
  basePath: process.env.DEPLOY_TARGET === 'gh-pages' && process.env.REPO !== `${process.env.OWNER}.github.io`
    ? `/${process.env.REPO}`
    : '',
}

module.exports = nextConfig
