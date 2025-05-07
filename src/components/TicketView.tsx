const TicketView = ({ticketFormat}: {ticketFormat: string[]}) => {
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
              return <div>{key}</div>;
            })}
          </div>
        </div>
        <div className="bg-transparent  flex flex-1  border-t-2 border-black text-black ">
          <div className="m-auto font-bold text-[9px]">LOTE</div>
        </div>
      </div>
    </div>
  );
};

export default TicketView;
