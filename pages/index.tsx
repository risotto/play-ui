import style from "../styles/styles.scss";
import { NextPage } from "next";
import React, { useState } from "react";
import axios from "axios";

const helloworld = 'println("Hello, world!")\n';

const URL = "https://api.play.risotto.dev";

function AceEditor<P>(props: P) {
  if (typeof window !== 'undefined') {
    const Ace = require('react-ace').default;
    require('ace-builds/src-noconflict/mode-golang');
    require('ace-builds/src-noconflict/theme-monokai');
    return <Ace {...props}/>
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
    status: 0
  });
  return (
    <>
      <header>
        <h1>Risotto Play</h1>
        <button
          onClick={() => {
            axios
              .request<APIResponse>({
                method: "POST",
                url: `${URL}/compile`,
                data: code
              })
              .then(response => {
                const { data } = response;
                console.log(data);
                setApiresponse(data);
              })
              .catch(error => {
                setApiresponse({
                  errors: "fuckedy fuck",
                  output: "",
                  status: -1
                });
                console.log(error);
              });

          }}
        >
          Run
        </button>
      </header>

      <main>
        <div className={style.content}>
          <AceEditor
          value={code}
          width="100%"
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
    </>
  );
};

export default Home;
