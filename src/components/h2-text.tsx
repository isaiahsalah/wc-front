import clsx from "clsx";


interface Props {
  children: React.ReactNode; // Define el tipo de children
  className?: string; // Clase personalizada opcional

}
 const TypographyH2: React.FC<Props> = ({ children, className })=>  {
    return (
      <h2  className={clsx(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 capitalize",
        className
      )}>
        {children}
      </h2>
    )
  }
  export default TypographyH2