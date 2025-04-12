

interface Props {
    data: string;
}
 const TypographyH3: React.FC<Props> = ({ data })=>  {
    return (
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight capitalize">
        {data}
      </h3>
    )
  }
  export default TypographyH3