import clsx from "clsx";


interface Props {
  children: React.ReactNode; // Define el tipo de children
  className?: string; // Clase personalizada opcional
}

 const TypographyH3: React.FC<Props> = ({ children, className })=>  {
    return (
      <h3 className={clsx(
        "scroll-m-20 text-2xl font-semibold tracking-tight capitalize",
        className)}>
        {children}
      </h3>
    )
  }
  export default TypographyH3