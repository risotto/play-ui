import "../styles/styles.scss";
import { NextPage } from "next";
import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism, { highlight } from "prismjs";
// import { Button } from "semantic-ui-react";
import axios from "axios";
// import "semantic-ui-css/semantic.min.css";

const helloworld = `
println("Hello, world!")
`;

const URL = "https://api.play.risotto.dev";

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
        <div className="content">
          <Editor
            value={code}
            onValueChange={tempcode => setCode(tempcode)}
            highlight={code => highlight(code, Prism.languages.js, "js")}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              height: "100%"
            }}
          />
        </div>
        <div className="console">
          <p>{apiresponse.errors}</p>
          <p>{apiresponse.output}</p>
          <p>{apiresponse.status}</p>
        </div>
      </main>
    </>
  );
};

export default Home;
