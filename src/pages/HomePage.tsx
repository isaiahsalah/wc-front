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
import ProductPage from "./administrator/ProductPage";

const HomePage = () => {
  return (
    <div className="">
      <ProductPage/>
    </div>
  );
};

export default HomePage;


