import type { NextPage } from "next";
import Head from "next/head";
import Upload from "../components/upload";
import styles from "../styles/Home.module.css";

const Test: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Upload function</title>
        <meta name="description" content="Upload function" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Upload />
      </main>
    </div>
  );
};

export default Test;
