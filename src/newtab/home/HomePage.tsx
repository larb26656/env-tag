import { useEffect, useState } from "react";
import DomainList, { DomainData } from "./DomainList";
import { deleteByDomain, get, Setting } from "@/services/setting.service";
import { useLoader } from "@/providers/loader.provider";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const loader = useLoader();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataList, setDataList] = useState<DomainData[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [confirmEditOpen, setConfirmEditOpen] = useState<boolean>(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [filteredDataList, setFilteredDataList] = useState<DomainData[]>([]);

  useEffect(() => {
    setFilteredDataList(filterData);
  }, [dataList, searchFilter]);

  useEffect(() => {
    fetchInitData();
  }, []);

  function filterData() {
    return dataList.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchFilter.toLowerCase())
      )
    );
  }

  async function handleAdd() {
    toast("Handle add");
  }

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

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <DialogRegistry
        confirmEditOpen={confirmEditOpen}
        setConfirmEditOpen={setConfirmEditOpen}
        confirmDeleteOpen={confirmDeleteOpen}
        setConfirmDeleteOpen={setConfirmDeleteOpen}
        selectedDomain={selectedDomain}
        onConfirmEdit={handleConfirmEdit}
        onConfirmDelete={handleConfirmDelete}
      />

      <div className="flex flex-col w-full gap-2">
        <SearchInput
          searchFilter={searchFilter}
          onChange={setSearchFilter}
          onAddClick={handleAdd}
        />
        <DomainList
          dataList={filteredDataList}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
        />
      </div>
    </>
  );
}

function ConfirmEditDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      description={"Are you sure to edit?"}
      onConfirm={onConfirm}
    />
  );
}

function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      description={"Are you sure to delete?"}
      onConfirm={onConfirm}
    />
  );
}

function DialogRegistry({
  confirmEditOpen,
  setConfirmEditOpen,
  confirmDeleteOpen,
  setConfirmDeleteOpen,
  selectedDomain,
  onConfirmEdit,
  onConfirmDelete,
}: {
  confirmEditOpen: boolean;
  setConfirmEditOpen: (v: boolean) => void;
  confirmDeleteOpen: boolean;
  setConfirmDeleteOpen: (v: boolean) => void;
  selectedDomain: string | null;
  onConfirmEdit: (domain: string) => void;
  onConfirmDelete: (domain: string) => void;
}) {
  return (
    <>
      <ConfirmEditDialog
        open={confirmEditOpen}
        onOpenChange={setConfirmEditOpen}
        onConfirm={() => selectedDomain && onConfirmEdit(selectedDomain)}
      />
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={() => selectedDomain && onConfirmDelete(selectedDomain)}
      />
    </>
  );
}

function SearchInput({
  searchFilter,
  onChange,
  onAddClick,
}: {
  searchFilter: string;
  onChange: (value: string) => void;
  onAddClick: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="pl-8 w-full sm:w-[300px]"
          value={searchFilter}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <Button onClick={onAddClick} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" /> Add New
      </Button>
    </div>
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

  return dataList;
}
