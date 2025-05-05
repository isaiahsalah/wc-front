import clsx from "clsx";

interface Props {
  children: React.ReactNode; // Define el tipo de children
  className?: string; // Clase personalizada opcional
}

const TypographyH4: React.FC<Props> = ({children, className}) => {
  return (
    <h4 className={clsx("scroll-m-20 text-xl font-semibold tracking-tight ", className)}>
      {children}
    </h4>
  );
};
export default TypographyH4;
