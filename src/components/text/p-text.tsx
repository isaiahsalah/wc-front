import clsx from "clsx";

interface Props {
  children: React.ReactNode; // Define el tipo de children
  className?: string; // Clase personalizada opcional
}

const TypographyP: React.FC<Props> = ({children, className}) => {
  return (
    <h5 className={clsx("scroll-m-20 text-sm font-normal tracking-tight ", className)}>
      {children}
    </h5>
  );
};
export default TypographyP;
