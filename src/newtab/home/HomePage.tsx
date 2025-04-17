import { useEffect, useState } from "react";
import DomainList, { DomainData } from "./DomainList";
import { deleteByDomain, get, Setting } from "@/services/setting.service";
import { useLoader } from "@/providers/loader.provider";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";

export default function HomePage() {
  const loader = useLoader();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataList, setDataList] = useState<DomainData[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [confirmEditOpen, setConfirmEditOpen] = useState<boolean>(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchInitData();
  }, []);

  async function handleEdit(domain: string) {
    setSelectedDomain(domain);
    setConfirmEditOpen(true);
  }

  async function handleConfirmEdit(domain: string) {
    toast("Edit not support yet!");
  }

  async function handleDelete(domain: string) {
    setSelectedDomain(domain);
    setConfirmDeleteOpen(true);
  }

  async function handleConfirmDelete(domain: string) {
    loader.startLoading();
    try {
      await deleteByDomain(domain);
      fetchInitData();
    } catch (err) {
      toast("Failed to delete setting");
      console.error(err);
    } finally {
      loader.stopLoading();
    }
  }

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

  function ConfirmEditDialog() {
    return (
      <ConfirmDialog
        open={confirmEditOpen}
        onOpenChange={setConfirmEditOpen}
        description={"Are you sure to edit?"}
        onConfirm={() => selectedDomain && handleConfirmEdit(selectedDomain)}
      />
    );
  }

  function ConfirmDeleteDialog() {
    return (
      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        description={"Are you sure to delete?"}
        onConfirm={() => selectedDomain && handleConfirmDelete(selectedDomain)}
      />
    );
  }

  function DialogRegistry() {
    return (
      <>
        <ConfirmEditDialog />
        <ConfirmDeleteDialog />
      </>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <DialogRegistry />
      <DomainList
        dataList={dataList}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
      />
    </>
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
