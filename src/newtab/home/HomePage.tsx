import { useEffect, useState } from "react";
import DomainList, { DomainData } from "./DomainList";
import { get, Setting } from "@/services/setting.service";

export default function HomePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataList, setDataList] = useState<DomainData[]>([]);

  useEffect(() => {
    fetchInitData();
  }, []);

  async function fetchInitData() {
    setLoading(true);
    setDataList([]);

    try {
      const setting = await get();
      setDataList(mapToDomainList(setting));
    } catch (err) {
      setError("Failed to get current tab");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <DomainList
      dataList={dataList}
      onEditClick={function (domain: string): void {
        throw new Error("Function not implemented.");
      }}
      onDeleteClick={function (domain: string): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}

function mapToDomainList(setting: Setting) {
  const dataList: DomainData[] = [];

  Object.entries(setting).map(([key, siteSetting]) =>
    dataList.push({
      domain: key,
      enabled: siteSetting.enabled,
    })
  );

  console.log(dataList);

  return dataList;
}
