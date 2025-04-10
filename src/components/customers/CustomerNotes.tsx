
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
      staffName: "John Smith",
      content: "Customer called about room availability in the Luxury Grand Hotel project.",
    },
    {
      id: "2",
      customerId,
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      time: "14:15",
      staffName: "Sarah Johnson",
      content: "Follow-up meeting scheduled for next week to discuss financing options.",
    },
    {
      id: "3",
      customerId,
      date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      time: "11:45",
      staffName: "David Wilson",
      content: "Customer requested additional information about the amenities offered at the Seaside Resort.",
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
      toast.error("Note content cannot be empty.");
      return;
    }

    const now = new Date();
    const newNote: CustomerNote = {
      id: `note-${Date.now()}`,
      customerId,
      date: now.toISOString(),
      time: format(now, "HH:mm"),
      staffName: "Current User", // In a real app, this would be the logged-in user
      content: values.content,
    };

    setNotes([newNote, ...notes]);
    form.reset();
    toast.success("Customer note added successfully");
  };

  return (
    <div className="space-y-6">
      {/* Customer Notes History */}
      <Card>
        <CardHeader className="bg-blue-900/80 text-white">
          <CardTitle className="text-white">Customer Interaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {notes.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {notes.map((note) => (
                <div key={note.id} className="p-4 hover:bg-amber-50">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-2 font-medium text-gray-700">
                      {format(new Date(note.date), "dd.MM.yyyy")}
                    </div>
                    <div className="col-span-1 text-gray-600">{note.time}</div>
                    <div className="col-span-2 text-gray-800">{note.staffName}</div>
                    <div className="col-span-3 font-medium">{customerName}</div>
                    <div className="col-span-4 text-gray-700">{note.content}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">No interaction history available.</div>
          )}
        </CardContent>
      </Card>

      {/* Add New Note */}
      <Card>
        <CardHeader className="bg-blue-900/80 text-white">
          <CardTitle className="text-white">Add Customer Note</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel className="text-amber-900">Reference #</FormLabel>
                  <Input disabled value={customerId} className="bg-gray-100" />
                </div>
                <div>
                  <FormLabel className="text-amber-900">Date/Time</FormLabel>
                  <Input 
                    disabled 
                    value={format(new Date(), "dd/MM/yyyy HH:mm")} 
                    className="bg-gray-100" 
                  />
                </div>
                <div>
                  <FormLabel className="text-amber-900">Staff</FormLabel>
                  <Input 
                    disabled 
                    value="Current User" 
                    className="bg-gray-100" 
                  />
                </div>
                <div>
                  <FormLabel className="text-amber-900">Customer</FormLabel>
                  <Input 
                    disabled 
                    value={customerName} 
                    className="bg-gray-100" 
                  />
                </div>
              </div>

              {/* Quick Notes section removed */}

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">Note Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter customer interaction details..." 
                        className="min-h-[100px]" 
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
                  onClick={() => form.reset()}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Add Note
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
