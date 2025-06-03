import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useContext, useState} from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoadingCircle from "@/components/LoadingCircle";
import {ISystemUser, SystemUserSchema} from "@/utils/interfaces";
import {SesionContext} from "@/providers/sesionProvider";
import {updatePassword, updateProfile} from "@/api/profile/profile.api";
import {DatePicker} from "@/components/date-picker";
import {toast} from "sonner";
import {Eye, EyeOff} from "lucide-react";

interface PropsEditProfile {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const EditProfileDialog: React.FC<PropsEditProfile> = ({children, updateView}) => {
  const {sesion, setSesion} = useContext(SesionContext);

  //const [data, setData] = useState<IGeneral | never>();
  const [loadingSave, setLoadingSave] = useState(false); // Estado de carga
  const [loadingInit, setLoadingInit] = useState(false); // Estado de carga

  const form = useForm<ISystemUser>({
    resolver: zodResolver(SystemUserSchema),
  });

  function onSubmit(values: ISystemUser) {
    setLoadingSave(true); // Inicia la carga
    updateProfile({data: values})
      .then((updatedProfile) => {
        setSesion({sys_user: updatedProfile, token: sesion?.token as string});
        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar el Perfil:", error);
      })
      .finally(() => {
        setLoadingSave(false); // Finaliza la carga
      });
  }

  const fetchData = async () => {
    setLoadingInit(true);
    try {
      form.reset({
        id: sesion?.sys_user.id,
        name: sesion?.sys_user.name,
        lastname: sesion?.sys_user.lastname,
        user: sesion?.sys_user.user,
        pass: "",
        birthday: new Date(sesion?.sys_user.birthday as Date),
        id_work_group: sesion?.sys_user.id_work_group,
        phone: sesion?.sys_user.phone,
      });
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoadingInit(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild onClick={fetchData}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
              className="grid gap-2"
            >
              <div className="grid grid-cols-6 gap-2 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <Input placeholder="Nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastname"
                  render={({field}) => (
                    <FormItem className="col-span-4">
                      <FormControl>
                        <Input placeholder="Apellidos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormControl>
                        <Input placeholder="Telefono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({field}) => (
                    <FormItem className="col-span-3">
                      <FormControl>
                        <DatePicker
                          className="w-full"
                          value={
                            field.value && typeof field.value === "string"
                              ? new Date(field.value)
                              : field.value
                          }
                          onChange={(date) => {
                            if (date) {
                              const adjustedDate = new Date(date);
                              adjustedDate.setHours(0, 0, 0, 0);
                              field.onChange(adjustedDate);
                            } else {
                              field.onChange(null);
                            }
                          }}
                          placeholder="Fecha de Nacimiento"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className=" grid grid-cols-6  ">
                <Button
                  type="submit"
                  className="col-span-3"
                  disabled={!form.formState.isDirty || loadingSave}
                >
                  {loadingSave ? <LoadingCircle /> : "Guardar"}
                </Button>

                <DialogClose className="col-span-3" asChild>
                  <Button type="button" variant="outline" className="w-full" disabled={loadingSave}>
                    Cerrar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface PropsEditPass {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const EditPassDialog: React.FC<PropsEditPass> = ({children, updateView}) => {
  const {sesion} = useContext(SesionContext);
  const [newPass2, setNewPass2] = useState<string>();

  const [oldPass, setOldPass] = useState<string>();
  const [newPass, setNewPass] = useState<string>();

  const [loadingSave, setLoadingSave] = useState(false); // Estado de carga
  const [showPassword, setShowPassword] = useState(false);

  function onSubmit() {
    if (!newPass || !oldPass) return toast.warning("Introduce los datos");
    if (newPass != newPass2)
      return toast.warning("La nueva contraseña debe ser idéntida en ambos campos");

    setLoadingSave(true); // Inicia la carga
    updatePassword({
      id: sesion?.sys_user.id as number,
      newPassword: newPass,
      oldPassword: oldPass,
    })
      .then(() => {
        //setSesion({user: updatedProfile, token: sesion?.token as string});
        updateView();
      })
      .catch((error) => {
        console.error("Error al actualizar el Perfil:", error);
      })
      .finally(() => {
        setLoadingSave(false); // Finaliza la carga
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Contraseña</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-6 gap-2 rounded-lg border p-3 shadow-sm">
          <div className="col-span-2 grid gap-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Antigüa"
                autoComplete="current-password"
                onChange={(e) => setOldPass(e.target.value)}
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
          </div>
          <div className="col-span-2 grid gap-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Nueva"
                autoComplete="current-password"
                onChange={(e) => setNewPass(e.target.value)}
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
          </div>
          <div className="col-span-2 grid gap-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Repita la Nueva"
                autoComplete="current-password"
                onChange={(e) => setNewPass2(e.target.value)}
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
          </div>
        </div>

        <DialogFooter className=" grid grid-cols-6  ">
          <Button type="submit" onClick={onSubmit} className="col-span-3" disabled={loadingSave}>
            {loadingSave ? <LoadingCircle /> : "Guardar"}
          </Button>

          <DialogClose className="col-span-3" asChild>
            <Button type="button" variant="outline" className="w-full" disabled={loadingSave}>
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
