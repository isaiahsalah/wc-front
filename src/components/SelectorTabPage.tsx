import { Select } from "@radix-ui/react-select";
import React from "react";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { TabsList, TabsTrigger } from "./ui/tabs";

interface Props {
  activeTab: string;
  setActiveTab: (value: string) => void;
  tabData: { id: string; label: string }[];
}

const SelectorTabPage: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  tabData,
}) => {
  return (
    <div className="flex items-center justify-between ">
      <Select value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <SelectTrigger className="md:hidden   w-full " id="view-selector">
          <SelectValue placeholder="Select a view" />
        </SelectTrigger>
        <SelectContent>
          {tabData.map((tab) => (
            <SelectItem key={tab.id} value={tab.id}>
              {tab.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <TabsList className="md:flex hidden   w-full">
        {tabData.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};

export default SelectorTabPage;
