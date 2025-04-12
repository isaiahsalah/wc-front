

interface Props {
    data: string;
}
 const TypographyH2: React.FC<Props> = ({ data })=>  {
    return (
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 capitalize">
        {data}
      </h2>
    )
  }
  export default TypographyH2