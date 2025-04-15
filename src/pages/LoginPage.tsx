import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TypographyH2 from "@/components/h2-text";
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

const formSchema = z.object({
  user: z.string().min(2, {
    message: "El nombre del producto debe tener al menos 2 caracteres.",
  }),
  pass: z.string().nonempty({
    message: "La fecha de producción es obligatoria.",
  }),
});

export const LoginPage = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      pass: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div
      className={cn(
        " grid grid-cols-2 rounded-md border overflow-hidden  h-full  ",
        className
      )}
      {...props}
    >
      <div className="hidden md:flex xl:col-span-1  border-r bg-card p-10  flex-col justify-between ">
        <TypographyH3>Plásticos Carmen</TypographyH3>

        <TypographyP className="text-muted-foreground text-right">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </TypographyP>
      </div>
      <div className="col-span-2 md:col-span-1   p-10 flex flex-col justify-center relative">
        <div className="ml-auto absolute top-10 right-10">
          <ModeToggle />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid  gap-4 mx-auto   max-w-[400px] text-center"
          >
            <div className="   w-full ">
              <CardTitle className="text-3xl font-semibold  ">
                Inicio de Sesión
              </CardTitle>
              <CardDescription>
                Ingrese su cuenta y contraseña para acceder a la aplicación.
              </CardDescription>
            </div>
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-primary mt-4 ">
              Login
            </Button>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
