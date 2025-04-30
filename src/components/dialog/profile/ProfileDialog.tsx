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
import {useContext, useEffect, useState} from "react";

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
import {GroupInterfaces, UserInterfaces, UserSchema} from "@/utils/interfaces";
import {SesionContext} from "@/providers/sesion-provider";
import {updateProfile} from "@/api/profile/profile.api";
import {getGroups} from "@/api/params/group.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {typeTurn} from "@/utils/const";
import {DatePicker} from "@/components/date-picker";

interface PropsEditProfile {
  children: React.ReactNode; // Define el tipo de children
  updateView: () => void; // Define the type as a function that returns void
  onOpenChange?: (open: boolean) => void;
}

export const EditProfileDialog: React.FC<PropsEditProfile> = ({
  children,
  updateView,
  onOpenChange,
}) => {
  const {sesion, setSesion} = useContext(SesionContext);

  //const [data, setData] = useState<GeneralInterfaces | never>();
  const [loadingSave, setLoadingSave] = useState(false); // Estado de carga
  const [loadingInit, setLoadingInit] = useState(false); // Estado de carga
  const [groups, setGroups] = useState<GroupInterfaces[]>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<UserInterfaces>({
    resolver: zodResolver(UserSchema),
  });

  function onSubmit(values: UserInterfaces) {
    setLoadingSave(true); // Inicia la carga
    updateProfile({data: values})
      .then((updatedProfile) => {
        console.log("Perfil actualizado:", updatedProfile);

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
      const ProductsData = await getGroups();
      setGroups(ProductsData);

      form.reset({
        id: sesion?.user.id,
        name: sesion?.user.name,
        lastname: sesion?.user.lastname,
        user: sesion?.user.user,
        pass: "",
        birthday: new Date(sesion?.user.birthday as Date),
        id_group: sesion?.user.id_group,
        phone: sesion?.user.phone,
        image: sesion?.user.image,
      });
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoadingInit(false);
      setIsDialogOpen(false); // Cierra el diálogo
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild onClick={fetchData}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestión de color</DialogTitle>
          <DialogDescription>Mostrando datos relacionados con el color.</DialogDescription>
        </DialogHeader>
        {loadingInit ? null : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" grid  gap-4 ">
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
