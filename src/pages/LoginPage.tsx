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
import {useContext, useState} from "react";
import {SesionContext} from "@/providers/sesion-provider";
import {getLogin} from "@/api/login.api";
import {SesionInterface} from "@/utils/interfaces";
import {Navigate, useNavigate} from "react-router-dom";
import {Select} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import LoadingCircle from "@/components/LoadingCircle";
import {Eye, EyeOff, SquareDashed} from "lucide-react";
import {typeModule} from "@/utils/const";

const formSchema = z.object({
  module: z.string().min(1, {
    message: "Selecciones un modulo",
  }),
  user: z.string().min(2, {
    message: "El campo de usuario es obligatorio.",
  }),
  pass: z.string().nonempty({
    message: "El campo de contraseña es obligatorio.",
  }),
});

export const LoginPage = ({className, ...props}: React.ComponentPropsWithoutRef<"div">) => {
  const {setSesion} = useContext(SesionContext);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // Obtienes la función navigate

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      module: "",
      user: "",
      pass: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingLogin(true);

    // Realiza la solicitud al API para iniciar sesión
    getLogin({
      user: values.user.toLowerCase(),
      pass: values.pass,
      module: parseInt(values.module),
    })
      .then((response) => {
        if (response.token) {
          // Almacena el token en localStorage
          window.localStorage.setItem("token-app", JSON.stringify(response.token));

          // Actualiza la sesión en el estado
          setSesion(response as SesionInterface);
          console.log("😒😒login: ", response);
          // Navega a la ruta deseada después de iniciar sesión
          navigate("/home");
        }
      })
      .finally(() => setLoadingLogin(false));
  }

  return window.localStorage.getItem("token-app") ? (
    <Navigate to="/" />
  ) : (
    <div className=" bg-muted   p-10 flex flex-col w-full min-h-svh  items-center justify-center ">
      <div
        className={cn(
          "max-w-md md:max-w-3xl grid grid-cols-2 rounded-md border overflow-hidden    w-full ",
          className
        )}
        {...props}
      >
        <div className="bg-accent   hidden md:flex xl:col-span-1  border-r   p-10  flex-col justify-between ">
          <TypographyH3 className="">Plásticos Carmen</TypographyH3>

          <SquareDashed className="w-full   h-full px-15" />

          <TypographyP className="text-foreground/70 text-right">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s.
          </TypographyP>
        </div>
        <div className=" bg-background col-span-2 md:col-span-1   px-10 py-30 flex flex-col justify-center relative">
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid  gap-2  text-center">
                <FormField
                  control={form.control}
                  name="module"
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <div className="w-full ml-5">
                              <SelectValue placeholder="Módulo" className="w-full ml-7 " />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {typeModule.map((item, index) => (
                              <SelectItem
                                value={item.value.toString()}
                                className=" justify-center"
                                key={index}
                                disabled={!item.isActive}
                              >
                                {item.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

                <div className="mt-4 text-center text-sm">
                  Problemas con el inicio de sesión?{" "}
                  <a href="#" className="underline underline-offset-4">
                    Contacto
                  </a>
                </div>
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
