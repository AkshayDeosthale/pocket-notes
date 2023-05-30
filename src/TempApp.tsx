import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import TopTabs from "./Components/TopTabs";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import EditorComponent from "./Components/EditorComponent";
import { redirect, useNavigate } from "react-router-dom";

function TempApp() {
  const [fetchDetails, setfetchDetails] = useState<boolean>(true);
  const navigate = useNavigate();

  const createInitialConfig = async () => {
    window.localStorage.setItem("app_name", "Pocket Notes");
    const firstData = [
      {
        label: "tab 1",
        key: "1",
        content: "",
      },
    ];
    window.localStorage.setItem("app_config", JSON.stringify(firstData));
    setfetchDetails(false);
  };

  const checkInitialConfig = async () => {
    setfetchDetails(false);
  };

  useEffect(() => {
    if (window.localStorage.getItem("app_name") === "Pocket Notes") {
      checkInitialConfig();
    } else {
      setTimeout(() => {
        createInitialConfig();
        createInitialConfig();
      }, 2000);
      redirect("/1");
    }
  }, []);

  return (
    <div>
      {fetchDetails ? (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Spin
            wrapperClassName=" h-full w-full "
            indicator={<LoadingOutlined style={{ fontSize: 35 }} spin />}
          />
          <h3>Fetching Deatails</h3>
        </div>
      ) : (
        <div>
          <TopTabs />
          <EditorComponent />
        </div>
      )}
    </div>
  );
}

export default TempApp;
