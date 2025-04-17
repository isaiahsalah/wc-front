import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, TrendingUpIcon } from "lucide-react";
import React from "react";
import { DataTable } from "./ExamplePage";
import ProductionPage from "./opr/ProductionPage";

const HomePage = () => {
  return (
    <div className="">
      <ProductionPage/>
    </div>
  );
};

export default HomePage;


