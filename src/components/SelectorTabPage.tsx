import {Select} from "@radix-ui/react-select";
import React, {useContext, useEffect, useState} from "react";
import {SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "./ui/tabs";
import {IPageItem} from "@/utils/const";
import {PageContext} from "@/providers/pageProvider";
import {Separator} from "./ui/separator";
import {SesionContext} from "@/providers/sesionProvider";
import {IPermission} from "@/utils/interfaces";
import {ProcessContext} from "@/providers/processProvider";

interface Props {
  tabData: IPageItem[];
}

const SelectorTabPage: React.FC<Props> = ({tabData}) => {
  const [activeTab, setActiveTab] = useState(tabData[0]);

  const {setPage} = useContext(PageContext);

  const {sesion} = useContext(SesionContext);
  const {process} = useContext(ProcessContext);

  const permissions = (sesion?.user.permissions as IPermission[]).filter(
    (per) => per.id_process === (process?.id as number)
  );
  useEffect(() => {
    console.log("🅿️", process?.id, "🅿️", permissions);
  }, [process]);

  useEffect(() => {
    setActiveTab(tabData[0]);
  }, [tabData]);

  useEffect(() => {
    setPage(activeTab);
  }, [activeTab, setPage]);

  return (
    <Tabs
      value={activeTab.id.toString()}
      onValueChange={(value) => {
        const selectedTab = tabData.find((tab) => tab.id.toString() === value);
        if (selectedTab) setActiveTab(selectedTab);
      }}
      className="flex w-full flex-col justify-start gap-2  h-full"
    >
      <div className="flex items-center justify-between  ">
        <Select
          value={activeTab.id.toString()}
          onValueChange={(value) => {
            const selectedTab = tabData.find((tab) => tab.id.toString() === value);
            if (selectedTab) setActiveTab(selectedTab);
          }}
        >
          <SelectTrigger className="md:hidden   w-full " id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            {tabData.map((tab) => (
              <SelectItem key={tab.id} value={tab.id.toString()}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <TabsList className="md:flex hidden   w-full">
          {tabData.map((tab) => {
            const degree = permissions?.find((perm) => perm.screen === tab.id)?.degree ?? 0;
            if (degree < 1) return null;

            return (
              <TabsTrigger key={tab.id} value={tab.id.toString()}>
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
      <Separator />
      {tabData.map((tab) => {
        const degree = permissions?.find((perm) => perm.screen === tab.id)?.degree ?? 0;
        if (degree < 1) return;
        else
          return (
            <TabsContent key={tab.id} value={tab.id.toString()}>
              <tab.page degree={degree} />
            </TabsContent>
          );
      })}
    </Tabs>
  );
};

export default SelectorTabPage;
