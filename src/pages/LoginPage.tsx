import {cn} from "@/lib/utils";
import {CardDescription, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import TypographyH3 from "@/components/text/h3-text";
import TypographyP from "@/components/text/p-text";

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {ModeToggle} from "@/components/mode-toggle";
import {useContext, useEffect, useState} from "react";
import {SesionContext} from "@/providers/sesionProvider";
import {getLogin} from "@/api/login.api";
import {ISector, ISesion} from "@/utils/interfaces";
import {Navigate, useNavigate} from "react-router-dom";
import {Select} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import LoadingCircle from "@/components/LoadingCircle";
import {Eye, EyeOff} from "lucide-react";
import {typeModule} from "@/utils/const";
import PCLogoSVG from "@/components/pcLogo";
import pcImg from "../assets/pc.png";
import {AnimatePresence, motion} from "framer-motion";
import {getSectors} from "@/api/production-and-recycling/params/sector.api";

const formSchema = z.object({
  type_module: z.number(),
  user: z.string().min(2, {
    message: "El campo de usuario es obligatorio.",
  }),
  pass: z.string().nonempty({
    message: "El campo de contraseña es obligatorio.",
  }),
  id_sector: z.number().optional(),
});

export const LoginPage = ({className, ...props}: React.ComponentPropsWithoutRef<"div">) => {
  const {setSesion} = useContext(SesionContext);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sectors, setSectors] = useState<ISector[]>();

  const navigate = useNavigate(); // Obtienes la función navigate

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    getSectors({}).then((response) => setSectors(response));
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingLogin(true);
    console.log("Valores del formulario:", values);
    // Realiza la solicitud al API para iniciar sesión
    getLogin({
      user: values.user.toLowerCase(),
      pass: values.pass,
      type_module: values.type_module,
      id_sector: values.id_sector ?? 0,
    })
      .then((response) => {
        if (response.token) {
          // Almacena el token en localStorage
          window.localStorage.setItem("token-app", JSON.stringify(response.token));

          // Actualiza la sesión en el estado
          setSesion(response as ISesion);
          // Navega a la ruta deseada después de iniciar sesión
          navigate("/home");
        }
      })
      .finally(() => setLoadingLogin(false));
  }

  return window.localStorage.getItem("token-app") ? (
    <Navigate to="/" />
  ) : (
    <div className=" bg-accent dark:bg-background   p-10 flex flex-col w-full min-h-svh  items-center justify-center ">
      <div
        className={cn(
          "max-w-md md:max-w-3xl grid grid-cols-2 rounded-md border overflow-hidden    w-full ",
          className
        )}
        {...props}
      >
        <div className="relative  bg-background   hidden md:flex xl:col-span-1  border-r   p-10  flex-col justify-between ">
          <TypographyH3 className=" z-10  ">Plásticos Carmen</TypographyH3>
          <div className="   z-10  m-auto brightness-140 contrast-80 dark:contrast-90 dark:brightness-120  ">
            <PCLogoSVG
              size={250}
              fillColorCircle="#1c3997"
              fillColorRect="#142252"
              strokeColor="#991818"
            />
          </div>

          <TypographyP className=" z-10 leading-tight text-foreground/70 text-right ">
            "Empresa boliviana líder en producción y comercialización de plásticos, enfocada en la
            modernización y expansión para diversificar su oferta y brindar un servicio de
            excelencia"
          </TypographyP>

          <img
            className=" z-0 absolute top-0 right-0 h-[100%] object-cover opacity-50 contrast-80 grayscale-70 brightness-90"
            src={pcImg}
          />
        </div>
        <div className=" bg-card col-span-2 md:col-span-1   px-10 py-30 flex flex-col justify-center relative">
          <div className="ml-auto absolute top-10 right-10">
            <ModeToggle />
          </div>
          <div className="grid gap-2  w-full max-w-[350px]  mx-auto ">
            <div className=" w-full text-center">
              <CardTitle className="text-3xl font-semibold  ">Inicio de Sesión</CardTitle>
              <CardDescription>
                Ingrese su area de trabajo, cuenta y contraseña para acceder a la aplicación.
              </CardDescription>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
                className="grid gap-2 text-center"
              >
                <FormField
                  control={form.control}
                  name="type_module"
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={(value) => field.onChange(Number(value))}>
                          <SelectTrigger className="w-full">
                            <div className="w-full ml-5">
                              <SelectValue placeholder="Módulo" className="w-full ml-7 " />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {typeModule.map((item, index) => (
                              <SelectItem
                                value={item.id.toString()}
                                className=" justify-center"
                                key={index}
                                disabled={!item.isActive}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AnimatePresence>
                  {form.watch("type_module") < 4 ? (
                    <motion.div
                      initial={{height: 0, opacity: 0}}
                      animate={{height: "auto", opacity: 1}}
                      exit={{height: 0, opacity: 0}}
                      transition={{duration: 0.15}}
                      className="overflow-hidden"
                      onAnimationComplete={() => {
                        if (form.watch("type_module") > 6) {
                          form.setValue("id_sector", 0);
                        }
                      }}
                    >
                      <FormField
                        control={form.control}
                        name="id_sector"
                        render={({field}) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={(value) => field.onChange(Number(value))}>
                                <SelectTrigger className="w-full">
                                  <div className="w-full ml-5">
                                    <SelectValue placeholder="Sector" className="w-full ml-7 " />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {sectors?.map((item, index) => (
                                    <SelectItem
                                      value={item.id?.toString() ?? ""}
                                      className=" justify-center"
                                      key={index}
                                    >
                                      {item.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <FormField
                  control={form.control}
                  name="user"
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="text-center"
                          type="text"
                          placeholder="Cuenta"
                          autoComplete="username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pass"
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="text-center"
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            autoComplete="current-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant={"link"}
                            className="absolute right-0 top-1/2  -translate-y-1/2"
                            onMouseDown={() => setShowPassword(true)}
                            onMouseUp={() => setShowPassword(false)}
                            onTouchStart={() => setShowPassword(true)}
                            onTouchEnd={() => setShowPassword(false)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 opacity-50" />
                            ) : (
                              <Eye className="h-4 w-4 opacity-50" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-primary mt-4 " disabled={loadingLogin}>
                  {loadingLogin ? <LoadingCircle /> : "Login"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
  /* }*/
};

export default LoginPage;
