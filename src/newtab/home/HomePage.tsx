import { useEffect, useState } from "react";
import DomainList, { DomainData } from "./DomainList";
import {
  deleteByDomain,
  get,
  getByDomain,
  Setting,
  SiteSetting,
} from "@/services/setting.service";
import { useLoader } from "@/providers/loader.provider";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SettingTagDialogForm from "@/components/setting-tag-form/SettingTagDialogForm";

export default function HomePage() {
  const loader = useLoader();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataList, setDataList] = useState<DomainData[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedSiteSetting, setSelectedSiteSetting] =
    useState<SiteSetting | null>(null);
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

  useEffect(() => {
    console.log("dialog change!");
  }, [confirmEditOpen]);

  function filterData() {
    return dataList.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchFilter.toLowerCase())
      )
    );
  }

  async function handleEdit(domain: string) {
    setSelectedDomain(domain);

    try {
      const currentSetting = await getByDomain(domain);
      if (!currentSetting) {
        throw new Error("Current setting not found");
      }

      setSelectedSiteSetting(currentSetting);
      setConfirmEditOpen(true);
    } catch (err) {
      setError("Failed to get current tab");
      setConfirmEditOpen(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  return (
    <>
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={() => selectedDomain && handleConfirmDelete(selectedDomain)}
      />
      <SettingTagDialogForm
        open={confirmEditOpen}
        onOpenChange={setConfirmEditOpen}
        domain={selectedDomain}
        setting={selectedSiteSetting}
        onSaveSetting={fetchInitData}
      ></SettingTagDialogForm>

      <div className="flex flex-col w-full gap-2">
        <SearchInput searchFilter={searchFilter} onChange={setSearchFilter} />

        <>
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}
          {!loading && !error && (
            <DomainList
              dataList={filteredDataList}
              onEditClick={handleEdit}
              onDeleteClick={handleDelete}
            />
          )}
        </>
      </div>
    </>
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

function SearchInput({
  searchFilter,
  onChange,
}: {
  searchFilter: string;
  onChange: (value: string) => void;
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
