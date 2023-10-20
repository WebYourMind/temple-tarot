import Head from "next/head"
import { Button } from "components/Button/Button"

export default function Web() {
  return (
    <>
      <Head>
        {/* <meta property="og:url" content="https://next-enterprise.vercel.app/" />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/Blazity/next-enterprise/main/project-logo.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" /> */}
        <title>Merlin AI</title>
      </Head>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
              Merlin AI
            </h1>
            <p className="mb-6 max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
              This page temporarily acts as the homepage of the application that should only be accessible for logged-in users.
            </p>
            <Button
              href="chat.openai.com"
              intent="secondary"
            >
              Logout
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
