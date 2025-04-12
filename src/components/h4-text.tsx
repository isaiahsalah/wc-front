

interface Props {
    data: string;
}
 const TypographyH4: React.FC<Props> = ({ data })=>  {
    return (
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight capitalize">
        {data}
      </h4>
    )
  }
  export default TypographyH4