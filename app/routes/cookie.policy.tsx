// import { Button } from "@/components/ui/button";
// import { Link } from "@remix-run/react";

export default function Policy() {
  return (
    <div>
      <div className="min-h-screen noise py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold ">MyResume Cookies</h1>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Introduction
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Cookies are small text files that are stored on your computer or
              mobile device when you visit a website. They allow the website to
              recognize your device and remember some information about your
              visit, which can make your next visit easier and the site more
              useful to you.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Detailed Information
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Cookies serve many functions. For example, they can help us to
              remember your username and preferences, analyze how well our
              website is performing, or even allow us to recommend content we
              believe will be most relevant to you. Certain cookies contain
              personal information – for example, if you click to "remember me"
              when logging in, a cookie will store your username. Most cookies
              won’t collect information that identifies you, and will instead
              collect more general information such as how users arrive at and
              use our websites, or a user’s general location.
            </p>
          </section>
        </main>
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400">
          <p>© 2024 Our Website. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
