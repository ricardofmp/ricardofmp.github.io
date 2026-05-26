import avatar from '../images/15.jpg';
import heroImage from '../images/01.jpg';

export const settings = {
  /* -----------------------------
   * Site
   * ----------------------------- */
  site: {
    title: 'The Analyst Report',
    logo: '', // '/images/logo.png',
    description: 'Norlin – A Beautiful Dark Blog Theme for Astro.',
    url: 'https://norlin-astro.netlify.app',
    image: '/images/og-image.jpg',
    language: 'en',
  },

  /* -----------------------------
   * SEO & Social
   * ----------------------------- */
  seo: {
    twitter: {
      handle: '@yourusername',
      site: '@yourusername',
      cardType: 'summary_large_image',
    },
    openGraph: {
      type: 'website',
    },
  },

  /* -----------------------------
   * Author
   * ----------------------------- */
  author: {
    name: 'Robert Wilson',
    src: avatar,
  },

  /* -----------------------------
   * Navigation
   * ----------------------------- */
  navigation: {
    items: [
      { title: 'Home', url: '/' },
      { title: 'Research', url: '/research/' },
      { title: 'Miscellaneous', url: '/miscellaneous/' },
      { title: 'IOC Briefs', url: '/ioc-briefs/' },
    ],
  },

  /* ----------------------------------------------------
   * Pagination settings for the homepage
   * Controls how many posts are displayed and loaded
   * ------------------------------------------------- */
  pagination: {
    initial: 8, // Number of posts to show initially on the homepage
    step: 3 // Number of additional posts to load when clicking "Load More" button
  },

  /* -----------------------------
   * Hero
   * ----------------------------- */
  hero: {
    title: 'Robert Wilson',
    description: 'Thoughts, stories and ideas.',
    src: heroImage,
  },

  /* -----------------------------
   * Social Links
   * ----------------------------- */
  // Uses Font Awesome Free 7 icons via Iconify (SVG, npm-based).
  // Other icons can be found at https://icon-sets.iconify.design/fa7-brands/
  socialLinks: [
    {
      icon: 'fa7-brands:x-twitter',
      name: 'X',
      link: 'https://x.com/',
    },
    {
      icon: 'fa7-brands:facebook-f',
      name: 'Facebook',
      link: 'https://facebook.com',
    },
    {
      icon: 'fa7-brands:dribbble',
      name: 'Dribbble',
      link: 'https://dribbble.com',
    },
    {
      icon: 'fa7-brands:instagram',
      name: 'Instagram',
      link: 'https://instagram.com',
    },
    {
      icon: 'fa7-brands:pinterest',
      name: 'Pinterest',
      link: 'https://pinterest.com',
    },
    {
      icon: 'fa7-brands:youtube',
      name: 'Youtube',
      link: 'https://youtube.com',
    },
    {
      icon: 'fa7-brands:github',
      name: 'Github',
      link: 'https://github.com',
    },
    {
      icon: 'fa7-brands:vimeo-v',
      name: 'Vimeo',
      link: 'https://vimeo.com',
    },
  ],

  /* -----------------------------
   * Contact
   * ----------------------------- */
  contact: {
    email: 'your_formspree_form_id', // Example 'mbjebqko'
  },

  /* -----------------------------
   * Comments (Disqus)
   * ----------------------------- */
  comments: {
    enabled: true,
    disqusIdentifier: 'anvodstudio-demo',
  },

  /* -----------------------------
   * Analytics
   * ----------------------------- */
  analytics: {
    google: '', // GA4 Measurement ID
  },

  /* -----------------------------
   * Newsletter
   * ----------------------------- */
  newsletter: {
    enabled: true,
    mailchimpIdentifier: 'gmail.us21.list-manage.com/subscribe/post?u=8aeb9c31a5c97a3a5f9ff2740&id=0e31fd7793',
    description: 'Subscribe to our newsletter and we’ll send you the emails of latest posts.',
    buttonText: 'Join',
  },
} as const
