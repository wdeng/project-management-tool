
## Getting Started

create a Next.js app router API endpoint for retrieving novel translation. compliant to Next.js app router way and use app/api/readChapter.ts or something similar


let's use sqlalchemy instead

write mock database_queries


create a Next.js app router API endpoint for retrieving novel translation. compliant to Next.js app router way and use app/api/readChapter.ts or something similar


let's use sqlalchemy instead

write mock database_queries




a simple project management web app with Typescript Next.js App router, tailwind.css, and headless UI,
users should be able to add, delete and inspect projects, they can open the project with Github URL


rewrite the project schema from scratch following these data tables:
novel: id, title, introduction, lang_code, latest_chapter
translate_overviews: id, novel_id, title, introduction, lang_code, latest_chapter
chapter: id, novel_id, chapter_index
chapter_translations: id, chapter_id, translate_id (reference translate_overviews), title, start_text, 

please also add user management and api endpoints



Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
