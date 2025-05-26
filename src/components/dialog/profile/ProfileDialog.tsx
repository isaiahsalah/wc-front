import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {useContext, useState} from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoadingCircle from "@/components/LoadingCircle";
import {IUser, UserSchema} from "@/utils/interfaces";
import {SesionContext} from "@/providers/sesionProvider";
import {updatePassword, updateProfile} from "@/api/profile/profile.api";
import {DatePicker} from "@/components/date-picker";
import {CardDescription} from "@/components/ui/card";
import {toast} from "sonner";

interface PropsEditProfile {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
}

export const EditProfileDialog: React.FC<PropsEditProfile> = ({children, updateView}) => {
  const {sesion, setSesion} = useContext(SesionContext);

  //const [data, setData] = useState<IGeneral | never>();
  const [loadingSave, setLoadingSave] = useState(false); // Estado de carga
  const [loadingInit, setLoadingInit] = useState(false); // Estado de carga

  const form = useForm<IUser>({
    resolver: zodResolver(UserSchema),
  });

  function onSubmit(values: IUser) {
    setLoadingSave(true); // Inicia la carga
    updateProfile({data: values})
      .then((updatedProfile) => {
        setSesion({user: updatedProfile, token: sesion?.token as string});
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
        id: sesion?.user.id,
        name: sesion?.user.name,
        lastname: sesion?.user.lastname,
        user: sesion?.user.user,
        pass: "",
        birthday: new Date(sesion?.user.birthday as Date),
        id_group: sesion?.user.id_group,
        phone: sesion?.user.phone,
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
          <DialogTitle>Gestión de Perfil</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con el perfil.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
              className=" grid  gap-4 "
            >
              <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem className="col-span-2">
                      <FormDescription>Nombre</FormDescription>
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
                      <FormDescription>Apellidos</FormDescription>
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
                      <FormDescription>Telefono</FormDescription>
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
                      <FormDescription>Nacimiento</FormDescription>
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
                          placeholder="Selecciona una fecha"
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

  function onSubmit() {
    if (!newPass || !oldPass) return toast.warning("Introduce los datos");
    if (newPass != newPass2)
      return toast.warning("La nueva contraseña debe ser idéntida en ambos campos");

    setLoadingSave(true); // Inicia la carga
    updatePassword({id: sesion?.user.id as number, newPassword: newPass, oldPassword: oldPass})
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
          <DialogTitle>Gestión de Contraseña</DialogTitle>
          <DialogDescription>Edite su contraseña.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-6 gap-4 rounded-lg border p-3 shadow-sm">
          <div className="col-span-6 grid gap-2">
            <CardDescription>Contraseña Antigüa</CardDescription>
            <Input
              type="password"
              placeholder="****"
              onChange={(e) => setOldPass(e.target.value)}
            />
          </div>
          <div className="col-span-3 grid gap-2">
            <CardDescription>Contraseña Nueva</CardDescription>
            <Input
              type="password"
              placeholder="****"
              onChange={(e) => setNewPass(e.target.value)}
            />
          </div>
          <div className="col-span-3 grid gap-2">
            <CardDescription> Repita la Contraseña Nueva</CardDescription>
            <Input
              type="password"
              placeholder="****"
              onChange={(e) => setNewPass2(e.target.value)}
            />
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
