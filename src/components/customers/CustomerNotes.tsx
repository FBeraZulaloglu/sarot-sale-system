
import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the type for customer notes
interface CustomerNote {
  id: string;
  customerId: string;
  date: string;
  time: string;
  staffName: string;
  content: string;
}

// Define the form values type
interface NoteFormValues {
  content: string;
}

interface CustomerNotesProps {
  customerId: string;
  customerName: string;
}

export function CustomerNotes({ customerId, customerName }: CustomerNotesProps) {
  // No predefined notes anymore

  // Sample mock data for customer notes
  const [notes, setNotes] = useState<CustomerNote[]>([
    {
      id: "1",
      customerId,
      date: new Date().toISOString(),
      time: "10:30",
      staffName: "Ahmet Yılmaz",
      content: "Müşteri Sarot Grand Resort projesindeki oda müsaitliği hakkında aradı.",
    },
    {
      id: "2",
      customerId,
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      time: "14:15",
      staffName: "Zeynep Kaya",
      content: "Finansman seçeneklerini görüşmek için önümüzdeki hafta takip toplantısı planlandı.",
    },
    {
      id: "3",
      customerId,
      date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      time: "11:45",
      staffName: "Mehmet Çelik",
      content: "Müşteri Sarot Termal tesisindeki olanaklar hakkında ek bilgi talep etti.",
    },
  ]);

  // Setup form
  const form = useForm<NoteFormValues>({
    defaultValues: {
      content: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: NoteFormValues) => {
    if (!values.content.trim()) {
      toast.error("Not içeriği boş olamaz.");
      return;
    }

    const now = new Date();
    const newNote: CustomerNote = {
      id: `note-${Date.now()}`,
      customerId,
      date: now.toISOString(),
      time: format(now, "HH:mm"),
      staffName: "Mevcut Kullanıcı", // In a real app, this would be the logged-in user
      content: values.content,
    };

    setNotes([newNote, ...notes]);
    form.reset();
    toast.success("Müşteri notu başarıyla eklendi");
  };

  return (
    <div className="space-y-6">
      {/* Customer Notes History */}
      <Card className="border-blue-200 shadow-md">
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
          <CardTitle className="text-blue-900 dark:text-blue-100">Müşteri Etkileşim Geçmişi</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {notes.length > 0 ? (
            <div className="divide-y divide-blue-100">
              {notes.map((note) => (
                <div key={note.id} className="p-4 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-2 font-medium text-blue-900 dark:text-blue-300">
                      {format(new Date(note.date), "dd.MM.yyyy")}
                    </div>
                    <div className="col-span-1 text-blue-700 dark:text-blue-400">{note.time}</div>
                    <div className="col-span-2 text-blue-800 dark:text-blue-300">{note.staffName}</div>
                    <div className="col-span-3 font-medium text-blue-900 dark:text-blue-200">{customerName}</div>
                    <div className="col-span-4 text-blue-700 dark:text-blue-400">{note.content}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-blue-600/70 dark:text-blue-400/70">Etkileşim geçmişi bulunamadı.</div>
          )}
        </CardContent>
      </Card>

      {/* Add New Note */}
      <Card className="border-blue-200 shadow-md">
        <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
          <CardTitle className="text-blue-900 dark:text-blue-100">Müşteri Notu Ekle</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel className="text-blue-900">Referans #</FormLabel>
                  <Input disabled value={customerId} className="bg-blue-50 border-blue-200" />
                </div>
                <div>
                  <FormLabel className="text-blue-900">Tarih/Saat</FormLabel>
                  <Input 
                    disabled 
                    value={format(new Date(), "dd/MM/yyyy HH:mm")} 
                    className="bg-blue-50 border-blue-200" 
                  />
                </div>
                <div>
                  <FormLabel className="text-blue-900">Personel</FormLabel>
                  <Input 
                    disabled 
                    value="Mevcut Kullanıcı" 
                    className="bg-blue-50 border-blue-200" 
                  />
                </div>
                <div>
                  <FormLabel className="text-blue-900">Müşteri</FormLabel>
                  <Input 
                    disabled 
                    value={customerName} 
                    className="bg-blue-50 border-blue-200" 
                  />
                </div>
              </div>

              {/* Quick Notes section removed */}

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-900">Not İçeriği</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Müşteri etkileşim detaylarını girin..." 
                        className="min-h-[100px] border-blue-200 focus-visible:ring-blue-400" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-blue-300 hover:bg-blue-50 text-blue-800"
                  onClick={() => form.reset()}
                >
                  İptal
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Not Ekle
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
