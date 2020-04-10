import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import style from "../styles/styles.scss";

// const helloworld = 'println("Hello, world!")\n';
const helloworld = `println("Hello, world!")\n// This is a comment\n\nfunc testFunction(a1 int, a2 int) string {\n\treturn a1 + " " + a2\n}\n\ntesting := true\n\nif testing {\n\tarr := []int{5, 3, 9}\n\tfor i := 0; i < 3; i += 1 {\n\t\tprintln(testFunction(i,arr[i]))\n\t}\n} else {\n\tprintln("not testing")\n}`;

function AceEditor<P>(props: P) {
  if (typeof window !== "undefined") {
    const Ace = require("react-ace").default;
    require("ace-builds/src-noconflict/mode-golang");
    require("ace-builds/src-noconflict/theme-monokai");
    return <Ace {...props} />;
  }
  return null;
}

interface ServerResponse {
  data: APIResponse;
}

interface SuccessResponse {
  errors: string;
  output: string;
  status: number;
}
type APIResponse = SuccessResponse;

const Home: NextPage<{ userAgent: string }> = () => {
  const router = useRouter();
  const [code, setCode] = useState(helloworld);

  useEffect(() => {
    // This sets the shared code
    if (router.query.code) {
      let temp: string = router.query.code as string;
      setCode(atob(temp));
    }
  }, [router.query]);

  const [sharetext, setSharetext] = useState("Share");
  const [apiresponse, setApiresponse] = useState<APIResponse>({
    errors: "",
    output: "",
    status: 0,
  });
  let compile = () => {
    axios
      .request<APIResponse>({
        method: "POST",
        url: `${process.env.playUrl}/compile`,
        data: code,
      })
      .then((response) => {
        const { data } = response;
        setApiresponse(data);
      })
      .catch((error) => {
        setApiresponse({
          errors: "well, looks like an issue with the API",
          output: "",
          status: -1,
        });
        console.log(error);
      });
  };
  useHotkeys("command+enter", compile);

  let share = () => {
    navigator.clipboard.writeText(`${process.env.thisUrl}?code=${btoa(code)}`);
    setSharetext("Copied!");
    setTimeout(() => {
      setSharetext("Share");
    }, 2000);
  };

  return (
    <div id={style.main} className={style.dark}>
      <Head>
        <title>Risotto 🍲 Play</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <header>
        <div className={style.menu}>
          <span className={style.title}>Risotto 🍲 Play</span>
          <button className={style.menuButton} onClick={compile}>
            Run
            {/* <span className={style.cmd}>⌘+↵</span> */}
          </button>
          <button className={style.menuButton} onClick={share}>
            {sharetext}
            {/* <span className={style.cmd}>⌘+S</span> */}
          </button>
        </div>
      </header>

      <main>
        <div className={style.content}>
          <AceEditor
            value={code}
            width="100%"
            height="100%"
            className={style.editor}
            mode="golang"
            theme="monokai"
            onChange={setCode}
            fontSize={14}
            showPrintMargin={false}
            name="content"
            editorProps={{ $blockScrolling: true }}
          />
        </div>
        <div className={style.console}>
          <pre className={style.outputerr}>{apiresponse.errors}</pre>
          <pre className={style.output}>{apiresponse.output}</pre>
        </div>
      </main>
    </div>
  );
};

export default Home;
