import styles from "../styles/Home.module.css";

import fs from "fs";
import path from "path";

import remark from "remark";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkExtract from "remark-extract-frontmatter";
import { parse } from "yaml";

const ARTICLE_DIR = path.join(process.cwd(), "articles");
const markdownProcessor = remark()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkExtract, { yaml: parse });

// ルーティングの情報が入ったparamsを受け取る
export async function getStaticProps() {
  const dir = await fs.promises.readdir(ARTICLE_DIR);
  const articles = dir
    .map((filename) => {
      const content = fs.readFileSync(
        path.join(ARTICLE_DIR, filename),
        "utf-8"
      );
      return {
        name: path.parse(filename).name,
        ...markdownProcessor.processSync(content).data,
      };
    })
    .sort(function (a, b) {
      // イケんのか！？イケんのか！？！？
      return a.date < b.date ? 1 : -1;
    });

  return { props: { articles } };
}

export default function Home({ articles }) {
  return (
    <div className={styles.articles}>
      {articles.map((article) => {
        return (
          <div className={styles.article}>
            <div>{article.date}</div>
            <div className={styles.articleTitle}>
              <a href={`/articles/${article.name}`}>{article.title}</a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
