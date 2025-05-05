import {IProduction} from "@/utils/interfaces";
import {format} from "date-fns";
import React from "react";

const TicketView = ({
  production,
  ticketFormat,
}: {
  production: IProduction;
  ticketFormat: string[];
}) => {
  return (
    <div className="bg-white w-[50mm] h-[30mm] rounded-xl  flex  m-auto">
      <div className=" bg-transparent w-[48mm] h-[28mm] rounded-xl border-black border-2 m-auto flex flex-col ">
        <div className="flex bg-transparent w-[48mm] h-[22mm] ">
          <div className="  flex-1  flex  ">
            <div className="bg-black w-[18mm]  h-[18mm] m-auto text-white   flex">
              <div className="m-auto">QR</div>
            </div>
          </div>
          <div className="  flex-1   text-black text-[9px] m-auto ">
            {ticketFormat.map((key) => {
              if (key === "date") {
                return <div>{format(new Date(production.date), "dd/LL/y - HH:mm")}</div>;
              }
              if (key === "name") return <div>{production.order_detail?.product?.name}</div>;
              if (key === "amount")
                return (
                  <div>
                    {production.amount} ${production.unity?.shortname}.
                  </div>
                );
              if (key === "micronage") return <div>{production.micronage?.toString()} mm.</div>;
              const value = production[key as keyof IProduction];
              return <div>{value?.toString()}</div>;
            })}
          </div>
        </div>
        <div className="bg-transparent  flex flex-1  border-t-2 border-black text-black ">
          <div className="m-auto font-bold text-[9px]">PRODUCTO EN PROCESO</div>
        </div>
      </div>
    </div>
  );
};

export default TicketView;
