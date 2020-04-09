import style from "../styles/styles.scss";
import { NextPage } from "next";
import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/styles.scss";

// const helloworld = 'println("Hello, world!")\n';
const helloworld = `println("Hello, world!")\nfor i:= 1;i<1000;i+=1 {\nprintln("hi")\n}`;

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
  const [code, setCode] = useState(helloworld);
  const [apiresponse, setApiresponse] = useState<APIResponse>({
    errors: "",
    output: "",
    status: 0,
  });
  return (
    <div id={style.main} className={style.dark}>
      <header>
        <div className={style.menu}>
          <span className={style.title}>Risotto Play</span>
          <button className={style.menuButton}
            onClick={() => {
              axios
                .request<APIResponse>({
                  method: "POST",
                  url: `${process.env.playUrl}/compile`,
                  data: code,
                })
                .then((response) => {
                  const { data } = response;
                  console.log(data);
                  setApiresponse(data);
                })
                .catch((error) => {
                  setApiresponse({
                    errors: "fuckedy fuck",
                    output: "",
                    status: -1,
                  });
                  console.log(error);
                });
            }}
          >
            Run
            <span className={styles.cmd}>
            ⌘+↵
            </span>
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
