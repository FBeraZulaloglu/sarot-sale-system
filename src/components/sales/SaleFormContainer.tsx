import { useState } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Project, Room } from "@/types";
import { PropertyDetailsSection } from "./PropertyDetailsSection";
import { CustomerInfoSection } from "./CustomerInfoSection";
import { MOCK_ROOMS } from "./mockData";

interface SaleFormContainerProps {
  selectedRoom: Room | null;
  selectedProject: Project | null;
  onCancel: () => void;
  onSuccess: (projectId: string) => void;
}

export function SaleFormContainer({ 
  selectedRoom, 
  selectedProject,
  onCancel,
  onSuccess
}: SaleFormContainerProps) {
  // Form state
  const [formData, setFormData] = useState({
    projectId: selectedProject?.id || "",
    roomId: selectedRoom?.id || "",
    customerName: "",
    customerSurname: "",
    customerEmail: "",
    customerPhone: "",
    startDate: new Date(),
    paymentMethod: "credit_card" as "credit_card" | "bank_transfer" | "cash",
    includesTax: true,
    // New customer fields
    bayi: "",
    address: "",
    province: "",
    district: "",
    phone2: "",
    fax: "",
    paymentType: "deposit",
    amount: "",
    notes: "",
    advanceAmount: "",
    installmentAmount: "",
    advanceDate: "",
    installmentDate: "",
    position: "0",
    correspondenceAddress: ""
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, startDate: date }));
    }
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, includesTax: checked }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.projectId || !formData.roomId || !formData.customerName || !formData.customerSurname || !formData.customerEmail || !formData.customerPhone) {
      return;
    }
    
    // Submit form
    console.log("Form data:", formData);
    onSuccess(formData.projectId);
  };
  
  // List of available rooms (excluding sold rooms)
  const availableRooms = MOCK_ROOMS.filter(room => 
    room.status === 'available' && 
    (formData.projectId ? room.projectId === formData.projectId : true)
  );
  
  // Get room details
  const selectedRoomDetails = formData.roomId 
    ? MOCK_ROOMS.find(room => room.id === formData.roomId) 
    : null;

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        <PropertyDetailsSection 
          formData={formData}
          selectedRoomDetails={selectedRoomDetails}
          availableRooms={availableRooms}
          onSelectChange={handleSelectChange}
          onDateChange={handleDateChange}
          onCheckboxChange={handleCheckboxChange}
          selectedProject={selectedProject}
          selectedRoom={selectedRoom}
        />
        
        <Separator />
        
        <CustomerInfoSection 
          formData={formData}
          onChange={handleInputChange}
          onSelectChange={handleSelectChange}
        />
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Sale Record
        </Button>
      </CardFooter>
    </form>
  );
}
