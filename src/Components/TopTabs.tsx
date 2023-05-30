import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export type ItemType = {
  label: string;
  children?: React.ReactNode;
  key: string;
  content?: string;
};

const initailaItem: ItemType[] = JSON.parse(
  window.localStorage.getItem("app_config")!
);

const TopTabs: React.FC = () => {
  const [activeKey, setActiveKey] = useState("1");
  const navigate = useNavigate();

  const [items, setItems] = useState<ItemType[]>(() => {
    if (initailaItem?.length !== 0) {
      return initailaItem;
    } else {
      localStorage.setItem("activeTab", "1");
      return [
        {
          label: "tab 1",
          key: "1",
          content: "",
        },
      ];
    }
  });

  //   useEffect(() => {
  //    ;
  //     setActiveKey(localStorage.getItem("activeTab")!);
  //   }, [items, initailaItem]);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
    localStorage.setItem("activeTab", activeKey);
    navigate(`/${activeKey}`);
  };

  const add = () => {
    const newActiveKey = `crazynotes${Math.floor(Math.random() * 999) + 2}`;
    const newPanes = [...items];

    newPanes.push({
      label: "New Tab",
      key: newActiveKey,
      content: "",
    });

    setItems(newPanes);

    const sorageData = newPanes.map(({ children, ...rest }) => rest);
    window.localStorage.setItem("app_config", JSON.stringify(sorageData));
    setActiveKey(newActiveKey);
    localStorage.setItem("activeTab", newActiveKey);
    navigate(`/${newActiveKey}`);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item: { key: TargetKey }, i: number) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter(
      (item: { key: TargetKey }) => item.key !== targetKey
    );
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Tabs
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={onEdit}
      items={items}
    />
  );
};

export default TopTabs;
