

interface Props {
    data: string;
}
 const TypographyH5: React.FC<Props> = ({ data })=>  {
    return (
      <h5 className="scroll-m-20 text-l font-semibold tracking-tight capitalize">
        {data}
      </h5>
    )
  }
  export default TypographyH5