import { cn } from "@/lib/utils";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import TypographyH3 from "@/components/h3-text";
import TypographyP from "@/components/p-text";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ModeToggle } from "@/components/mode-toggle";
import { useContext, useState } from "react";
import { SesionContext } from "@/providers/sesion-provider";
import { getLogin } from "@/api/login.api";
import { SesionInterface } from "@/utils/interfaces";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  area: z.string().min(2, {
    message: "Por favor, selecciona un área.",
  }),
  user: z.string().min(2, {
    message: "El campo de usuario es obligatorio.",
  }),
  pass: z.string().nonempty({
    message: "El campo de contraseña es obligatorio.",
  }),
});

export const LoginPage = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { setSesion } = useContext(SesionContext);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const navigate = useNavigate(); // Obtienes la función navigate

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      area: "",
      user: "",
      pass: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setLoadingLogin(true);

    const responde = await getLogin({ user: values.user, pass: values.pass });
    if (responde.status === 200) {
      window.localStorage.setItem(
        "token",
        JSON.stringify(responde.sesion.token)
      );
      setSesion(responde.sesion as SesionInterface);

      navigate("/home"); // Redirige a la ruta deseada después de iniciar sesión

      toast("Inicio de sesión exitoso", {
        description:
          "Bienvenido(a) de nuevo. Has ingresado correctamente a tu cuenta.",
        action: {
          label: "OK",
          onClick: () => console.log("Undo"),
        },
      });
    } else {
      toast("Error de autenticación", {
        description:
          "Las credenciales ingresadas no son válidas. Por favor, verifica tu usuario y contraseña.",
        action: {
          label: "OK",
          onClick: () => console.log("Undo"),
        },
      });
      setLoadingLogin(false);
    }
  }

  return (
    <div className="p-10 flex w-full ">
      <div
        className={cn(
          " grid grid-cols-2 rounded-md border overflow-hidden  h-full  w-full ",
          className
        )}
        {...props}
      >
        <div className="hidden md:flex xl:col-span-1  border-r bg-card p-10  flex-col justify-between ">
          <TypographyH3>Plásticos Carmen</TypographyH3>

          <TypographyP className="text-muted-foreground text-right">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s.
          </TypographyP>
        </div>
        <div className="col-span-2 md:col-span-1   p-10 flex flex-col justify-center relative">
          <div className="ml-auto absolute top-10 right-10">
            <ModeToggle />
          </div>
          <div className="grid gap-2  w-full max-w-[350px]  mx-auto ">
            <div className=" w-full text-center">
              <CardTitle className="text-3xl font-semibold  ">
                Inicio de Sesión
              </CardTitle>
              <CardDescription>
                Ingrese su area de trabajo, cuenta y contraseña para acceder a
                la aplicación.
              </CardDescription>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid  gap-2  text-center"
              >
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <div className="w-full ml-5">
                              <SelectValue
                                placeholder="Area"
                                className="w-full ml-7 "
                              />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="genencial"
                              className=" justify-center"
                            >
                              Gerencial
                            </SelectItem>
                            <SelectItem
                              value="fabric"
                              className=" justify-center"
                            >
                              Fabrica
                            </SelectItem>
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
                  render={({ field }) => (
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
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="text-center"
                          type="password"
                          placeholder="Contraseña"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-primary mt-4 "
                  disabled={loadingLogin}
                >
                  {loadingLogin ? (
                    <div className=" border-gray-300 border-t-gray-900   rounded-full h-4 w-4 animate-spin border-4" />
                  ) : (
                    "Login"
                  )}
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
